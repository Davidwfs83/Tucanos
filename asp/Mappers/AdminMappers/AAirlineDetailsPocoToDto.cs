using AutoMapper;
using DataCommunicator.Pocos;
using Sharat.DTO.AdminControllerDTOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.Mappers.AdminMappers
{
    public class AAirlineDetailsPocoToDto : Profile
    {
        public AAirlineDetailsPocoToDto()
        {
            CreateMap<Airline, ADetailsAirlineDto>()
                .ConstructUsing(src => new ADetailsAirlineDto(
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
