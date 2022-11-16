using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.DTO.CustomerControllerDTOS
{
    public class CustomerTicketDTO
    {
        public long TicketId { get; set; }
        public int Cost { get; set; }
        public long FlightId { get; set; }
        public string AirlineName { get; set; }
        public string OriginCountryName { get; set; }
        public string DestinationCountryName { get; set; }
        public DateTime DepartureTime { get; set; }
        public DateTime LandingTime { get; set; }
        public int Price { get; set; }
    }
}
