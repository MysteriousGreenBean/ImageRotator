using AvatarRotator.Models;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace AvatarRotator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AvatarController : ControllerBase
    {
        private readonly SqlConnection _sqlConnection;

        public AvatarController(SqlConnection sqlConnection)
        {
            this._sqlConnection = sqlConnection;
        }

        // GET: api/avatar/NQ==
        [HttpGet("{rotationHash}")]
        public async Task<IActionResult> GetImage([FromRoute] string rotationHash)
        {
            string decodedRotation = this.Base64Decode(rotationHash);

            if (decodedRotation == null)
                return this.NotFound();

            if (!int.TryParse(decodedRotation, out int rotationId))
                return this.BadRequest("Not valid id.");

            Image[] rotationImages =
                (await this._sqlConnection.QueryAsync<Image>(
                    "SELECT * FROM Images WHERE RotationID = @id ORDER BY Added", new {id = rotationId})).ToArray();

            int randomIndex = new Random().Next(0, rotationImages.Length);

            (Stream imageStream, string contentType) = await this.GetImageFromLink(rotationImages[randomIndex].Link);

            if (imageStream == null || string.IsNullOrWhiteSpace(contentType))
                return this.NotFound();

            return new FileStreamResult(imageStream, contentType);
        }

        private async Task<(Stream imageStream, string contentType)> GetImageFromLink(string imageUrlAddress)
        {
            WebRequest webRequest = WebRequest.Create(imageUrlAddress);
            try
            {
                WebResponse webResponse = await webRequest.GetResponseAsync();
                return (webResponse.GetResponseStream(), webResponse.ContentType);
            }
            catch //If exception thrown then couldn't get response from address 
            {
                return (null, null);
            }
        }

        private string Base64Decode(string encodedString)
        {
            try
            {
                byte[] data = Convert.FromBase64String(encodedString);
                return Encoding.UTF8.GetString(data);
            }
            catch (Exception e)
            {
                return null;
            }

        }
    }
}