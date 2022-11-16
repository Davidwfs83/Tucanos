using DataCommunicator;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace Sharat.Controllers
{
    public abstract class ExtendedControllerBase : ControllerBase
    {
        internal IFlightCenterSystem flightCenter;

        // Support For Uploading Images
        protected byte[] FormFileToByteArr(IFormFile file)
        {
            if (file == null)
                return null;
            byte[] fileBytes = new byte[file.Length];
            using (var ms = new MemoryStream())
            { 
                file.CopyTo(ms);
                fileBytes = ms.ToArray();
            }
            return fileBytes;
        }
        
    }
}
