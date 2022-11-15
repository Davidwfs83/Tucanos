using Microsoft.AspNetCore.Mvc.Filters;
using Sharat.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.Filters
{
    public class AdminLevelAuthorizeFilter : ActionFilterAttribute
    {
        private int minLevel;
        public AdminLevelAuthorizeFilter(int minLevelAllowed)
        {
            minLevel = minLevelAllowed;
        }
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            AdminController adminController = (AdminController)context.Controller;
            if (adminController.tokenUserInfo.Level < minLevel)
                throw new AdminLevelUnAllowedException($"Your'e Level Does Not Permit You To Access" +
                    $"The Following Route: ${context.ActionDescriptor.AttributeRouteInfo.Template}");
        }
    }
}
