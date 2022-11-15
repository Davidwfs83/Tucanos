using DataCommunicator.Pocos;
using DataCommunicator.Queries;
using System.Collections.Generic;

 namespace DataCommunicator.IFacades
{
    //***************************
    // admin level 1: ( lowest)
    // (GetAll/Update) Customers
    // (GetAll/Update) Airlines
    // (GetAll/Create/Remove) Tickets
    // (Update/Remove) Reviews
    //admin level 2:
    // (Remove) Customer
    // (Remove/Create) Airline
    // (Update/Remove) Flights
    //admin level 3:
    // (GetAll/Update/Remove) Admins (Lower level admins..)
    // (Update/Remove/Create) Countries
    //admin level 4: (highest) (ONLY ONE ADMIN LEVEL 4 AND HE IS NOT LISTED IN THE DATABASE)
    // (Create) admins
    // Generate Dummy Data for all objects
    //****************************
    // each admin have all the capabilities that an admin at a lower level has (obviously) 
    public interface ILoggedInAdministratorFacade : IAnonymousUserFacade
    {
        //Admin Facade 1
        public List<Customer> GetAllCustomers(CustomerQuery query);
        //Admin Facade 2
        public long UpdateCustomer(Customer customer);
        //Admin Facade 3
        public long RemoveCustomer(long customerId, long adminId);
        //Admin Facade 4
        public List<Ticket> GetAllTickets(FlightTicketQuery query);
        //Admin Facade 5
        public long RemoveTicket(long ticketId);
        //Admin Facade 6
        public long CreateTicket(Ticket ticket);
        //Admin Facade 7
        public long UpdateFlight(Flight flight, long adminId);
        //Admin Facade 8
        public long RemoveFlight(long flightId, long adminId);
        //Admin Facade 9
        public long UpdateAirline(Airline airline);
        //Admin Facade 10
        public long RemoveAirline(long airlineId, long adminId);
        //Admin Facade 11
        public long UpdateAdmin(Admin admin, long adminId);
        //Admin Facade 12
        public List<Admin> GetAllAdmins(AdminQuery query, long adminId);
        //Admin Facade 13
        public long RemoveAdmin(long adminToRemove, long adminId);
        //Were overridng the CreateAirline we inherited from the Anonymous user, Because when an Anonymous
        // "Creates" an airline what hes actually doing is creating a request for the creation which later
        // an admin can choose to either create or not the Airline, So the admin is the one who is actually
        // creating the airline
        //Admin Facade 14
        public KeyValuePair<long, long> CreateAirline(Airline airline);
        //Admin Facade 15
        public KeyValuePair<long, long> CreateAdmin(Admin admin, long adminId);
        //Admin Facade 16
        public long CreateCountry(Country country);
        //Admin Facade 17
        public long RemoveCountry(long countryId);
        //Admin Facade 18
        public long UpdateCountry(Country country);
        //Admin Facade 19
        public RecordsCount GenerateAllData(RecordsCount recordsCount);
        //Admin Facade 20
        public RecordsCount ClearAllData();
        //Admin Facade 21
        public Admin GetMyDetails(long adminId);
        //Admin Facade 22
        public long UpdateMyDetails(Admin updatedAdmin,long updatingAdminId);
        //Admin Facade 23
        public List<Airline> QueryAllAirlines(AirlineQuery query);

        public List<Country> QueryAllCountries(CountryQuery query);
    }
}
