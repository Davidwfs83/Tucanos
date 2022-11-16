using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.DTO.AdminControllerDTOS
{
    
    public class AirlineCreateDTO
    {
        [Required(ErrorMessage = "Required")]
        [StringLength(15, MinimumLength = 3, ErrorMessage = "CompanyName needs to be 3-15 characters")]
        public string CompanyName { get; set; }

        [Required(ErrorMessage = "Required")]
        public long CountryId { get; set; }

        [Required(ErrorMessage = "Required")]
        [StringLength(20, MinimumLength = 7, ErrorMessage = "Username needs to be 7-20 characters")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Required")]
        [StringLength(20, MinimumLength = 7, ErrorMessage = "Password needs to be 7-20 characters")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Valid Email Required")]
        [DataType(DataType.EmailAddress)]
        [EmailAddress]
        public string Email { get; set; }
        public IFormFile Img { get; set; }
       

        public AirlineCreateDTO()
        {

        }
    }
}
