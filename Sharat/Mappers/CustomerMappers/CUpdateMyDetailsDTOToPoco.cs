using AutoMapper;
using DataCommunicator.Pocos;
using Sharat.DTO.CustomerControllerDTOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.Mappers.CustomerMappers
{
    public class CUpdateMyDetailsDTOToPoco : Profile
    {
        public CUpdateMyDetailsDTOToPoco()
        {
            CreateMap<UpdateCustomerDTO, Customer>().ConstructUsing(src =>
                  new Customer
                  {
                      Id = src.CustomerId,
                      FirstName = src.FirstName,
                      LastName = src.LastName,
                      Address = src.Address,
                      Credit_Card_No = src.CreditCard,
                      PhoneNo = src.PhoneNu,
                      UserFk = new User { Username = src.UserName, Email = src.Email }
                  }
                );
        }
    }
}
