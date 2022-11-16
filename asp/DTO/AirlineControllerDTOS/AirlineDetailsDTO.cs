using DataCommunicator.Pocos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.DTO.AirlineControllerDTOS
{
    public class AirlineDetailsDTO
    {
        public AirlineDetailsDTO(long airlineId, string airlineName, long countryId, string countryName, string username, string email,
            string imgLink, decimal overAllScore, long userId)
        {
            AirlineId = airlineId;
            AirlineName = airlineName;
            CountryId = countryId;
            CountryName = countryName;
            Username = username;
            Email = email;
            ImgLink = imgLink;
            OverAllScore = overAllScore;
            UserFk = new User(userId);
        }

        
        public long AirlineId { get; set; }
        public string AirlineName { get; set; }     
        public long CountryId { get; set; }
        public string CountryName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string ImgLink { get; set; }
        public string ImgByteArr { get; set; }
        public decimal OverAllScore { get; set; }
        public User UserFk { get; set; }
    }
}
