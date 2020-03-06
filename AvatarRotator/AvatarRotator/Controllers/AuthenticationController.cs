using AvatarRotator.Dto;
using AvatarRotator.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using MortisAuthenticator;

namespace AvatarRotator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IUserAuthenticator _userAuthenticator;
        private readonly AppSettings _appSettings;

        public AuthenticationController(IUserAuthenticator userAuthenticator, IOptions<AppSettings> appSettings)
        {
            this._userAuthenticator = userAuthenticator;
            this._appSettings = appSettings.Value;
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody]UserLoginDto userDto)
        {
            try
            {
                (int ID, string username) user =
                    await this._userAuthenticator.GetUserIfValidCredentialsAsync(userDto.Username, userDto.Password);

                if (user.ID == -1)
                {
                    return this.Unauthorized(new { message = "Username or password is incorrect" });
                }

                var tokenHandler = new JwtSecurityTokenHandler();
                byte[] key = Encoding.ASCII.GetBytes(this._appSettings.Secret);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Name, user.ID.ToString()),
                    }),
                    Expires = DateTime.UtcNow.AddDays(7),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };
                SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
                string tokenString = tokenHandler.WriteToken(token);
                return this.Ok(new
                {
                    ID = user.ID,
                    username = user.username,
                    token = tokenString
                });
            }
            catch (Exception e)
            {
                return this.StatusCode(500);
            }
        }
    }
}