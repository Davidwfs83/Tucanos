using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.DTO.AdminControllerDTOS
{
    public class AdminUpdateSelfDTO
    {
        public long AdminId { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public IFormFile Img { get; set; }
    }
}
