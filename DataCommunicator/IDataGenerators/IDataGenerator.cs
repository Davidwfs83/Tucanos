using DataCommunicator.Pocos;
using System.Collections.Generic;


namespace DataCommunicator.IDataGenerators
{
    public interface IDataGenerator
    {
        public List<Admin> AdminsDataGenerator(long quantity);
        public List<Flight> FlightsDataGenerator(long quantity);
        public List<Airline> AirlinesDataGenerator(long quantity);
        public List<Country> CountriesDataGenerator(long quantity);
        public List<Customer> CustomersDataGenerator(long quantity);
        public List<Ticket> TicketsDataGenerator(long quantity);
        public List<Review> ReviewsDataGenerator(long quantity);
    }
}
