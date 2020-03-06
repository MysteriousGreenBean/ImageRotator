using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
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
            int userID = Convert.ToInt32(this.User.Identity.Name);

            IEnumerable<Rotation> result =
                await this._connection.QueryAsync<Rotation>("SELECT * FROM Rotations WHERE OwnerID = @uid",
                    new {uid = userID});

            return this.Ok(result.ToArray());
        }
    }
}