using AutoMapper;
using DataCommunicator.Pocos;
using Sharat.DTO.AdminControllerDTOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.Mappers.AdminMappers
{
    public class AUpdateCustomerDTOToPoco : Profile
    {
        public AUpdateCustomerDTOToPoco()
        {
            CreateMap<AUpdateCustomerDTO, Customer>()
                .ConstructUsing(src =>
                    new Customer
                    {
                        Id = src.Id,
                        FirstName = src.FirstName,
                        LastName = src.LastName,
                        Address = src.Address,
                        Points = src.Points,
                        PhoneNo = src.PhoneNo,
                        UserFk = new User { Username = src.Username, Email = src.Email }
                    }
              );
        }
    }
}
