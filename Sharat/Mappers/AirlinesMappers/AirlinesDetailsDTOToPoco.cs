
using AutoMapper;
using DataCommunicator.Pocos;
using Sharat.DTO.AirlineControllerDTOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.Mappers.AirlinesMappers
{
    public class AirlineDetailsDTOToPocoMapper : Profile
    {
        public AirlineDetailsDTOToPocoMapper()
        {
            CreateMap<AirlineDetailsDTO, Airline>()
                .ConstructUsing(src => new Airline(
                (long)src.AirlineId,
                src.AirlineName,
                new Country(src.CountryId, src.CountryName),
                new User {Id = src.UserFk.Id, Username=src.Username, Email = src.Email },
                src.OverAllScore
                    ));

        }
    }
}
