using DataCommunicator.Pocos;
using Microsoft.AspNetCore.Mvc.Filters;
using Sharat.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace Sharat.Filters
{
    public class GeneralTokenGetter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {

            switch (context.Controller)
            {
                case AdminController controller:
                    {
                        controller.tokenUserInfo = JsonSerializer.Deserialize<Admin>(controller.User.Claims.First(claim => claim.Type == "userInfo").Value);
                        break;
                    }
                case AirlineController c:
                    {
                        c.tokenUserInfo = JsonSerializer.Deserialize<Airline>(c.User.Claims.First(claim => claim.Type == "userInfo").Value);
                        break;
                    }
                case CustomerController c:
                    {
                        c.tokenUserInfo = JsonSerializer.Deserialize<Customer>(c.User.Claims.First(claim => claim.Type == "userInfo").Value);
                        break;
                    }
                case ImageController c:
                    {
                        switch (c.User.Claims.First(claim => claim.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role").Value)
                        {
                            case "Admin":
                                {
                                    c.tokenUserInfo = JsonSerializer.Deserialize<Admin>(c.User.Claims.First(claim => claim.Type == "userInfo").Value);
                                    break;
                                }
                            case "Airline":
                                {
                                    c.tokenUserInfo = JsonSerializer.Deserialize<Airline>(c.User.Claims.First(claim => claim.Type == "userInfo").Value);
                                    break;
                                }
                            case "Customer":

                                {
                                    c.tokenUserInfo = JsonSerializer.Deserialize<Customer>(c.User.Claims.First(claim => claim.Type == "userInfo").Value);
                                    break;
                                }

                        }
                        break;
                    }

            }
        }

    }
}
