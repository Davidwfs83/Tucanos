using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using Sharat;

namespace SharatTester

{
    /// <summary>
    /// Initializes the webHost
    /// </summary>
    public class TestHostFixture : IDisposable

    {
        public HttpClient Client { get; }
        // Http client used to send requests to the controller

        public IServiceProvider ServiceProvider { get; }
        // Service provider used to provide services registered in the API

        public TestHostFixture()
        {
            var builder = Program.CreateHostBuilder(null)
                .ConfigureWebHost(webHost =>
        // Configure the web host to use test server and test environment
        {
                    webHost.UseTestServer();
                    webHost.UseEnvironment("Test");
            // If we have different configuration file for the
            // test environment we will be able to check with with if statement
        });
            var host = builder.Start();
            ServiceProvider = host.Services;
            Client = host.GetTestClient();
        }

        public void Dispose()
        {
            Client.Dispose();
        }

    }
}