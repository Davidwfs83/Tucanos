using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.DTO.AirlineControllerDTOS
{
    public class AirlineUpdateDetailsDTO
    {
        public long AirlineId { get; set; }
        public string AirlineName { get; set; }
        public long CountryId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public IFormFile Img { get; set; }
    }
}
