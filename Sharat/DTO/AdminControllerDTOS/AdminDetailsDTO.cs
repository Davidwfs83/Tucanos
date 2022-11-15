using DataCommunicator.Pocos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.DTO.AdminControllerDTOS
{
    public class AdminDetailsDTO
    {
        public AdminDetailsDTO(long adminId, string firstname, string lastname, int level, string username,
            string email,string imgLink, long userId)
        {
            AdminId = adminId;
            FirstName = firstname;
            LastName = lastname;
            Level = level;
            Username = username;
            Email = email;
            ImgLink = imgLink;
            UserFk = new User(userId);
        }

        public long AdminId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Level { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        // img byte array base 64 encoded
        public string ImgByteArr { get; set; }
        public string ImgLink { get; set; }
        public User UserFk { get; set; }
    }
}
