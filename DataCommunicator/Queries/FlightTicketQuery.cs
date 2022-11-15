using System;
using System.Collections.Generic;
using System.Text;

namespace DataCommunicator.Queries
{
    public class FlightTicketQuery
    {       
        public FlightTicketQuery()
        {
        }
        public FlightTicketQuery(long? flightId, long? airlineId)
        {
            FlightId = flightId;
            AirlineId = airlineId;
        }
        public long? FlightId { get; set; }
        public long? AirlineId { get; set; }
    }
}
