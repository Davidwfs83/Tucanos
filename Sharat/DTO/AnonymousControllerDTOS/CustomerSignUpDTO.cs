using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.DTO.AnonymousControllerDTOS
{
    public class CustomerSignUpDTO
    {
        [Required(ErrorMessage = "Required")]
        [StringLength(15, MinimumLength = 3, ErrorMessage = "3 - 15 Characters")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Required")]
        [StringLength(15, MinimumLength = 3, ErrorMessage = "3 - 15 Characters")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Required")]
        [StringLength(15, MinimumLength = 3, ErrorMessage = "3 - 15 Characters")]
        public string Address { get; set; }

        [Required(ErrorMessage = "Required")]
        [StringLength(20, MinimumLength = 7, ErrorMessage = "7 - 20 Characters")]
        public string PhoneNo { get; set; }

        [Required(ErrorMessage = "Required")]
        [StringLength(20, MinimumLength = 7, ErrorMessage = "7 - 20 Characters")]
        public string CreditCard { get; set; }

        [Required(ErrorMessage = "Required")]
        public bool Gender { get; set; }

        [Required(ErrorMessage = "Required")]
        [StringLength(20, MinimumLength = 7, ErrorMessage = "7 - 20 Characters")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Required")]
        [StringLength(20, MinimumLength = 7, ErrorMessage = "7 - 20 Characters")]
        public string Password { get; set; }

        public IFormFile Img { get; set; }

        [Required(ErrorMessage = "Valid Email Required")]
        [DataType(DataType.EmailAddress)]
        [EmailAddress]
        public string Email { get; set; }
        public CustomerSignUpDTO()
        {

        }
    }
}
