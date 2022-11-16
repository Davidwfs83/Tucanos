using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.DTO.GeneralDTOS
{
    public class AirlineDTO
    {
        public AirlineDTO(long id, string name, long countryId, string countryName,string imgLink, long userId)
        {
            AirlineId = id;
            AirlineName = name;
            CountryId = countryId;
            CountryName = countryName;
            ImgLink = imgLink;
            UserId = userId;
        }
        public AirlineDTO()
        {

        }
        public long UserId { get; set; }
        public long AirlineId { get; set; }
        public string AirlineName { get; set; }
        public long CountryId { get; set; }
        public string CountryName { get; set; }
        public string ImgLink { get; set; }
        public decimal OverAllScore { get; set; }

    }
}
