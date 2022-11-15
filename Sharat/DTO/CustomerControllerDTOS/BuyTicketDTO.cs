using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.DTO.CustomerControllerDTOS
{
    public class BuyTicketDTO
    {
        [Required(ErrorMessage = "Required")]
        public long FlightId { get; set; }

        [Required(ErrorMessage = "Required")]
        public int TicketPrice { get; set; }

        [Required(ErrorMessage = "Required")]
        public string CreditCard { get; set; }

        public int PointsToConsume{ get; set; }
        public BuyTicketDTO()
        {

        }
    }
}
