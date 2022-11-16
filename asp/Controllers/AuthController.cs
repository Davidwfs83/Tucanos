using Microsoft.Extensions.Configuration;
using DataCommunicator;
using DataCommunicator.ILoginServices;
using DataCommunicator.Pocos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Sharat.DTO;
using Sharat.Utilities;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Sharat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private IFlightCenterSystem p_flightCenter;
        private IConfiguration p_config;
        public AuthController(IFlightCenterSystem fcSystem, IConfiguration config )
        {
            p_flightCenter = fcSystem;
            p_config = config;
        }
        [HttpPost("token")]
        public async Task<ActionResult> GetToken([FromBody] UserLoginDTO userDetails)
        {
            ILoginToken<IUserResource> token = null;

            
            Task<bool> t = Task.Run<bool>
            (() =>
            p_flightCenter.LoginService.TryLogin(userDetails.UserName, userDetails.Password, out token)
            );           
                await t;

            token.User.UserFk = new User((long)token.User.UserFk.Id);            
            // symmetric security key
            var symmetricSecurityKey = new
                SymmetricSecurityKey(Encoding.UTF8.GetBytes(p_config.GetSection("Jwt").GetValue<string>("SecurityKey")));
            // signing credentials
            var signingCredentials = new
                  SigningCredentials(symmetricSecurityKey,
                  SecurityAlgorithms.HmacSha256Signature);
            // Claims
            var claims = new List<Claim>();
            claims.Add(new Claim(ClaimTypes.Role,
                token.User is Customer ? "Customer" :
                token.User is Airline ?  "Airline" :
                token.User is Admin ? "Admin" : ""
                ));
            claims.Add(new Claim("userInfo", JsonConvert.SerializeObject(token.User)));
            var loginToken = new JwtSecurityToken(
            issuer: "smesk.in",
            audience: "readers",
            expires: DateTime.Now.AddSeconds(p_config.GetSection("Jwt").GetValue<int>("ExpirationTime")), 
            signingCredentials: signingCredentials,
            claims: claims);
            return Ok(new JwtSecurityTokenHandler().WriteToken(loginToken));
        }
    }
}
