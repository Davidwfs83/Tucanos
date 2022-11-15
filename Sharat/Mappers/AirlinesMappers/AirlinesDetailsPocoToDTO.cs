using AutoMapper;
using DataCommunicator.Pocos;
using Sharat.DTO.AirlineControllerDTOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.Mappers.AirlinesMappers
{
    public class AirlinesDetailsPocoToDTO : Profile
    {
        public AirlinesDetailsPocoToDTO()
        {
            CreateMap<Airline, AirlineDetailsDTO>()
                .ConstructUsing(src => new AirlineDetailsDTO(
                (long)src.Id,
                src.Name,
                (long)src.CountryFk.Id,
                src.CountryFk.Name,
                src.UserFk.Username,
                src.UserFk.Email,
                src.ImgLink,
                src.OverAllScore,
                (long)src.UserFk.Id
                    ));
               
        }
    }
}
