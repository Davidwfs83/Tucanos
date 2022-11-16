using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.DTO.AdminControllerDTOS
{
    public class CountryCreateDTO
    {
        [Required(ErrorMessage = "Required")]
        [StringLength(15, MinimumLength = 3, ErrorMessage = "Country Name needs to be 3-15 characters")]
        public string Name { get; set; }
       
        [Required(ErrorMessage = "Required")]
        public IFormFile Img { get; set; }
        
        [Required(ErrorMessage = "Required")]
        public int Latitude { get; set; }
        [Required(ErrorMessage = "Required")]
        public int Longitude { get; set; }
    }
}
