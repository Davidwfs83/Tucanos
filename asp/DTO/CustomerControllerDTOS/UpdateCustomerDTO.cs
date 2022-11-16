using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.DTO.CustomerControllerDTOS
{
    public class UpdateCustomerDTO
    {
        [Required(ErrorMessage = "Required")]
        public long CustomerId { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Address { get; set; }

        public string CreditCard { get; set; }

        public string PhoneNu { get; set; }

        public string UserName { get; set; }

        public IFormFile Img { get; set; }      
        public string Email { get; set; }
    }
}
