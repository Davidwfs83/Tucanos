using AutoMapper;
using DataCommunicator.Pocos;
using Sharat.DTO.AirlineControllerDTOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.Mappers.AirlinesMappers
{
    public class AirlineTicketMapper : Profile
    {
        public AirlineTicketMapper()
        {
            CreateMap<Ticket, AirlineTicketDTO>()
                .ForMember(dest => dest.TicketId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.CustomerId, opt => opt.MapFrom(src => src.CustomerFk.Id))
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.CustomerFk.FirstName))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.CustomerFk.LastName))
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.CustomerFk.Address))
                .ForMember(dest => dest.PhoneNu, opt => opt.MapFrom(src => src.CustomerFk.PhoneNo))
                .ForMember(dest => dest.ImgLink, opt => opt.MapFrom(src => src.CustomerFk.ImgLink))
                .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.CustomerFk.Gender));            
        }
    }
}
