using AutoMapper;
using DataCommunicator.Pocos;
using Sharat.DTO.AdminControllerDTOS;
using Sharat.DTO.AnonymousControllerDTOS;

namespace Sharat.Mappers.AdminMappers
{
    public class AirlineCreateDTOToPocoMapper :Profile
    {
        public AirlineCreateDTOToPocoMapper()
        {
            CreateMap<AirlineCreateDTO, Airline>()
                .ConstructUsing(src => new Airline(
                    src.CompanyName,                    
                    src.CountryId,
                    new User(src.Username, src.Password, src.Email)
               ));
        }
    }
}
