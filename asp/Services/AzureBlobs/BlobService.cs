using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;


namespace Sharat.Services.AzureBlobs
{
    public class BlobService : IBlobService
    {
        private readonly BlobServiceClient _blobServiceClient;
        public BlobService(BlobServiceClient blobServiceClient)
        {
            _blobServiceClient = blobServiceClient;

        }
        public async Task DeleteBlobAsync(string blobName)
        {
            throw new NotImplementedException();
        }

        private byte[] GetImageStreamAsBytes(Stream input)
        {
            var buffer = new byte[16 * 1024];
            using (MemoryStream ms = new MemoryStream())
            {
                int read;
                while ((read = input.Read(buffer, 0, buffer.Length)) > 0)
                {
                    ms.Write(buffer, 0, read);
                }
                return ms.ToArray();
            }
        }
        public async Task<Stream> GetBlobAsync(string name, string containerName)
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(name);
           
            var blobDownloadInfo = await blobClient.DownloadAsync();
            return blobDownloadInfo.Value.Content;           
        }

        public async Task<string> GetBlob(string name, string containerName)
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(name);
            try
            {
                var blobDownloadInfo = await blobClient.DownloadAsync();
                return Convert.ToBase64String(GetImageStreamAsBytes(blobDownloadInfo.Value.Content));               
            }
            catch (RequestFailedException ex)
            {
                if (ex.ErrorCode == "BlobNotFound")
                    return null;
                throw ex;
            }
        }
        public async Task<Dictionary<long,string>> GetMultipleBlobs(Dictionary<long, string> blobsNameAndId, string containerName)
        {
            Dictionary<long, string> result = new Dictionary<long, string>();
            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            List<Task> tasksList = new List<Task>();
            
            foreach (KeyValuePair<long, string> blobInfo in blobsNameAndId)
            {
                tasksList.Add(new Task(() => {
                    Response<BlobDownloadInfo> blobDownloadInfo = containerClient.GetBlobClient(blobInfo.Value).Download();
                    result.Add(blobInfo.Key, Convert.ToBase64String(GetImageStreamAsBytes(blobDownloadInfo.Value.Content)));
                }));
            }
            Task.WaitAll(tasksList.ToArray());
            return result;
        }

        public async Task UploadContentBlobAsync(byte[] content, string fileName,string containerName)
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(fileName);
           // var bytes = Encoding.UTF8.GetBytes(content);
            using (MemoryStream stream = new MemoryStream(content))
            {
                await blobClient.UploadAsync(stream, new BlobHttpHeaders { ContentType = "application/octet-stream" });

            }
        }

        
    }
}
