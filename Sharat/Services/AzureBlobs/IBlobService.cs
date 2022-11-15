using Azure.Storage.Blobs.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.Services.AzureBlobs
{
    public interface IBlobService
    {
        public  Task<Stream> GetBlobAsync(string name, string containerName);
        public  Task UploadContentBlobAsync(byte[] content, string fileName, string containerName);
        public  Task DeleteBlobAsync(string blobName);
        public  Task<string> GetBlob(string name, string containerName);

        // The Image and its id
        public Task<Dictionary<long,string>> GetMultipleBlobs(Dictionary<long, string> blobsNameAndId, string containerName);

    }
}
