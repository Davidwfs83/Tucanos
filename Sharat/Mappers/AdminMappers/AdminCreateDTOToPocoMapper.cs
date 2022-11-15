using AutoMapper;
using DataCommunicator.Pocos;
using Sharat.DTO.AdminControllerDTOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.Mappers.AdminMappers
{
    public class AdminCreateDTOToPocoMapper : Profile
    {
        public AdminCreateDTOToPocoMapper()
        {
            CreateMap<AdminCreateDTO, Admin>()
                .ConstructUsing(src => new Admin(
                src.FirstName,
                src.LastName,
                src.Level,
                new User(src.Username, src.Password, src.Email)
                    ));
        }
    }
}
