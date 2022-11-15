using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.DTO.AdminControllerDTOS
{
    public class AUpdateCustomerDTO
    {
        [Required(ErrorMessage = "Required")]
        public long Id { get; set; }
        public string FirstName  { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string PhoneNo { get; set; }
        public int Points { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public IFormFile Img { get; set; }
        public long UserId { get; set; }
    }
}
