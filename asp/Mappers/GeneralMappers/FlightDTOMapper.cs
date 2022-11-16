using AutoMapper;
using DataCommunicator.Pocos;
using Sharat.DTO.GeneralDTOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.Mappers.AnonMappers
{
    public class FlightDTOMapper : Profile
    {
        public FlightDTOMapper()
        {
            CreateMap<Flight, FlightDTO>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.AirlineId, opt => opt.MapFrom(src => src.AirlineCompanyFk.Id))
                .ForMember(dest => dest.AirlineName, opt => opt.MapFrom(src => src.AirlineCompanyFk.Name))
                .ForMember(dest => dest.DestinationCountry, opt => opt.MapFrom(src => src.DestinationCountryFk.Name))
                .ForMember(dest => dest.DestinationLatitude, opt => opt.MapFrom(src => src.DestinationCountryFk.Latitude))
                .ForMember(dest => dest.DestinationLongitude, opt => opt.MapFrom(src => src.DestinationCountryFk.Longitude))
                .ForMember(dest => dest.OriginCountry, opt => opt.MapFrom(src => src.OriginCountryFk.Name))
                .ForMember(dest => dest.OriginLatitude, opt => opt.MapFrom(src => src.OriginCountryFk.Latitude))
                .ForMember(dest => dest.OriginLongitude, opt => opt.MapFrom(src => src.OriginCountryFk.Longitude))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price))
                .ForMember(dest => dest.DepartureTime, opt => opt.MapFrom(src => src.DepartureTime))
                .ForMember(dest => dest.RemainingTickets, opt => opt.MapFrom(src => src.RemainingTickets))
                .ForMember(dest => dest.LandingTime, opt => opt.MapFrom(src => src.LandingTime));
        }
    }
}
