using AutoMapper;
using DataCommunicator.Pocos;
using Sharat.DTO.AdminControllerDTOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.Mappers.AdminMappers
{
    public class AdminUpdateSelfDTOToPoco : Profile
    {
        public AdminUpdateSelfDTOToPoco()
        {
            CreateMap<AdminUpdateSelfDTO, Admin>()
                .ConstructUsing(src => new Admin(
                src.AdminId,
                src.Firstname,
                src.Lastname,
                null,
                new User(src.Username, src.Email)                      
                    ));
        }
    }
}
