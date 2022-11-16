using Microsoft.AspNetCore.Mvc.Filters;
using Sharat.Controllers;
using Sharat.Utilities;


namespace Sharat.Filters
{
    public class PlaceboUserFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            switch (context.Controller)
            {
                case AdminController controller:
                    {
                        if (controller.tokenUserInfo.Id == 10000)
                            throw new PlaceboUserException("This is a \"Placebo Admin\" a.k.a you cant perform actions that might" +
                                " change the state of the App");
                        break;
                    }
                case CustomerController controller:
                    {
                        if (controller.tokenUserInfo.Id == 10000)
                            throw new PlaceboUserException("This is a \"Placebo Customer\" a.k.a you cant perform actions that might" +
                                " change the state of the App");
                        break;
                    }
                case AirlineController controller:
                    {
                        if (controller.tokenUserInfo.Id == 10000)
                            throw new PlaceboUserException("This is a \"Placebo Airline\" a.k.a you cant perform actions that might" +
                                " change the state of the App");
                        break;
                    }               
            }
            
        }
    }
}
