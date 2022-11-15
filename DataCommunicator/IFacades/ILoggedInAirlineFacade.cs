using DataCommunicator.Pocos;
using DataCommunicator.Queries;
using System.Collections.Generic;

namespace DataCommunicator.IFacades
{
    public interface ILoggedInAirlineFacade : IAnonymousUserFacade
    {
        //Airline Facade 1
        public long CreateFlight(Flight flight);
        //Airline Facade 2
        public long RemoveFlight(long airlineId, long flightId);
        //Airline Facade 3
        public long UpdateMyFlight(Flight flight);
        //Airline Facade 4
        public List<Ticket> GetAllTicketsByFlight(long flightId, long airlineId);       
        //Airline Facade 5
        public long UpdateAirline(Airline airline);
        //Airline Facade 6
        public List<Flight> GetAllMyFlights(FlightQuery query);
    }
}
