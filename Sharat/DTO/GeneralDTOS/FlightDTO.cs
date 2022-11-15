using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.DTO.GeneralDTOS
{

    public class FlightDTO
    {
        public long Id { get; set; }
        public long AirlineId { get; set; }
        public string AirlineName { get; set; }
        public string OriginCountry { get; set; }
        public int OriginLatitude { get; set; }
        public int OriginLongitude { get; set; }
        public string DestinationCountry { get; set; }
        public int DestinationLatitude { get; set; }
        public int DestinationLongitude { get; set; }
        public int Price { get; set; }
        public DateTime DepartureTime { get; set; }
        public DateTime LandingTime { get; set; }
        public int RemainingTickets { get; set; }
        public FlightDTO()
        {

        }
    }
}
