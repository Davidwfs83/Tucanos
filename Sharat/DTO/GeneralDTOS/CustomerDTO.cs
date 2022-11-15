using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.DTO.GeneralDTOS
{
    public class CustomerDTO
    {
        
        public CustomerDTO()
        {

        }

        public CustomerDTO(long id, string firstName, string lastName, string address, string creditCard, string phoneNu, bool gender, int points, string userName, string email, string imgLink)
        {
            Id = id;
            FirstName = firstName;
            LastName = lastName;
            Address = address;
            CreditCard = creditCard;
            PhoneNu = phoneNu;
            Gender = gender;
            Points = points;
            UserName = userName;
            Email = email;
            ImgLink = imgLink;
        }

        public long Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string CreditCard { get; set; }
        public string PhoneNu { get; set; }
        public bool Gender { get; set; }
        public int Points { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string ImgLink { get; set; }
        public string ImgByteArr { get; set; }
        public long UserId { get; set; }
    }
}
