using AutoMapper;
using DataCommunicator;
using DataCommunicator.IFacades;
using DataCommunicator.Pocos;
using DataCommunicator.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sharat.DTO.AdminControllerDTOS;
using Sharat.DTO.GeneralDTOS;
using Sharat.Filters;
using Sharat.Services.AzureBlobs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Sharat.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    [GeneralTokenGetter]
    [FacadeReturnerFilter(typeof(ILoggedInAdministratorFacade))]
    public class AdminController : TokenedControllerBase<Admin>
    {
        private readonly ILogger<AdminController> _logger;
        internal ILoggedInAdministratorFacade theFacade;
        private IMapper m_mapper;
        private readonly IBlobService _blobService;
        public AdminController(IMapper mapper, IFlightCenterSystem fcSystem, ILogger<AdminController> logger,
            IBlobService blobService)
        {
            _logger = logger;
            flightCenter = fcSystem;
            theFacade = fcSystem.FacadeFactory.GetFacade<ILoggedInAdministratorFacade>();
            _blobService = blobService;
            m_mapper = mapper;
        }

        //Admin Facade 1
        [HttpPost("queryallcustomers")]
        public async Task<ActionResult<List<CustomerDTO>>> QueryAllCustomers([FromBody] CustomerQuery query)
        {
            Task<List<Customer>> t = Task.Run<List<Customer>>(() => theFacade.GetAllCustomers(query));        
                await t;
            List<CustomerDTO> result = t.Result.ConvertAll<CustomerDTO>(customer => m_mapper.Map<CustomerDTO>(customer));
            
            return Ok(result);
        }
        //Admin Facade 2
        [PlaceboUserFilter]
        [HttpPatch("updatecustomer")]
        public async Task<ActionResult<long>> UpdateCustomer([FromForm] AUpdateCustomerDTO updatedCus)
        {
            Task<long> t = Task.Run<long>(() => theFacade.UpdateCustomer(m_mapper.Map<Customer>(updatedCus)));
                await t;
            if (updatedCus.Img != null)
            {
                byte[] fileBytes = FormFileToByteArr(updatedCus.Img);
                await _blobService.UploadContentBlobAsync(fileBytes, $"uid_{updatedCus.UserId}", "userimages");
            }
            return Ok($"Customer #{t.Result} Updated!");
        }
        [PlaceboUserFilter]
        [AdminLevelAuthorizeFilter(2)]
        //Admin Facade 3  
        [HttpDelete("removecustomer")]
        public async Task<ActionResult<long>> RemoveCustomer(long cusId)
        {
            Task<long> t = Task.Run<long>(() => theFacade.RemoveCustomer(cusId, (long)tokenUserInfo.Id));
                await t;
            return Ok($"Customer #{t.Result} Deleted!");
        }

        [PlaceboUserFilter]
        //Admin Facade 9    
        [HttpPatch("updateairline")]
        public async Task<ActionResult<long>> UpdateAirline([FromForm] AUpdateAirlineDTO updatedAirline)
        {
            Task<long> t = Task.Run<long>(() => theFacade.UpdateAirline(m_mapper.Map<Airline>(updatedAirline)));           
                await t;
            if (updatedAirline.Img != null)
            {
                byte[] fileBytes = FormFileToByteArr(updatedAirline.Img);
                await _blobService.UploadContentBlobAsync(fileBytes, $"uid_{updatedAirline.UserId}", "userimages");
            }
            return Ok($"Airline #{t.Result}  Updated!");
        }
        [PlaceboUserFilter]
        [AdminLevelAuthorizeFilter(2)]
        //Admin Facade 10
        [HttpDelete("removeairline")]
        public async Task<ActionResult<long>> RemoveAirline(long airlineId)
        {
            Task<long> t = Task.Run<long>(() => theFacade.RemoveAirline(airlineId, (long)tokenUserInfo.Id));
            await t;
            return Ok($"Airline with #{t.Result} Deleted! ");
        }

        [PlaceboUserFilter]
        [AdminLevelAuthorizeFilter(3)]
        //Admin Facade 11    
        [HttpPatch("updateadmin")]
        public async Task<ActionResult<long>> UpdateAdmin([FromBody] AdminDetailsDTO updatedAdmin)
        {
            Task<long> t = Task.Run<long>(() => theFacade.UpdateAdmin(m_mapper.Map<Admin>(updatedAdmin), (long)tokenUserInfo.Id));
            await t;
            return Ok(t.Result);
        }
        [AdminLevelAuthorizeFilter(3)]
        //Admin Facade 12
        [HttpPost("queryalladmins")]
        public async Task<ActionResult<List<AdminDetailsDTO>>> QueryAllAdmins([FromBody] AdminQuery query)
        {
            Task<List<Admin>> t = Task.Run<List<Admin>>(() => theFacade.GetAllAdmins(query, (long)tokenUserInfo.Id));

            await t;

            return Ok(t.Result.ConvertAll<AdminDetailsDTO>(admin => m_mapper.Map<AdminDetailsDTO>(admin)));
        }
        [PlaceboUserFilter]        
        [AdminLevelAuthorizeFilter(3)]
        //Admin Facade 13
        [HttpDelete("removeadmin")]
        public async Task<ActionResult<long>> RemoveAdmin(long adminId)
        {
            Task<long> t = Task.Run<long>(() => theFacade.RemoveAdmin(adminId, (long)tokenUserInfo.Id));
            await t;
            return Ok($"Admin with #{t.Result} Deleted!");
        }

        [PlaceboUserFilter]
        [AdminLevelAuthorizeFilter(2)]
        // Admin Facade 14
        [HttpPost("createairline")]
        public async Task<ActionResult<long>> CreateAirline([FromForm] AirlineCreateDTO airline)
        {
            Task<KeyValuePair<long, long>> t = Task.Run<KeyValuePair<long, long>>(() => 
            theFacade.CreateAirline(m_mapper.Map<Airline>(airline)));
            await t;
            if (airline.Img != null)
            {
                byte[] fileBytes = FormFileToByteArr(airline.Img);
                await _blobService.UploadContentBlobAsync(fileBytes, $"uid_{t.Result.Value}", "userimages");
            }

            return Created("", $"Airline #{t.Result.Key} Created!");
        }

        [PlaceboUserFilter]
        [AdminLevelAuthorizeFilter(4)]
        // Admin Facade 15
        [HttpPost("createadmin")]
        public async Task<ActionResult<long>> CreateAdmin([FromForm] AdminCreateDTO admin)
        {
            Task<KeyValuePair<long, long>> t = Task.Run<KeyValuePair<long, long>>(() =>
            theFacade.CreateAdmin(m_mapper.Map<Admin>(admin), (long)tokenUserInfo.Id));

            await t;
            if (admin.Img != null)
            {
                byte[] fileBytes = FormFileToByteArr(admin.Img);
                await _blobService.UploadContentBlobAsync(fileBytes, $"uid_{t.Result.Value}", "userimages");
            }

            return Created("", $"Admin #{t.Result.Key} Created!");
        }

        [PlaceboUserFilter]
        [AdminLevelAuthorizeFilter(3)]
        // Admin Facade 16
        [HttpPost("createcountry")]
        public async Task<ActionResult<long>> CreateCountry([FromForm] CountryCreateDTO country)
        {
            Task<long> t = Task.Run<long>(() =>theFacade.CreateCountry(m_mapper.Map<Country>(country)));
            await t;
            if (country.Img != null)
            {
                byte[] fileBytes = FormFileToByteArr(country.Img);
                await _blobService.UploadContentBlobAsync(fileBytes, $"country_{t.Result}", "countryimages");
            }
            
            return Created("",$"Country #{t.Result} Created!");
        }

        [PlaceboUserFilter]
        [AdminLevelAuthorizeFilter(3)]
        // Admin Facade 17
        [HttpDelete("removecountry")]
        public async Task<ActionResult<long>> RemoveCountry(long countryId)
        {
            Task<long> t = Task.Run<long>(() => theFacade.RemoveCountry(countryId));

            await t;

            return Ok($"Country #{t.Result} Deleted! ");

        }
        [PlaceboUserFilter]
        [AdminLevelAuthorizeFilter(3)]
        //Admin Facade 18    
        [HttpPatch("updatecountry")]
        public async Task<ActionResult<long>> UpdateCountry([FromBody] Country updatedCountry)
        {
            Task<long> t = Task.Run<long>(() => theFacade.UpdateCountry(updatedCountry));
            await t;
            return Ok(t.Result);
        }

        [PlaceboUserFilter]
        [AdminLevelAuthorizeFilter(4)]
        //Admin Facade 19
        [HttpPost("datagenerator")]
        public async Task<ActionResult<RecordsCount>> DataGenerator([FromBody] RecordsCount recordsCount)
        {
            Task<RecordsCount> t = Task.Run<RecordsCount>(() => theFacade.GenerateAllData(recordsCount));
            
                await t;
            
            return Ok($"Data Created:{t.Result}");
        }

        [PlaceboUserFilter]
        [AdminLevelAuthorizeFilter(4)]
        //Admin Facade 20
        [HttpDelete("cleardatabase")]
        public async Task<ActionResult<RecordsCount>> ClearDatabase()
        {
            Task<RecordsCount> t = Task.Run<RecordsCount>(() => theFacade.ClearAllData());
            
                await t;
            
            return Ok("All Records Deleted Succesfully!");

        }

        //Admin Facade 21
        [HttpGet("mydetails")]
        public async Task<ActionResult<AdminDetailsDTO>> GetMyDetails()
        {
            // Get Admin Static Details
            Task<Admin> t = Task.Run<Admin>(() => theFacade.GetMyDetails((long)tokenUserInfo.Id));       
                await t;
            AdminDetailsDTO result = m_mapper.Map<AdminDetailsDTO>(t.Result);
            // Get Admin Image As Byte Array
            result.ImgByteArr =  await _blobService.GetBlob($"uid_{(long)tokenUserInfo.UserFk.Id}", "userimages");          
            return Ok(result);
        }

        [PlaceboUserFilter]
        //Admin Facade 22
        [HttpPatch("updatemydetails")]
        public async Task<ActionResult<long>> UpdateMyDetails([FromForm] AdminUpdateSelfDTO admin)
        {
            Task<long> t = Task.Run<long>(() =>
            theFacade.UpdateMyDetails(m_mapper.Map<Admin>(admin), (long)tokenUserInfo.Id)
            );           
                await t;
            if (admin.Img != null) {
                byte[] fileBytes = FormFileToByteArr(admin.Img);
                await _blobService.UploadContentBlobAsync(fileBytes, $"uid_{tokenUserInfo.UserFk.Id}", "userimages");
            }
            return Ok($"Admin #{t.Result} Updated!");
        }

        //Admin Facade 23
        [HttpPost("queryallairlines")]
        public async Task<ActionResult<List<ADetailsAirlineDto>>> QueryAllAirlines([FromBody] AirlineQuery query)
        {
            Task<List<Airline>> t = Task.Run<List<Airline>>(() => theFacade.QueryAllAirlines(query));

            await t;

            return Ok(t.Result.ConvertAll<ADetailsAirlineDto>(airline => m_mapper.Map<ADetailsAirlineDto>(airline)));
        }

        //Anon Facade 24
        [HttpPost("queryallcountries")]
        public async Task<ActionResult<List<Country>>> QueryAllCountries([FromBody] CountryQuery query)
        {
            Task<List<Country>> t = Task.Run<List<Country>>(() => theFacade.GetAllCountries(query));
            await t;

            return Ok(t.Result);
        }
    }
}
