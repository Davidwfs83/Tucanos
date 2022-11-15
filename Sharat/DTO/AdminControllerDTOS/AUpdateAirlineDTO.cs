using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.DTO.AdminControllerDTOS
{
    public class AUpdateAirlineDTO
    {
        [Required(ErrorMessage = "Required")]
        public long CompanyId { get; set; }

        [StringLength(15, MinimumLength = 3, ErrorMessage = "Company Name needs to be 3-15 characters")]
        public string CompanyName { get; set; }

        
        public long? CountryId { get; set; }

        
        [StringLength(20, MinimumLength = 7, ErrorMessage = "Username needs to be 7-20 characters")]
        public string Username { get; set; }

        public IFormFile Img { get; set; }
        public long UserId { get; set; }

        [DataType(DataType.EmailAddress)]
        [EmailAddress]
        public string Email { get; set; }

        public AUpdateAirlineDTO()
        {

        }
    }
}
