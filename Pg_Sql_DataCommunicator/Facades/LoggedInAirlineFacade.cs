using DataCommunicator.IFacades;
using DataCommunicator.Pocos;
using DataCommunicator.Queries;
using System.Collections.Generic;

namespace Pg_Sql_DataCommunicator.Facades
{
    internal class LoggedInAirlineFacade : AnonymousUserFacade, ILoggedInAirlineFacade
    {
        internal LoggedInAirlineFacade()
        {
        }
        //Airline Facade 1
        public long CreateFlight(Flight flight)
        {
            return _flightDao.Add(flight);
        }
        //Airline Facade 2
        public long RemoveFlight(long flightId, long airlineId)
        {
            return _flightDao.Remove(flightId, airlineId);
        }
        //Airline Facade 3
        public long UpdateMyFlight(Flight flight)
        {
            return _flightDao.Update(flight);
        }
        //Airline Facade 4
        public List<Ticket> GetAllTicketsByFlight(long flightId, long airlineId)
        {
            return _ticketDao.GetAllTicektsByFlight(new FlightTicketQuery(flightId, airlineId));
        }        
        //Airline Facade 5
        public long UpdateAirline(Airline airline)
        {
            return _airlineDao.Update(airline);
        }
        //Airline Facade 6
        public List<Flight> GetAllMyFlights(FlightQuery query)
        {
            return _flightDao.GetAll(query);
        }
    }
}
