using DataCommunicator.IDataGenerators;
using DataCommunicator.IFacades;
using DataCommunicator.Pocos;
using DataCommunicator.Queries;
using Pg_Sql_DataCommunicator.Daos;
using Pg_Sql_DataCommunicator.DataGenerators.FreeApiOne;
using System;
using System.Collections.Generic;


namespace Pg_Sql_DataCommunicator.Facades
{


    internal class LoggedInAdministratorFacade : AnonymousUserFacade, ILoggedInAdministratorFacade
    {
        private IAllDataGenerator dataGenerator;
        internal LoggedInAdministratorFacade()
        {
            dataGenerator = new AllFreeApiOneGenerator(_adminDao, _airlineDao, _countryDao, _customerDao,
                _flightDao, _ticketDao, _reviewDao);
        }
        //Admin Facade 1
        public List<Customer> GetAllCustomers(CustomerQuery query)
        {
            return _customerDao.GetAll(query);
        }
        //Admin Facade 2
        public long UpdateCustomer(Customer customer)
        {
            return _customerDao.Update(customer);
        }
        //Admin Facade 3
        public long RemoveCustomer(long customerId , long adminId)
        {
            return _customerDao.Remove(customerId, adminId);
        }
        //Admin Facade 4
        public List<Ticket> GetAllTickets(FlightTicketQuery query)
        {
            return _ticketDao.GetAllTicektsByFlight(query);
        }
        //Admin Facade 5
        public long RemoveTicket(long ticketId)
        {
            throw new NotImplementedException();
        }
        //Admin Facade 6
        public long CreateTicket(Ticket ticket)
        {
            throw new NotImplementedException();
        }
        //Admin Facade 7
        public long UpdateFlight(Flight flight, long adminId)
        {
            throw new NotImplementedException();
        }
        //Admin Facade 8
        public long RemoveFlight(long flightId, long adminId)
        {
            throw new NotImplementedException();
        }
        //Admin Facade 9
        public long UpdateAirline(Airline airline)
        {
            return _airlineDao.Update(airline);
        }
        //Admin Facade 10
        public long RemoveAirline(long airlineId, long adminId)
        {
            return _airlineDao.Remove(airlineId, adminId);
        }
        //Admin Facade 11
        public long UpdateAdmin(Admin admin, long adminId)
        {
            return _adminDao.Update(admin, adminId);
        }
        //Admin Facade 12
        public List<Admin> GetAllAdmins(AdminQuery query, long adminId)
        {
            return _adminDao.GetAll(query, adminId);
        }
        //Admin Facade 13
        public long RemoveAdmin(long adminToRemove, long adminId)
        {
            return _adminDao.Remove(adminToRemove, adminId);
        }
        //Admin Facade 14
        public KeyValuePair<long,long> CreateAirline(Airline airline)
        {           
            return _airlineDao.Add(airline);
        }
        //Admin Facade 15
        public KeyValuePair<long, long> CreateAdmin(Admin admin , long adminId)
        {
            return _adminDao.Add(admin, adminId);
        }
        //Admin Facade 16
        public long CreateCountry(Country country)
        {
            return _countryDao.Add(country);
        }
        //Admin Facade 17
        public long RemoveCountry(long countryId)
        {
            return _countryDao.Remove(countryId);
        }
        //Admin Facade 18
        public long UpdateCountry(Country country)
        {
            return _countryDao.Update(country);
        }
        //Admin Facade 19
        public RecordsCount GenerateAllData(RecordsCount recordsCount)
        {
            return dataGenerator.AllGenerator(recordsCount);
        }
        //Admin Facade 20
        public RecordsCount ClearAllData()
        {
            return GeneralSp.WipeDatabase();
        }       
        //Admin Facade 21
        public Admin GetMyDetails(long adminId)
        {
            return _adminDao.Get(adminId, null);

        }
        //Admin Facade 22
        public long UpdateMyDetails(Admin updatedAdmin, long updatingAdminId)
        {
            return _adminDao.Update(updatedAdmin, updatingAdminId);

        }
        //Admin Facade 23
        public List<Airline> QueryAllAirlines(AirlineQuery query)
        {
            return _airlineDao.GetAll(query);
        }
        //Admin Facade 24
        public List<Country> QueryAllCountries(CountryQuery query)
        {
            return _countryDao.GetAll(query);
        }

    }
}
