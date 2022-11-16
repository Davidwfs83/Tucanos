using AutoMapper;
using DataCommunicator.Pocos;
using Sharat.DTO.GeneralDTOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.Mappers.GeneralMappers
{
    public class CustomerToDTOMapper : Profile
    {
        public CustomerToDTOMapper()
        {
            CreateMap<Customer, CustomerDTO>()
                .ConstructUsing(src => new CustomerDTO
                {
                      Id =(long)src.Id,
                      FirstName = src.FirstName,
                      LastName =src.LastName,
                      Address = src.Address,
                      CreditCard =src.Credit_Card_No,
                      PhoneNu = src.PhoneNo,
                      Gender =(bool)src.Gender,
                      Points = (int)src.Points,
                      UserName = src.UserFk.Username,
                      Email = src.UserFk.Email,
                      ImgLink = src.ImgLink,
                      UserId = (long)src.UserFk.Id
                }
                );
        }
    }
}
