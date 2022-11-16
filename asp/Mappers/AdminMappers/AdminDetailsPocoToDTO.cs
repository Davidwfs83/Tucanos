using AutoMapper;
using DataCommunicator.Pocos;
using Sharat.DTO.AdminControllerDTOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.Mappers.AdminMappers
{
    public class AdminDetailsPocoToDTO : Profile
    {
        public AdminDetailsPocoToDTO()
        {
            CreateMap<Admin, AdminDetailsDTO>()
                .ConstructUsing(src => new AdminDetailsDTO(
                (long)src.Id,
                src.FirstName,
                src.LastName,
                (int)src.Level,
                src.UserFk.Username,
                src.UserFk.Email,
                src.ImgLink,
               (long)src.UserFk.Id
                    ));
        }
    }
}
