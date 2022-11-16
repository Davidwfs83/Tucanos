using AutoMapper;
using DataCommunicator.Pocos;
using Sharat.DTO.GeneralDTOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.Mappers.GeneralMappers
{
    public class AirlineDTOMapper : Profile
    {
        public AirlineDTOMapper()
        {
            CreateMap<Airline, AirlineDTO>()
                .ConstructUsing(src => new  AirlineDTO
                ((long)src.Id, src.Name, (long)src.CountryFk.Id, src.CountryFk.Name,src.ImgLink, (long)src.UserFk.Id)
                );
        }
    }
}
