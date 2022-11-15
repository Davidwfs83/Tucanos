using AutoMapper;
using DataCommunicator.Pocos;
using Sharat.DTO.AdminControllerDTOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.Mappers.AdminMappers
{
    public class AdminCreateCountryDTOToPocoMapper : Profile
    {
        public AdminCreateCountryDTOToPocoMapper()
        {
            CreateMap<CountryCreateDTO,Country>()
                .ConstructUsing(src => new Country(
                src.Name,
                src.Latitude,
                src.Longitude
                    ));
        }
    }
}
