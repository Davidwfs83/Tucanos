

namespace DataCommunicator.Queries
{
    public class AirlineQuery
    {      
        public AirlineQuery()
        {
        }
        public string Name { get; set; }
        public long?[] AllowedCountriesId { get; set; }
    }
}
