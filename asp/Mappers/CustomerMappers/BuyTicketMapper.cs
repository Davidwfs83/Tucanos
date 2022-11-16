using AutoMapper;
using DataCommunicator.Pocos;
using Sharat.DTO.CustomerControllerDTOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.Mappers.CustomerMappers
{
    public class BuyTicketMapper : Profile
    {
        public BuyTicketMapper()
        {
            CreateMap<BuyTicketDTO, Ticket>()
                .ConstructUsing(src => new Ticket(
                    new Flight(src.FlightId)
                    , new Customer {Points = src.PointsToConsume })
                );
                                          
        }
    } 
}
