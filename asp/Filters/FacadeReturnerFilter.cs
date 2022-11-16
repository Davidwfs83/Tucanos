using DataCommunicator.IFacades;
using Microsoft.AspNetCore.Mvc.Filters;
using Sharat.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.Filters
{
    public class FacadeReturnerFilter : ActionFilterAttribute
    {
        private Type controllerType;
        public FacadeReturnerFilter(Type type)
        {
            controllerType = type;
        }
        public override void OnActionExecuted(ActionExecutedContext context)
        {
            if(controllerType == typeof(IAnonymousUserFacade))
            {
                AnonymousController controller = (AnonymousController)context.Controller;
                controller.flightCenter.FacadeFactory.ReturnFacade<IAnonymousUserFacade>(controller.theFacade);
            } else
            if (controllerType == typeof(ILoggedInCustomerFacade))
            {
                CustomerController controller = (CustomerController)context.Controller;
                controller.flightCenter.FacadeFactory.ReturnFacade<ILoggedInCustomerFacade>(controller.theFacade);
            } else
            if (controllerType == typeof(ILoggedInAirlineFacade))
            {
                AirlineController controller = (AirlineController)context.Controller;
                controller.flightCenter.FacadeFactory.ReturnFacade<ILoggedInAirlineFacade>(controller.theFacade);
            } else
            if (controllerType == typeof(ILoggedInAdministratorFacade))
            {
                AdminController controller = (AdminController)context.Controller;
                controller.flightCenter.FacadeFactory.ReturnFacade<ILoggedInAdministratorFacade>(controller.theFacade);
            }
        }
       
    }
}
