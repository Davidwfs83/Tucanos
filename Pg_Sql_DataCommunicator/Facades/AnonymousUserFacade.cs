using DataCommunicator.IFacades;
using DataCommunicator.Pocos;
using DataCommunicator.Queries;
using Pg_Sql_DataCommunicator.Daos;
using System;
using System.Collections.Generic;

namespace Pg_Sql_DataCommunicator.Facades
{
    internal class AnonymousUserFacade : FacadeBase, IAnonymousUserFacade
    {
        internal AnonymousUserFacade() : base(new AirlineDao(), new CountryDao(),
            new CustomerDao(), new AdminDao(), new FlightDao(), new TicketDao(), new ReviewDao())
        {
        }
        //Anon Facade 1
        public KeyValuePair<long, long> CreateCustomer(Customer customer)
        {
            return _customerDao.Add(customer);
        }
        //Anon Facade 2
        public void ForgotPassword()
        {
            throw new NotImplementedException();
        }
        //Anon Facade 3
        public List<Flight> GetAllFlights(FlightQuery query)
        {
            return _flightDao.GetAll(query);
        }
        //Anon Facade 4
        public List<Airline> GetAllAirlines()
        {
            return _airlineDao.GetAll(null);
        }
        //Anon Facade 5
        public List<Country> GetAllCountries(CountryQuery query)
        {
            return _countryDao.GetAll(query);
        }
        //Anon Facade 6
        public long RequestAirlineCreation(AirlineCreationRequest airlineRequest)
        {
            return _airlineDao.RequestAirlineCreation(airlineRequest);
        }
        //Anon Facade 7
        public List<Review> GetReviewsByAirline(long airlineId)
        {
            return _reviewDao.GetAllReviewsByAirline(airlineId);
        }
        //Anon Facade 8
        public Flight GetFlight(long flightId)
        {
            return _flightDao.Get(flightId);
        }
        //Anon Facade 9
        public Airline GetAirline(long airlineId)
        {
            return _airlineDao.Get(airlineId, null);
        }
        //Anon Facade 10
        public List<Review> ThreeRandomReviews()
        {
            return _reviewDao.GetRandomThreeReviews();
        }
    }
}
