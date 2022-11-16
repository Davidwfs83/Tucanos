using AutoMapper;
using DataCommunicator;
using DataCommunicator.IFacades;
using DataCommunicator.Pocos;
using DataCommunicator.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sharat.DTO.AirlineControllerDTOS;
using Sharat.DTO.GeneralDTOS;
using Sharat.Filters;
using Sharat.Services.AzureBlobs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Sharat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Airline")]
    [GeneralTokenGetter]
    [FacadeReturnerFilter(typeof(ILoggedInAirlineFacade))]
    public class AirlineController : TokenedControllerBase<Airline>
    {
        
        internal ILoggedInAirlineFacade theFacade;
        private IMapper m_mapper;
        private readonly IBlobService _blobService;
        public AirlineController(IMapper mapper, IFlightCenterSystem fcSystem,
            IBlobService blobService)
        {
            flightCenter = fcSystem;
            theFacade = fcSystem.FacadeFactory.GetFacade<ILoggedInAirlineFacade>();
            m_mapper = mapper;
            _blobService = blobService;
        }

        //Airline Facade 1
        [PlaceboUserFilter]
        [HttpPost("createflight")]
        public async Task<ActionResult<long>> CreateFlight([FromBody] CreateFlightDTO flightDTO)
        {
            Flight flight = m_mapper.Map<Flight>(flightDTO);
            flight.AirlineCompanyFk.Id = tokenUserInfo.Id;
            Task<long> t = Task.Run<long>(() => theFacade.CreateFlight(flight));
            
                await t;
            
            return Created($"Flight #{t.Result} Created!", t.Result);
        }

        //Airline Facade 2
        [PlaceboUserFilter]
        [HttpDelete("removeflight/{flightId}")]
        public async Task<ActionResult<long>> RemoveFlight(long flightId)
        {
            Task<long> t = Task.Run<long>(() => theFacade.RemoveFlight(flightId,(long)tokenUserInfo.Id));
            
                await t;
            
            return Ok($"Flight #{t.Result} Removed!");
        }
        //Airline Facade 4
        [HttpGet("GetTicketsByFlight/{flightId}")]
        public async Task<ActionResult<List<AirlineTicketDTO>>> GetTicketsByFlight(long flightId)
        {
            Task<List<Ticket>> t = Task.Run<List<Ticket>>(() => theFacade.GetAllTicketsByFlight(flightId,(long)tokenUserInfo.Id));
            
                await t;
            
            return Ok(t.Result.ConvertAll<AirlineTicketDTO>(ticket => m_mapper.Map<AirlineTicketDTO>(ticket)));
        }
        //Airline Facade 5
        [HttpGet("mydetails")]
        public async Task<ActionResult<AirlineDetailsDTO>> GetMyDetails()
        {
            Task<Airline> t = Task.Run<Airline>(() => theFacade.GetAirline((long)tokenUserInfo.Id));
           
                await t;
            AirlineDetailsDTO result = m_mapper.Map<AirlineDetailsDTO>(t.Result);
            // Get Airline Image As Byte Array
            result.ImgByteArr = await _blobService.GetBlob($"uid_{(long)tokenUserInfo.UserFk.Id}", "userimages");
            return Ok(result);
        }
        //Airline Facade 6
        [PlaceboUserFilter]
        [HttpPatch("updatemydetails")]
        public async Task<ActionResult<long>> UpdateMyDetails([FromForm] AirlineUpdateDetailsDTO airline)
        {
            Task<long> t = Task.Run<long>(() =>
            theFacade.UpdateAirline(m_mapper.Map<Airline>(airline))
            );
            
                await t;
            if (airline.Img != null)
            {
                byte[] fileBytes = FormFileToByteArr(airline.Img);
                await _blobService.UploadContentBlobAsync(fileBytes, $"uid_{tokenUserInfo.UserFk.Id}", "userimages");
            }
            return Ok($"Admin #{t.Result} Updated!");

        }
        //Airline Facade 7
        [HttpPost("GetAllMyFlights")]
        public async Task<ActionResult<List<FlightDTO>>> GetAllMyFlights([FromBody] FlightQuery query)
        {
            query.AllowedAirlinesIds = new long?[] { (long)tokenUserInfo.Id };
            Task<List<Flight>> t = Task.Run<List<Flight>>(() => theFacade.GetAllMyFlights(query));
            
                await t;
                       
            return Ok(t.Result.ConvertAll<FlightDTO>(flight => m_mapper.Map<FlightDTO>(flight)));
        }
    }
}
