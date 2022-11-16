using AutoMapper;
using DataCommunicator.Pocos;
using Sharat.DTO.AirlineControllerDTOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.Mappers.AirlinesMappers
{
    public class AirlineUpdateDetailsMapper : Profile
    {
        public AirlineUpdateDetailsMapper()
        {
            CreateMap<AirlineUpdateDetailsDTO, Airline>()
                .ConstructUsing(src => new Airline(
                src.AirlineId,
                src.AirlineName,
                src.CountryId != 0 ? new Country(src.CountryId) : null ,
                new User(src.Username, src.Email)
                    ));

        }
    }
}
