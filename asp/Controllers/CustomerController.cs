using AutoMapper;
using DataCommunicator;
using DataCommunicator.IFacades;
using DataCommunicator.Pocos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sharat.DTO.CustomerControllerDTOS;
using Sharat.DTO.GeneralDTOS;
using Sharat.Filters;
using System.Collections.Generic;
using System.Threading.Tasks;
using Stripe;
using Sharat.Services.AzureBlobs;
using Microsoft.Extensions.Configuration;

namespace Sharat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Customer")]
    [GeneralTokenGetter]
    [FacadeReturnerFilter(typeof(ILoggedInCustomerFacade))]
    public class CustomerController : TokenedControllerBase<DataCommunicator.Pocos.Customer>
    {
       
        internal ILoggedInCustomerFacade theFacade;
        private IMapper m_mapper;
        private readonly IBlobService _blobService;
        private string m_stripe_public_key;

        public CustomerController(IMapper mapper, IFlightCenterSystem fcSystem, IBlobService blobService, IConfiguration config)
        {
        
            flightCenter = fcSystem;
            theFacade = fcSystem.FacadeFactory.GetFacade<ILoggedInCustomerFacade>();
            m_mapper = mapper;
            _blobService = blobService;
            m_stripe_public_key = config.GetSection("Stripe").GetValue<string>("PublishableKey");          
        }
        //Customer Facade 1
        [PlaceboUserFilter]
        [HttpPost("buyticket")]
        public async Task<ActionResult<long>> BuyTicket([FromBody] BuyTicketDTO ticketDTO)
        {          
            var options = new TokenCreateOptions
            {
                Card = new TokenCardOptions
                {
                    Number = "4242424242424242",
                    ExpMonth = 10,
                    ExpYear = 2023,
                    Cvc = "314",
                },
            };
            var service = new TokenService();
            var token = service.Create(options);
            var optionsCharge = new ChargeCreateOptions
            {
                // Stripe Amount is in cents therefore the multiply
                Amount = (ticketDTO.TicketPrice - ticketDTO.PointsToConsume) * 100,
                Currency = "USD",
                Description = $"Customer {tokenUserInfo.Id} Buying Ticket To Flight {ticketDTO.FlightId}",
                Source = token.Id
            };
           
            var Chargeservice = new ChargeService();
            Charge charge = await Chargeservice.CreateAsync(optionsCharge);
            if (charge.Status == "succeeded")
            {               
                Ticket ticket = m_mapper.Map<Ticket>(ticketDTO);
                ticket.CustomerFk.Id = tokenUserInfo.Id;
                ticket.StripeId = charge.Id;
                Task<long> t = Task.Run<long>(() => theFacade.BuyTicket(ticket, ticketDTO.PointsToConsume));

                await t;

                return Created("",$"Ticket With Id #{t.Result} Created!");
            }

            return null;
        }
        //Customer Facade 2
        [HttpGet("mydetails")]
        public async Task<ActionResult<CustomerDTO>> GetMyDetails()
        {
            Task<DataCommunicator.Pocos.Customer> t = Task.Run<DataCommunicator.Pocos.Customer>(() => theFacade.GetCustomer((long)tokenUserInfo.Id));         
                await t;
            CustomerDTO result = m_mapper.Map<CustomerDTO>(t.Result);
            // Get Airline Image As Byte Array
            result.ImgByteArr = await _blobService.GetBlob($"uid_{(long)tokenUserInfo.UserFk.Id}", "userimages");
            return Ok(result);           
        }
        //Customer Facade 3
        [HttpGet("activetickets")]
        public async Task<ActionResult<List<CustomerTicketDTO>>> GetActiveTickets()
        {
            Task<List<Ticket>> t = Task.Run<List<Ticket>>(() => theFacade.GetActiveTickets((long)tokenUserInfo.Id));
          
                await t;
            
            return Ok(t.Result.ConvertAll<CustomerTicketDTO>(ticket => m_mapper.Map<CustomerTicketDTO>(ticket)));
        }
        //Customer Facade 4
        //[PlaceboUserFilter]
        [HttpPatch("updatemydetails")]
        public async Task<ActionResult<long>> UpdateMyDetails([FromForm] UpdateCustomerDTO customer)
        {           
            Task<long> t = Task.Run<long>(() => 
            theFacade.UpdateCustomer(m_mapper.Map<DataCommunicator.Pocos.Customer>(customer))
            );
           
                await t;
            if (customer.Img != null)
            {
                byte[] fileBytes = FormFileToByteArr(customer.Img);
                await _blobService.UploadContentBlobAsync(fileBytes, $"uid_{tokenUserInfo.UserFk.Id}", "userimages");
            }
            return Ok($"Customer With Id {t.Result} Was Succesfully Updated!");
        }

        //Customer Facade 5
        [HttpGet("ticketshistory")]
        public async Task<ActionResult<List<CustomerTicketDTO>>> GetTicketsHistory()
        {
            Task<List<Ticket>> t = Task.Run<List<Ticket>>(() => theFacade.GetTicketsHistory((long)tokenUserInfo.Id));         
                await t;          
            return Ok(t.Result.ConvertAll<CustomerTicketDTO>(ticket => m_mapper.Map<CustomerTicketDTO>(ticket)));
        }

        //Customer Facade 6
        [PlaceboUserFilter]
        [HttpDelete("removeticket/{ticketId}")]
        public async Task<ActionResult<long>> RemoveTicket(long ticketId)
        {
            Task<KeyValuePair<long,string>> t = Task.Run<KeyValuePair<long, string>>(() => theFacade.RemoveTicket(ticketId,(long)tokenUserInfo.Id));
            await t;
            // If The Tickets Were Generated By The Main Admin For Testing Purposes
            if (t.Result.Value == "Data Generator Stripe Id")
            {
                return Ok($"Ticket #{t.Result.Key} Removed!");
            }
            var options = new RefundCreateOptions
            {
                Charge = t.Result.Value,
            };
            var service = new RefundService();
            Refund refundObj = await service.CreateAsync(options);
            if (refundObj.Status == "succeeded")
            {
                return Ok($"Ticket #{t.Result.Key} Removed!");
            }
            return null;
               
        }
    }
}

