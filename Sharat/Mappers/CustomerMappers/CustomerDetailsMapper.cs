using AutoMapper;
using DataCommunicator.Pocos;
using Sharat.DTO.CustomerControllerDTOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.Mappers.CustomerMappers
{
    public class CustomerDetailsMapper : Profile
    {
        public CustomerDetailsMapper()
        {
            CreateMap<Customer, UpdateCustomerDTO>()
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName))
                .ForMember(dest => dest.CreditCard, opt => opt.MapFrom(src => src.Credit_Card_No))
                .ForMember(dest => dest.PhoneNu, opt => opt.MapFrom(src => src.PhoneNo))
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.UserFk.Username))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.UserFk.Email));               
        }
    }
}
