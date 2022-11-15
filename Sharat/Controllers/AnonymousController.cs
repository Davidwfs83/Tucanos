using AutoMapper;
using DataCommunicator;
using DataCommunicator.IFacades;
using DataCommunicator.Pocos;
using DataCommunicator.Queries;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sharat.DTO.AnonymousControllerDTOS;
using Sharat.DTO.GeneralDTOS;
using Sharat.Filters;
using Sharat.Services.AzureBlobs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Sharat.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    [FacadeReturnerFilter(typeof(IAnonymousUserFacade))]
    public class AnonymousController : ExtendedControllerBase
    {
        private readonly IBlobService _blobService;
        private readonly ILogger<AnonymousController> _logger;
        internal IAnonymousUserFacade theFacade;
        private IMapper m_mapper;
        public AnonymousController(IFlightCenterSystem fcSystem, IMapper mapper, IBlobService blobService,
            ILogger<AnonymousController> logger)
        {
            _blobService = blobService;
            _logger = logger;
            flightCenter = fcSystem;
            theFacade = fcSystem.FacadeFactory.GetFacade<IAnonymousUserFacade>();
            m_mapper = mapper;
        }
        //Anon Facade 1
        [HttpPost("createnewcustomer")]
        public async Task<ActionResult<long>> CreateNewCustomer([FromForm] CustomerSignUpDTO signUpDto)
        {
            Task<KeyValuePair<long, long>> t = Task.Run<KeyValuePair<long, long>>(() => 
            theFacade.CreateCustomer(m_mapper.Map<Customer>(signUpDto))
            );
            
                await t;
            if (signUpDto.Img != null)
            {
                byte[] fileBytes = FormFileToByteArr(signUpDto.Img);
                await _blobService.UploadContentBlobAsync(fileBytes, $"uid_{t.Result.Value}", "userimages");
            }

            return Created("",$"Customer #{t.Result.Key} Created!");
        }

        //Anon Facade 3
        [HttpPost("getallflights")]
        public async Task<ActionResult<List<FlightDTO>>> GetAllFlights([FromBody] FlightQuery query)
        {
            Task<List<Flight>> t = Task.Run<List<Flight>>(() => theFacade.GetAllFlights(query));

                await t;

            return Ok(t.Result.ConvertAll<FlightDTO>(flight => m_mapper.Map<FlightDTO>(flight)));
        }



        //Anon Facade 4
        [HttpGet("getallairlines")]
        public async Task<ActionResult<List<AirlineDTO>>> GetAllAirlines()
        {
            Task<List<Airline>> t = Task.Run<List<Airline>>(() => theFacade.GetAllAirlines());       
                await t;
            
            return Ok(t.Result.ConvertAll<AirlineDTO>(airline => m_mapper.Map<AirlineDTO>(airline)));
        }

        //Anon Facade 5
        [HttpGet("getallcountries")]
        public async Task<ActionResult<List<Country>>> GetAllCountries()
        {
            Task<List<Country>> t = Task.Run<List<Country>>(() => theFacade.GetAllCountries(null));            
                await t;
                      
            return Ok(t.Result);
        }


        //Anon Facade 6
        [HttpPost("requestairlinecreation")]
        public async Task<ActionResult<long>> RequestAirlineCreation([FromForm] AirlineCreationRequestDTO signUpDto)
        {
            Task<long> t = Task.Run<long>(() =>
            theFacade.RequestAirlineCreation(m_mapper.Map<AirlineCreationRequest>(signUpDto))
            );

            await t;
            if (signUpDto.Img != null)
            {
                byte[] fileBytes = FormFileToByteArr(signUpDto.Img);
                await _blobService.UploadContentBlobAsync(fileBytes, $"id_{t.Result}", "airlinecreationrequests");
            }

            return Created("", $"Airline Creation Request #{t.Result} Created!");

        }
        //Anon Facade 7
        [HttpGet("reviewsbyairline/{airlineId}")]
        public async Task<ActionResult<List<Review>>> GetReviewsByAirline(long airlineId)
        {
            Task<List<Review>> t = Task.Run<List<Review>>(() => theFacade.GetReviewsByAirline(airlineId));
            await t;
            foreach (Review review in t.Result)
            {
                review.CustomerFk.ImgByteArr = await _blobService.GetBlob($"uid_{review.CustomerFk.UserFk.Id}", "userimages");
            }
            return Ok(t.Result);
        }

        //Anon Facade 8
        [HttpGet("GetFlight/{flightId}")]
        public async Task<ActionResult<FlightDTO>> GetFlight(long flightId)
        {
            Task<Flight> t = Task.Run<Flight>(() => theFacade.GetFlight(flightId));
                await t;
            return Ok(m_mapper.Map<FlightDTO>(t.Result));
        }

        //Anon Facade 9
        [HttpGet("GetAirline/{airlineId}")]
        public async Task<ActionResult<AirlineDTO>> GetAirline(long airlineId)
        {
            Task<Airline> t = Task.Run<Airline>(() => theFacade.GetAirline(airlineId));
                await t;
            t.Result.ImgByteArr = await _blobService.GetBlob($"uid_{t.Result.UserFk.Id}", "userimages");

            return Ok(m_mapper.Map<AirlineDTO>(t.Result));
        }
        //Anon Facade 10
        [HttpGet("threerandreviews")]
        public async Task<ActionResult<List<Review>>> GetThreeReviews(long airlineId)
        {
            Task<List<Review>> t = Task.Run<List<Review>>(() => theFacade.ThreeRandomReviews());
            await t;
            foreach (Review review in t.Result)
            {
                review.CustomerFk.ImgByteArr = await _blobService.GetBlob($"uid_{review.CustomerFk.UserFk.Id}", "userimages");
            }
                           
            return Ok(t.Result);
        }

    }
}


