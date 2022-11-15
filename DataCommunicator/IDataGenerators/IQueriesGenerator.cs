using DataCommunicator.Queries;
using System.Collections.Generic;


namespace DataCommunicator.IDataGenerators
{
    public interface IQueriesGenerator
    {
        public IAllDataGenerator QueriesData { get; set; }
        public List<FlightQuery> FlightQueryGenerator(int quantity);
        public List<CustomerQuery> CustomerQueryGenerator(int quantity);
        public List<AirlineQuery> AirlineQueryGenerator(int quantity);
        public List<CountryQuery> CountryQueryGenerator(int quantity);
    }
}
