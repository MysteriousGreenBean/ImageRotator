using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
using AvatarRotator.Dto;
using AvatarRotator.Models;
using Dapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AvatarRotator.Controllers
{

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
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet]
        public async Task<IActionResult> GetRotations()
        {
            int userID = this.GetAuthenticatedUserID();

            IEnumerable<Rotation> result =
                await this._connection.QueryAsync<Rotation>("SELECT * FROM Rotations WHERE OwnerID = @uid",
                    new {uid = userID});

            return this.Ok(result.ToArray());
        }

        // POST: api/Rotations
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
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

        // UPDATE: api/Rotations
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPatch]
        public async Task<IActionResult> PatchRotation([FromBody] RotationDto rotationDto)
        {
            if (string.IsNullOrWhiteSpace(rotationDto.Name))
                return this.BadRequest("Name cannot be empty");

            var rotation = this._connection.QueryFirstOrDefault<Rotation>("SELECT * FROM Rotations WHERE ID = @id",
                new { id = rotationDto.ID });

            if (rotation == null)
                return this.Forbid();

            int userID = this.GetAuthenticatedUserID();

            if (rotation.OwnerID != userID)
                return this.Unauthorized("This rotation doesn't belong to the user.'");

            await this._connection.ExecuteAsync(
                "UPDATE Rotations SET Name = @name, Modified = @modified WHERE ID = @id", new
                {
                    id = rotationDto.ID,
                    Name = rotationDto.Name,
                    Modified = DateTime.UtcNow
                });

            return this.Ok();
        }

        // DELETE: api/Rotations
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpDelete]
        public async Task<IActionResult> DeleteRotation([FromBody] RotationDto rotationDto)
        {
            var rotation = this._connection.QueryFirstOrDefault<Rotation>("SELECT * FROM Rotations WHERE ID = @id",
                new { id = rotationDto.ID });

            if (rotation == null)
                return this.Forbid();

            int userID = this.GetAuthenticatedUserID();

            if (rotation.OwnerID != userID)
                return this.Unauthorized("This rotation doesn't belong to the user.'");

            await this._connection.ExecuteAsync("DELETE FROM Images WHERE RotationID = @id", new { id = rotationDto.ID });
            await this._connection.ExecuteAsync("DELETE FROM Rotations WHERE ID = @id", new { id = rotationDto.ID });


            return this.Ok();
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