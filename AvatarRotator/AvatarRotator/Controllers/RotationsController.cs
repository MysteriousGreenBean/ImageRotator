using AvatarRotator.Dto;
using AvatarRotator.Models;
using Dapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace AvatarRotator.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class RotationsController : ControllerBase
    {
        private readonly SqlConnection _connection;

        public RotationsController(SqlConnection connection)
        {
            this._connection = connection;
        }

        // GET: api/Rotations
        [HttpGet]
        public async Task<IActionResult> GetRotations()
        {
            int userID = this.GetAuthenticatedUserID();

            IEnumerable<Rotation> result =
                await this._connection.QueryAsync<Rotation>("SELECT * FROM Rotations WHERE OwnerID = @uid",
                    new {uid = userID});

            return this.Ok(result.ToArray());
        }

        // GET: api/Rotations/5
        [HttpGet("{rotationId}")]
        public async Task<IActionResult> GetRotationImages([FromRoute] int rotationId)
        {
            (Rotation rotation, IActionResult responseIfInvalid) = await this.GetRotationIfExistsAndUserHasAccessToIt(rotationId);

            if (rotation == null)
                return responseIfInvalid;

            IEnumerable<Image> rotationImages =
                await this._connection.QueryAsync<Image>("SELECT * FROM Images WHERE RotationID = @Id",
                    new {id = rotation.ID });

            return this.Ok(rotationImages.ToArray());
        }

        // POST: api/Rotations
        [HttpPost]
        public async Task<IActionResult> AddRotation([FromBody] RotationDto rotationDto)
        {
            if (string.IsNullOrWhiteSpace(rotationDto.Name))
                return this.BadRequest("Name cannot be empty");

            int userID = this.GetAuthenticatedUserID();

            int insertedRotationID = await this._connection.ExecuteScalarAsync<int>(
                @"INSERT INTO [dbo].[Rotations]
                       ([OwnerID]
                       ,[Name]
                       ,[Added]
                       ,[Modified])
                 VALUES
                       (@ownerID
                       ,@rotationName
                       ,@addedTime
                       ,@addedTime);
                SELECT CAST(SCOPE_IDENTITY() as int)",
                new
                {
                    ownerID = userID,
                    rotationName = rotationDto.Name,
                    addedTime = DateTime.UtcNow
                });

            return this.Ok(new
                { rotationID = insertedRotationID, link = this.Base64Encode(insertedRotationID.ToString()) });
        }

        // POST: api/Rotations
        [HttpPost("{rotationId}")]
        public async Task<IActionResult> AddImageToRotation([FromRoute] int rotationId, [FromBody] ImageDto imageDto)
        {
            if (string.IsNullOrWhiteSpace(imageDto.Link))
                return this.BadRequest("Image link cannot be empty.");

            Task<bool> isImageLinkValid = this.ImageLinkExists(imageDto.Link);

            (Rotation rotation, IActionResult responseIfInvalid) = await this.GetRotationIfExistsAndUserHasAccessToIt(rotationId);

            if (rotation == null)
                return responseIfInvalid;

            if (!await isImageLinkValid)
                return this.Forbid("Link doesn't target an image.'");

            int insertedImageID = await this._connection.ExecuteScalarAsync<int>(
                @"INSERT INTO [dbo].[Images]
                   ([RotationID]
                   ,[Link]
                   ,[Added])
             VALUES
                   (@id,
                   @link,
                   @added);
            SELECT CAST(SCOPE_IDENTITY() as int)", new {id = rotationId, link = imageDto.Link, added = DateTime.UtcNow});

            return this.Ok(new { imageId = insertedImageID, link = imageDto.Link });
        }

        // UPDATE: api/Rotations
        [HttpPatch]
        public async Task<IActionResult> PatchRotation([FromBody] RotationDto rotationDto)
        {
            if (string.IsNullOrWhiteSpace(rotationDto.Name))
                return this.BadRequest("Name cannot be empty");

            (Rotation rotation, IActionResult responseIfInvalid) = await this.GetRotationIfExistsAndUserHasAccessToIt(rotationDto.ID);

            if (rotation == null)
                return responseIfInvalid;

            await this._connection.ExecuteAsync(
                "UPDATE Rotations SET Name = @name, Modified = @modified WHERE ID = @id", new
                {
                    id = rotationDto.ID,
                    Name = rotationDto.Name,
                    Modified = DateTime.UtcNow
                });

            return this.Ok();
        }

        // DELETE: api/Rotations/5?ImageId=4
        [HttpDelete("{rotationId}")]
        public async Task<IActionResult> DeleteImage([FromRoute] int rotationId, [FromQuery] int? imageId)
        {
            (Rotation rotation, IActionResult responseIfInvalid) = await this.GetRotationIfExistsAndUserHasAccessToIt(rotationId);

            if (rotation == null)
                return responseIfInvalid;

            if (imageId.HasValue)
            {
                await this._connection.ExecuteAsync("DELETE FROM Images WHERE ID = @id", new { id = imageId.Value });
            }
            else
            {
                await this._connection.ExecuteAsync("DELETE FROM Images WHERE RotationID = @id", new { id = rotation.ID });
                await this._connection.ExecuteAsync("DELETE FROM Rotations WHERE ID = @id", new { id = rotation.ID });
            }

            return this.Ok();
        }

        private async Task<(Rotation rotation, IActionResult responseIfInvalid)> GetRotationIfExistsAndUserHasAccessToIt(int rotationId)
        {
            Rotation rotation = await this._connection.QueryFirstOrDefaultAsync<Rotation>("SELECT * FROM Rotations WHERE ID = @id",
                new { id = rotationId });

            if (rotation == null)
                return (null, this.Forbid());

            int userID = this.GetAuthenticatedUserID();

            if (rotation.OwnerID != userID)
                return (null, this.Unauthorized("This rotation doesn't belong to the user.'"));

            return (rotation, null);
        }

        private async Task<bool> ImageLinkExists(string imageUrlAddress)
        {
            WebRequest webRequest = WebRequest.Create(imageUrlAddress);
            try
            {
                WebResponse webResponse = await webRequest.GetResponseAsync();
                string contentType = webResponse.Headers.Get("Content-Type");
                return contentType != null ? contentType.StartsWith("image/") : false;
            }
            catch //If exception thrown then couldn't get response from address 
            {
                return false;
            }
        }

        public string Base64Encode(string plainText)
        {
            byte[] plainTextBytes = Encoding.UTF8.GetBytes(plainText);
            return Convert.ToBase64String(plainTextBytes);
        }

        private int GetAuthenticatedUserID()
            => Convert.ToInt32(this.User.Identity.Name);
    }
}