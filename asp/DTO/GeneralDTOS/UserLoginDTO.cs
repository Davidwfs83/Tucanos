using Sharat.Utilities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.DTO
{
    public class UserLoginDTO
    {
        [UserLoginValidator(3,50,"Username")]
        public string UserName { get; set; }

        [UserLoginValidator(3, 50, "Password")]
        public string Password { get; set; }
        public UserLoginDTO()
        {
        }

    }
}
