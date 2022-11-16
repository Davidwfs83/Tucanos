using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.DTO.AirlineControllerDTOS
{
    public class AirlineTicketDTO
    {
        public long TicketId { get; set; }
        public long CustomerId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string PhoneNu { get; set; }
        public bool Gender { get; set; }
        public string ImgLink { get; set; }
        public AirlineTicketDTO()
        {

        }
    }
}
