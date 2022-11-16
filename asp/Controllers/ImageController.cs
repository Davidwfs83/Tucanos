using System.Threading.Tasks;
using DataCommunicator.Pocos;
using Microsoft.AspNetCore.Mvc;
using Sharat.DTO.GeneralDTOS;
using Sharat.Services.AzureBlobs;

namespace Sharat.Controllers
{
    
       
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : TokenedControllerBase<IUserResource>
    {
        private readonly IBlobService _blobService;

        public ImageController(IBlobService blobService)
        {
            _blobService = blobService;
        }

        // 1 Image Controller
        [HttpGet("{userId}")]
        public async Task<ActionResult<ImageStrDTO>> GetUserImage(long userId)
        {
            string data = await _blobService.GetBlob($"uid_{userId}", "userimages");

            return Ok(new ImageStrDTO(data));
        }

        // 1 Image Controller
        [HttpGet("getcountry/{countryId}")]
        public async Task<ActionResult<ImageStrDTO>> GetCountryImage(long countryId)
        {
            string data = await _blobService.GetBlob($"country_{countryId}", "countryimages");

            return Ok(new ImageStrDTO(data));
        }
      
        [HttpDelete("{imageName}")]
        public async Task<IActionResult> DeleteFile(string imageName)
        {
            await _blobService.DeleteBlobAsync(imageName);
            return Ok();
        }

    }
}
