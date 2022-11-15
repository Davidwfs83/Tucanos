using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.DTO.AirlineControllerDTOS
{
    public class CreateFlightDTO
    {
        [Required(ErrorMessage = "Required")]
        public long AirlineId { get; set; }

        [Required(ErrorMessage = "Required")]
        public long OriginCountryId { get; set; }

        [Required(ErrorMessage = "Required")]
        public long DestinationCountryId { get; set; }

        [Required(ErrorMessage = "Required")]
        public int Price { get; set; }
        public DateTime DepartureTime { get; set; }

        [Required(ErrorMessage = "Required")]
        public DateTime LandingTime { get; set; }

        [Required(ErrorMessage = "Required")]
        public int RemainingTickets { get; set; }
    }
}
