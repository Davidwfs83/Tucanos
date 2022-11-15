using AutoMapper;
using DataCommunicator.Pocos;
using Sharat.DTO.AnonymousControllerDTOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.Mappers.AnonMappers
{
    public class AnonCreateAirlineCreationRequestDTOToPoco : Profile
    {
        public AnonCreateAirlineCreationRequestDTOToPoco()
        {
            CreateMap<AirlineCreationRequestDTO, AirlineCreationRequest>()
                .ConstructUsing(src => new AirlineCreationRequest(
                    src.CompanyName,                   
                    src.CountryId,                  
                    src.Username,
                    src.Password,
                    src.Email ,
                    src.CompanyDescription
               ));
        }
    }
}
