using AutoMapper;
using DataCommunicator.Pocos;
using Sharat.DTO.AdminControllerDTOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.Mappers.AdminMappers
{
    public class AUpdateAirlineDTOToPoco : Profile
    {
        public AUpdateAirlineDTOToPoco()
        {
            CreateMap<AUpdateAirlineDTO, Airline>()
                .ConstructUsing(src => 
                    new Airline {
                        Name = src.CompanyName,
                        Id = src.CompanyId,
                        CountryFk = new Country(src.CountryId),
                        UserFk = new User { Username = src.Username, Email=src.Email}
                    }
                                       
              );
        }
    }
}
