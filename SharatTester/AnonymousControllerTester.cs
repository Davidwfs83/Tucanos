using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Sharat; 
namespace SharatTester

{
    [TestClass]
    public class AnonymousControllerTester

    {

        private readonly TestHostFixture _testHostFixture = new TestHostFixture();// Initializes the webHost
        private HttpClient _httpClient;//Http client used to send requests to the contoller

        [TestInitialize]
        public async Task SetUp()
        {
            _httpClient = _testHostFixture.Client;
        }

     

    }
}