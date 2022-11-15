using DataCommunicator.IDaos;
using DataCommunicator.IDataGenerators;
using DataCommunicator.Pocos;
using System;
using System.Collections.Generic;

namespace Pg_Sql_DataCommunicator.DataGenerators.FreeApiOne
{
    // This Api Will Allow Generation Of Customers, Airlines, Tickets And Flights
    internal class AllFreeApiOneGenerator : IAllDataGenerator
    {
        private IAdminDao adminDao;
        private IAirlineDao airlineDao;
        private ICountryDao countryDao;
        private ICustomerDao customerDao;
        private IFlightDao flightDao;
        private ITicketDao ticketDao;
        private IReviewDao reviewDao;
        private FreeApiOneGenerator innerGenerator;
        public AllFreeApiOneGenerator(IAdminDao AdminDao, IAirlineDao AirlineDao, ICountryDao CountryDao, ICustomerDao CustomerDao
            , IFlightDao FlightDao, ITicketDao TicketDao, IReviewDao ReviewDao)
        {
            adminDao = AdminDao;
            airlineDao = AirlineDao;
            countryDao = CountryDao;
            customerDao = CustomerDao;
            flightDao = FlightDao;
            ticketDao = TicketDao;
            reviewDao = ReviewDao;
            innerGenerator = new FreeApiOneGenerator();
            List<Country> currentCountries = countryDao.GetAll(null);
            currentCountries.ForEach(currentCountry => innerGenerator.currentCountriesId.Add((long)currentCountry.Id));
            List<Customer> currentCustomers = customerDao.GetAll(null);
            currentCustomers.ForEach(currentCustomer => innerGenerator.currentCustomersId.Add((long)currentCustomer.Id));
            List<Flight> currentFlights = flightDao.GetAll(null);
            currentFlights.ForEach(currentFlight => innerGenerator.currentFlightsId.Add((long)currentFlight.Id));
            List<Airline> currentAirlines = airlineDao.GetAll(null);
            currentAirlines.ForEach(currentAirline => innerGenerator.currentAirlinesId.Add((long)currentAirline.Id));
        }
        public override RecordsCount AllGenerator(RecordsCount recCount)
        {
            recCount.AdminsCount = 0;
            recCount.CountriesCount = 0;
            List<Customer> customers;
            List<Airline> airlines;
            List<Flight> flights;
            List<Ticket> tickets;
            List<Review> reviews;

            // We Allow Overall 5 iteration to try to insert the records
            for (int i = 0; i < 5 && !recCount.IsEmpty(); i++)
            {
                customers = innerGenerator.CustomersDataGenerator(recCount.CustomersCount);
                foreach (Customer customer in customers)
                {
                    try
                    {
                        innerGenerator.currentCustomersId.Add(customerDao.Add(customer).Key);
                        recCount.CustomersCount--;
                    }
                    catch (Exception ex)
                    {
                        continue;
                    }
                }
                airlines = innerGenerator.AirlinesDataGenerator(recCount.AirlinesCount);
                foreach (Airline airline in airlines)
                {
                    try
                    {
                        innerGenerator.currentAirlinesId.Add(airlineDao.Add(airline).Key);
                        recCount.AirlinesCount--;
                    }
                    catch (Exception ex)
                    {
                        continue;
                    }
                }
                reviews = innerGenerator.ReviewsDataGenerator(recCount.ReviewsCount);
                foreach (Review review in reviews)
                {
                    try
                    {
                        reviewDao.AddReview(review);
                        recCount.ReviewsCount--;
                    }
                    catch (Exception ex)
                    {
                        continue;
                    }
                }
                flights = innerGenerator.FlightsDataGenerator(recCount.FlightsCount);
                foreach (Flight flight in flights)
                {
                    try
                    {
                        innerGenerator.currentFlightsId.Add(flightDao.Add(flight));
                        recCount.FlightsCount--;
                    }
                    catch (Exception ex)
                    {
                        continue;
                    }
                }
                tickets = innerGenerator.TicketsDataGenerator(recCount.TicketsCount);
                foreach (Ticket ticket in tickets)
                {
                    try
                    {
                        ticketDao.Add(ticket, 0);
                        recCount.TicketsCount--;
                    }
                    catch (Exception ex)
                    {
                        continue;
                    }
                }
            }
            return recCount;
        }

        protected override void AllCleaner()
        {
            throw new NotImplementedException();
        }
    }
}
