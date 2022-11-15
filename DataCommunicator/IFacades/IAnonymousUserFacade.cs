using DataCommunicator.Pocos;
using DataCommunicator.Queries;
using System.Collections.Generic;

namespace DataCommunicator.IFacades
{

    public interface IAnonymousUserFacade
    {
        //Anon Facade 1
        public KeyValuePair<long, long> CreateCustomer(Customer customer);
        //Anon Facade 2
        public void ForgotPassword();
        //Anon Facade 3
        public List<Flight> GetAllFlights(FlightQuery query);
        //Anon Facade 4
        public List<Airline> GetAllAirlines();
        //Anon Facade 5
        public List<Country> GetAllCountries(CountryQuery query);
        //Anon Facade 6
        // *SIDENOTE: when an Anonymous User Signup as an airline the arline isn't immedieatly created but instead
        // Needs to be reviewed by an admin Level 2 or above and if the admin do choose to authoraize that airline
        // the airline is created here in the Admins facade;
        public long RequestAirlineCreation(AirlineCreationRequest airlineRequest);
        //Anon Facade 7
        public List<Review> GetReviewsByAirline(long airlineId);
        //Anon Facade 8
        public Flight GetFlight(long flightId);
        //Anon Facade 9
        public Airline GetAirline(long airlineId);
        //Anon Facade 10
        public List<Review> ThreeRandomReviews();


    }
}
