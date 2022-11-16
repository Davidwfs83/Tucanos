using AutoMapper;
using DataCommunicator.Pocos;
using Sharat.DTO.CustomerControllerDTOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.Mappers.CustomerMappers
{
    public class CustomerTicketMapper : Profile
    {
        public CustomerTicketMapper()
        {
            CreateMap<Ticket, CustomerTicketDTO>()
                .ForMember(dest => dest.TicketId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Cost, opt => opt.MapFrom(src => src.Cost))
                .ForMember(dest => dest.FlightId, opt => opt.MapFrom(src => src.FlightFk.Id))
                .ForMember(dest => dest.AirlineName, opt => opt.MapFrom(src => src.FlightFk.AirlineCompanyFk.Name))
                .ForMember(dest => dest.OriginCountryName, opt => opt.MapFrom(src => src.FlightFk.OriginCountryFk.Name))
                .ForMember(dest => dest.DestinationCountryName, opt => opt.MapFrom(src => src.FlightFk.DestinationCountryFk.Name))
                .ForMember(dest => dest.DepartureTime, opt => opt.MapFrom(src => src.FlightFk.DepartureTime))
                .ForMember(dest => dest.LandingTime, opt => opt.MapFrom(src => src.FlightFk.LandingTime))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.FlightFk.Price));

        }
    }
}
