using DataCommunicator.Pocos;
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
    public class AirlineFacadeTester
    {
        // Shortcut Name for an important reference
        private ITestingTools tt;
        public AirlineFacadeTester()
        {
            tt = TestManager.TestingTools;
        }
        [TestInitialize]
        public void TestInit()
        {
            TestManager.TestingTools.DbFunc.DataCleaner();
            TestManager.TestingTools.Data.AllGenerator(TestManager.Rows);
        }
        //Airline Facade 1
        [TestMethod]
        public void CreateFlightTester()
        {
            tt.DataInserter.InsertCountries(tt.Data.Countries);
            tt.DataInserter.InsertAirlineCompanies(tt.Data.Airlines);
            tt.Data.Flights.ForEach(flight =>
            {
                flight.Id = tt.AirlineFacade.CreateFlight(flight);
            });
            List<Flight> flightsFromDb = tt.DataGetter.GetAllFlights();
            tt.Data.Flights.ForEach(f =>
            {
                flightsFromDb.UniqueId(f.Id).TestingModifiedDeepEquals(f);
            });
        }
        //Airline Facade 2
        [TestMethod]
        public void RemoveFlightTester()
        {
            tt.DataInserter.InsertCountries(tt.Data.Countries);
            tt.DataInserter.InsertAirlineCompanies(tt.Data.Airlines);
            tt.DataInserter.InsertCustomers(tt.Data.Customers);
            tt.DataInserter.InsertFlights(tt.Data.Flights);
            tt.DataInserter.InsertTickets(tt.Data.Tickets);
            List<Flight> flightsFromDb;
            List<Ticket> ticketsFromDb;
            tt.Data.Flights.ForEach(flight =>
            {
                tt.AirlineFacade.RemoveFlight((long)flight.Id, (long)flight.AirlineCompanyFk.Id);
                flightsFromDb = tt.DataGetter.GetAllFlights();
                ticketsFromDb = tt.DataGetter.GetAllTickets();
                if (!flightsFromDb.All(f => f.Id != flight.Id))
                    throw new InternalTestFailureException($"flight with Id:{flight.Id} wasn't deleted properly");
                if(!ticketsFromDb.All(tickets => tickets.FlightFk.Id != flight.Id))
                    throw new InternalTestFailureException($"tickets of flight with Id:{flight.Id} weren't deleted properly");

            });
        }
        //Airline Facade 3
        [TestMethod]
        public void UpdateMyFlightTester()
        {
            tt.DataInserter.InsertCountries(tt.Data.Countries);
            tt.DataInserter.InsertAirlineCompanies(tt.Data.Airlines);
            tt.DataInserter.InsertFlights(tt.Data.Flights);
            List<Flight> updatedFlights = tt.DataGenerator.FlightsDataGenerator
                (
                tt.Data.Flights.Count,
                tt.Data.Consts.FlightsConsts,
                tt.Data.Countries,
                tt.Data.Airlines
                );
            int i = 0;
            updatedFlights.ForEach(f =>
            {
                f.RandomAllPropertyNullazation(20);
                f.Id = tt.Data.Flights[i].Id;
                f.AirlineCompanyFk = tt.Data.Flights[i].AirlineCompanyFk;
                i++;
            });
            i = 0;
            updatedFlights.ForEach(flight =>
            {
                tt.AirlineFacade.UpdateMyFlight(flight);
                tt.Data.Flights[i].OriginCountryFk = flight.OriginCountryFk is null ? tt.Data.Flights[i].OriginCountryFk : flight.OriginCountryFk;
                tt.Data.Flights[i].DestinationCountryFk = flight.DestinationCountryFk is null ? tt.Data.Flights[i].DestinationCountryFk : flight.DestinationCountryFk;
                tt.Data.Flights[i].DepartureTime = flight.DepartureTime is null ? tt.Data.Flights[i].DepartureTime : flight.DepartureTime;
                tt.Data.Flights[i].LandingTime = flight.LandingTime is null ? tt.Data.Flights[i].LandingTime : flight.LandingTime;
                tt.Data.Flights[i].RemainingTickets = flight.RemainingTickets is null ? tt.Data.Flights[i].RemainingTickets : flight.RemainingTickets;
                tt.Data.Flights[i].Price = flight.Price is null ? tt.Data.Flights[i].Price : flight.Price;
                i++;
            });
            List<Flight> flightFromDb = tt.DataGetter.GetAllFlights();
            tt.Data.Flights.ForEach(flight =>
            flightFromDb.UniqueId(flight.Id).TestingModifiedDeepEquals(flight));

        }
        //Airline Facade 4
        [TestMethod]
        public void GetAllTicketsByFlightTester()
        {
            tt.DataInserter.InsertCustomers(tt.Data.Customers);
            tt.DataInserter.InsertCountries(tt.Data.Countries);
            tt.DataInserter.InsertAirlineCompanies(tt.Data.Airlines);
            tt.DataInserter.InsertFlights(tt.Data.Flights);
            tt.DataInserter.InsertTickets(tt.Data.Tickets);
            List<Ticket> facadeResult;
            List<Ticket> actualResult;
            tt.Data.Flights.ForEach(flight =>
            {
                facadeResult = tt.AirlineFacade.GetAllTicketsByFlight((long)flight.Id, (long)flight.AirlineCompanyFk.Id);
                actualResult = tt.Data.Tickets.Where(ticket =>
                {
                    // were nulling the UserFk values becuase the facade is not suppose to return those values
                    // so we need to null those values here so the TestingModifiedDeepEquals works properly
                    ticket.CustomerFk.UserFk = null;
                    ticket.FlightFk.AirlineCompanyFk.UserFk = null;
                    return ticket.FlightFk.Id == flight.Id;
                }).ToList();
                actualResult.ForEach(t =>
                {
                    facadeResult.UniqueId(t.Id).TestingModifiedDeepEquals(t);
                });
            });
        }

        //Airline Facade 5
        [TestMethod]
        public void GetAirlineTester()
        {
            tt.DataInserter.InsertCountries(tt.Data.Countries);
            tt.DataInserter.InsertAirlineCompanies(tt.Data.Airlines);
            Airline facadeResult;
            tt.Data.Airlines.ForEach(airline =>
            {
                facadeResult = tt.AirlineFacade.GetAirline((long)airline.Id);
                facadeResult.TestingModifiedDeepEquals(airline);
            });

        }


        //Airline Facade 6
        [TestMethod]
        public void UpdateAirlineTester()
        {
            tt.DataInserter.InsertCountries(tt.Data.Countries);
            tt.DataInserter.InsertAirlineCompanies(tt.Data.Airlines);
            List<Airline> updatedAirlines = tt.DataGenerator.AirlinesDataGenerator
                (
                TestManager.Rows.AirlinesCount,
                TestManager.GeneratorConstants.AirlineConsts,
                tt.Data.Countries
                );
            int i = 0;
            updatedAirlines.ForEach(airline =>
            {
                airline.RandomAllPropertyNullazation(20);
                airline.UserFk.RandomAllPropertyNullazation(20);
                airline.Id = tt.Data.Airlines[i++].Id;
            });
            i = 0;
            updatedAirlines.ForEach(airline =>
            {
                tt.AirlineFacade.UpdateAirline(airline);
                tt.Data.Airlines[i].Name = airline.Name is null ? tt.Data.Airlines[i].Name : airline.Name;
                tt.Data.Airlines[i].CountryFk = airline.CountryFk is null ? tt.Data.Airlines[i].CountryFk : airline.CountryFk;
                tt.Data.Airlines[i].UserFk.Username = airline.UserFk.Username is null ? tt.Data.Airlines[i].UserFk.Username : airline.UserFk.Username;
                tt.Data.Airlines[i].UserFk.Password = airline.UserFk.Password is null ? tt.Data.Airlines[i].UserFk.Password : airline.UserFk.Password;
                tt.Data.Airlines[i].UserFk.Email = airline.UserFk.Email is null ? tt.Data.Airlines[i].UserFk.Email : airline.UserFk.Email;
                i++;
            });
            List<Airline> airlinesFromDb = tt.DataGetter.GetAllAirlines();

            tt.Data.Airlines.ForEach(airline =>
            {
                airlinesFromDb.UniqueId(airline.Id).TestingModifiedDeepEquals(airline);
            });          
        }


    }
}
