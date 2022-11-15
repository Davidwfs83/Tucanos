using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.DTO.AdminControllerDTOS
{
    public class AdminCreateDTO
    {
        [Required(ErrorMessage = "Required")]
        [StringLength(15, MinimumLength = 3, ErrorMessage = "First Name needs to be 3-15 characters")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Required")]
        [StringLength(15, MinimumLength = 3, ErrorMessage = "Last Name needs to be 3-15 characters")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Required")]
        [Range(1,3)]
        public int Level { get; set; }

        [Required(ErrorMessage = "Required")]
        [StringLength(15, MinimumLength = 3, ErrorMessage = "UserName needs to be 3-15 characters")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Required")]
        [StringLength(15, MinimumLength = 3, ErrorMessage = "Password needs to be 3-15 characters")]
        public string Password { get; set; }

        public IFormFile Img { get; set; }

        [Required(ErrorMessage = "Valid Email Required")]
        [DataType(DataType.EmailAddress)]
        [EmailAddress]
        public string Email { get; set; }
    }
}
