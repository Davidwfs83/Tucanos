using AutoMapper;
using DataCommunicator.Pocos;
using Sharat.DTO.AnonymousControllerDTOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.Mappers.AnonMappers
{
    public class AnonCreateCustomerMap : Profile
    {
        public AnonCreateCustomerMap()
        {
            CreateMap<CustomerSignUpDTO, Customer>()
                .ForPath(dest => dest.UserFk.Username, opt => opt.MapFrom(src => src.Username))
                .ForPath(dest => dest.UserFk.Password, opt => opt.MapFrom(src => src.Password))
                .ForPath(dest => dest.UserFk.Email, opt => opt.MapFrom(src => src.Email))
                .ForPath(dest => dest.UserFk.UserRoleFk, opt => opt.MapFrom(src => UserRole.Customer))
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName))
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address))
                .ForMember(dest => dest.PhoneNo, opt => opt.MapFrom(src => src.PhoneNo))
                .ForMember(dest => dest.Credit_Card_No, opt => opt.MapFrom(src => src.CreditCard))
                .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.Gender));

        }
    }
}
