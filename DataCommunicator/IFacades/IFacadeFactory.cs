using DataCommunicator.IConfiguration;
using System.Collections.Generic;

namespace DataCommunicator.IFacades
{
    public abstract class IFacadeFactory
    {
        protected Queue<IAnonymousUserFacade> anonFacades;
        protected Queue<ILoggedInCustomerFacade> customerFacades;
        protected Queue<ILoggedInAirlineFacade> airlineFacades;
        protected Queue<ILoggedInAdministratorFacade> adminFacades;
        public abstract T GetFacade<T>() where T : IAnonymousUserFacade;
        public abstract void ReturnFacade<T>(T theFacade) where T : IAnonymousUserFacade;
        public IFacadeFactory()
        {
            anonFacades = new Queue<IAnonymousUserFacade>();
            customerFacades = new Queue<ILoggedInCustomerFacade>();
            airlineFacades = new Queue<ILoggedInAirlineFacade>();
            adminFacades = new Queue<ILoggedInAdministratorFacade>();
            
        }
    }
}
