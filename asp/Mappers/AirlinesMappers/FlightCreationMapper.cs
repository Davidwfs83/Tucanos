using AutoMapper;
using DataCommunicator.Pocos;
using Microsoft.AspNetCore.Mvc;
using Sharat.DTO.AirlineControllerDTOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.Mappers.AirlinesMappers
{
    public class FlightCreationMapper : Profile
    {
        public FlightCreationMapper()
        {
            CreateMap<CreateFlightDTO, Flight>()
                
               .ForPath(dest => dest.OriginCountryFk.Id, opt => opt.MapFrom(src => src.OriginCountryId))
               .ForPath(dest => dest.DestinationCountryFk.Id, opt => opt.MapFrom(src => src.DestinationCountryId))
               .ForPath(dest => dest.AirlineCompanyFk.Id, opt => opt.MapFrom(src => src.AirlineId))
               .ForMember(dest => dest.DepartureTime, opt => opt.MapFrom(src => src.DepartureTime))
               .ForMember(dest => dest.LandingTime, opt => opt.MapFrom(src => src.LandingTime))
               .ForMember(dest => dest.RemainingTickets, opt => opt.MapFrom(src => src.RemainingTickets))
               .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price));              
        }
    }
}
