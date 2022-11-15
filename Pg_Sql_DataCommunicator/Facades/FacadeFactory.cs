using DataCommunicator.IFacades;
using Pg_Sql_DataCommunicator.Configuration;
using System.Threading;

namespace Pg_Sql_DataCommunicator.Facades
{
    internal class FacadeFactory : IFacadeFactory
    {
        private object anonFacadesKey = new object();
        private object customerFacadesKey = new object();
        private object airlineFacadesKey = new object();
        private object adminstratorFacadesKey = new object();
        private int counter = 50;
        public FacadeFactory(FacadesCount facadesCount) : base()
        {
            int i;
            for (i = 0; i < facadesCount.AnonFacadeCount; i++)
            {
                anonFacades.Enqueue(new AnonymousUserFacade());
            }
            for (i = 0; i < facadesCount.CustomerFacadeCount; i++)
            {
                customerFacades.Enqueue(new LoggedInCustomerFacade());
            }
            for (i = 0; i < facadesCount.AirlineFacadeCount; i++)
            {
                airlineFacades.Enqueue(new LoggedInAirlineFacade());
            }
            for (i = 0; i < facadesCount.AdminFacadeCount; i++)
            {
                adminFacades.Enqueue(new LoggedInAdministratorFacade());
            }
        }
        public override T GetFacade<T>()
        {
            counter--;
            if (typeof(T) == typeof(IAnonymousUserFacade))
            {
                try
                {
                    Monitor.Enter(anonFacadesKey);
                    while (anonFacades.Count == 0)
                    {
                        Monitor.Wait(anonFacadesKey);
                    }
                    return (T)anonFacades.Dequeue();
                }
                finally
                {
                    Monitor.Exit(anonFacadesKey);
                }
            }
            if (typeof(T) == typeof(ILoggedInCustomerFacade))
            {
                try
                {
                    Monitor.Enter(customerFacadesKey);
                    while (customerFacades.Count == 0)
                    {
                        Monitor.Wait(customerFacadesKey);
                    }
                    return (T)customerFacades.Dequeue();

                }
                finally
                {
                    Monitor.Exit(customerFacadesKey);
                }
            }
            if (typeof(T) == typeof(ILoggedInAirlineFacade))
            {
                try
                {
                    Monitor.Enter(airlineFacadesKey);
                    while (airlineFacades.Count == 0)
                    {
                        Monitor.Wait(airlineFacadesKey);
                    }
                    return (T)airlineFacades.Dequeue();

                }
                finally
                {
                    Monitor.Exit(airlineFacadesKey);
                }
            }
            if (typeof(T) == typeof(ILoggedInAdministratorFacade))
            {
                try
                {
                    Monitor.Enter(adminstratorFacadesKey);
                    while (adminFacades.Count == 0)
                    {
                        Monitor.Wait(adminstratorFacadesKey);
                    }
                    return (T)adminFacades.Dequeue();

                }
                finally
                {
                    Monitor.Exit(adminstratorFacadesKey);
                }
            }
            return default(T);
        }
        public override void ReturnFacade<T>(T theFacade)
        {
            counter++;
            if (typeof(T) == typeof(IAnonymousUserFacade))
            {
                try
                {
                    Monitor.Enter(anonFacadesKey);
                    anonFacades.Enqueue((dynamic)theFacade);
                }
                finally
                {
                    Monitor.Exit(anonFacadesKey);
                }
            }
            if (typeof(T) == typeof(ILoggedInCustomerFacade))
            {
                try
                {
                    Monitor.Enter(customerFacadesKey);
                    customerFacades.Enqueue((dynamic)theFacade);
                }
                finally
                {
                    Monitor.Exit(customerFacadesKey);
                }
            }
            if (typeof(T) == typeof(ILoggedInAirlineFacade))
            {
                try
                {
                    Monitor.Enter(airlineFacadesKey);
                    airlineFacades.Enqueue((dynamic)theFacade);
                }
                finally
                {
                    Monitor.Exit(airlineFacadesKey);
                }
            }
            if (typeof(T) == typeof(ILoggedInAdministratorFacade))
            {
                try
                {
                    Monitor.Enter(adminstratorFacadesKey);
                    adminFacades.Enqueue((dynamic)theFacade);
                }
                finally
                {
                    Monitor.Exit(adminstratorFacadesKey);
                }
            }          
        }
    }
}
