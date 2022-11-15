using DataCommunicator.IFacades;
using DataCommunicator.Pocos;
using DataCommunicator.Queries;
using DataCommunicator.ITesting;
using DataCommunicatorTester.Utilities;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using PGDataCommunicatorTester.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataCommunicatorTester
{
    [TestClass]
    public class AnonFacadeTester
    {
        // Shortcut Name for an important reference
        ITestingTools tt;       
        public AnonFacadeTester()
        {
            tt = TestManager.TestingTools;
        }
        [AssemblyInitialize]
        public static void Init(TestContext testContext)
        {
            TestManager.TestingTools.ConnectionPool.SetConnStringPoolCapacity
                (
                  TestManager.TestingTools.TestingDb
                );
            TestManager.TestingTools.DbFunc.DbReplicator();
        }
        [TestInitialize]
        public void TestInit()
        {
            TestManager.TestingTools.DbFunc.DataCleaner();
            TestManager.TestingTools.Data.AllGenerator(TestManager.Rows);
        }

        //Anon Facade 1
        [TestMethod]
        public void AddCustomerTester()
        {
            Tuple<long,long> facadeResult;
            tt.Data.Customers.ForEach(x =>
            {
                facadeResult = tt.AnonFacade.CreateCustomer(x);
                x.Id = facadeResult.Item1;
                x.UserFk.Id = facadeResult.Item2;
            });
            List<Customer> dbCustomers = tt.DataGetter.GetAllCustomers();
            tt.Data.Customers.ForEach(customer =>
            {
                dbCustomers.UniqueId(customer.Id).TestingModifiedDeepEquals(customer);
            }); 
        }
        //Anon Facade 3
        [TestMethod]
        public void GetAllFlightsTester()
        {
            tt.DataInserter.InsertCountries(tt.Data.Countries);
            tt.DataInserter.InsertAirlineCompanies(tt.Data.Airlines);
            tt.DataInserter.InsertFlights(tt.Data.Flights);
            List<FlightQuery> flightQueries = tt.QueriesGenerator.FlightQueryGenerator(TestManager.QueriesCount.FlightQueries);
            flightQueries.ForEach(query =>
            {
                List<Flight> facadeResult = tt.AnonFacade.GetAllFlights(query);
                List<Flight> queriedFlights = tt.Data.Flights.Where(flight =>
                 (
                    ((query.MinPrice is null) || flight.Price >= query.MinPrice) &&
                    ((query.MaxPrice is null) || flight.Price <= query.MaxPrice) &&
                    ((query.AllowedAirlinesIds is null) || query.AllowedAirlinesIds.Any(id => flight.AirlineCompanyFk.Id == id)) &&
                    ((query.AllowedOriginCountriesIds is null) || query.AllowedOriginCountriesIds.Any(id => flight.OriginCountryFk.Id == id)) &&
                    ((query.AllowedDestinationCountriesIds is null) || query.AllowedDestinationCountriesIds.Any(id => flight.DestinationCountryFk.Id == id)) &&
                    ((query.DepartureTime is null) || flight.DepartureTime > query.DepartureTime) &&
                    ((query.LandingTime is null) || flight.LandingTime < query.LandingTime)
                 )
                ).ToList();
                queriedFlights.ForEach(x =>
                {
                    x.AirlineCompanyFk.UserFk = null;
                    facadeResult.UniqueId(x.Id).TestingModifiedDeepEquals(x);
                });

            });
        }
        //Anon Facade 4
        [TestMethod]
        public void GetAllAirlinesTester()
        {
            tt.DataInserter.InsertCountries(tt.Data.Countries);
            tt.DataInserter.InsertAirlineCompanies(tt.Data.Airlines);
            List<AirlineQuery> queries = tt.QueriesGenerator.AirlineQueryGenerator(TestManager.QueriesCount.AirlineQueries);
            List<Airline> facadeResult, actualResult;
            queries.ForEach(query =>
            {
                facadeResult = tt.AnonFacade.GetAllAirlines(query);
                actualResult = tt.Data.Airlines.Where(airline =>
                  (query.Name is null ? true : airline.Name.IsThisSubstringOfMine(query.Name)) &&
                  (query.AllowedCountriesId is null ? true : query.AllowedCountriesId.Contains(airline.CountryFk.Id))
                ).ToList();
                actualResult.ForEach(airline =>
                facadeResult.UniqueId(airline.Id).TestingModifiedDeepEquals(airline));
            });
        }

        //Anon Facade 5
        [TestMethod]
        public void GetAllCountriesTester()
        {
            tt.DataInserter.InsertCountries(tt.Data.Countries);
            tt.DataInserter.InsertAirlineCompanies(tt.Data.Airlines);
            List<CountryQuery> queries = tt.QueriesGenerator.CountryQueryGenerator(TestManager.QueriesCount.CountryQueries);
            List<Country> facadeResult, actualResult;
            queries.ForEach(query =>
            {
                facadeResult = tt.AnonFacade.GetAllCountries(query);
                actualResult = tt.Data.Countries.Where(country =>
                  country.Name.IsThisSubstringOfMine(query.Name)
                ).ToList();
                actualResult.ForEach(country =>
                facadeResult.UniqueId(country.Id).TestingModifiedDeepEquals(country));
            });
        }
        //Anon Facade 8
        [TestMethod]
        public void GetFlightTester()
        {
            tt.DataInserter.InsertCountries(tt.Data.Countries);
            tt.DataInserter.InsertAirlineCompanies(tt.Data.Airlines);
            tt.DataInserter.InsertFlights(tt.Data.Flights);
            Flight facadeResult;
            tt.Data.Flights.ForEach(flight =>
            {
                facadeResult = tt.AnonFacade.GetFlight((long)flight.Id);
                flight.AirlineCompanyFk.UserFk = null;
                flight.TestingModifiedDeepEquals(facadeResult);
            });
        }
    }
}


