using AutoMapper;
using DataCommunicator.Pocos;
using Sharat.DTO.GeneralDTOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.Mappers.GeneralMappers
{
    public class AirlinePocoToDTOMapper : Profile
    {
        public AirlinePocoToDTOMapper()
        {
            CreateMap<Airline, AirlineDTO>()
                .ForMember(dest => dest.AirlineId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.AirlineName, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.CountryId, opt => opt.MapFrom(src => src.CountryFk.Id))
                .ForMember(dest => dest.OverAllScore, opt => opt.MapFrom(src => src.OverAllScore))
                .ForMember(dest => dest.CountryName, opt => opt.MapFrom(src => src.CountryFk.Name));          
        }
    }
}
