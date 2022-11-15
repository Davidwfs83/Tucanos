
namespace DataCommunicator.Pocos
{
    public struct RecordsCount
    {
        public long CountriesCount { get; set; }
        public long FlightsCount { get; set; }
        public long TicketsCount { get; set; }
        public long AirlinesCount { get; set; }
        public long CustomersCount { get; set; }
        public long AdminsCount { get; set; }
        public long ReviewsCount { get; set; }
        public long UsersCount { get; set; }
        public RecordsCount(long flights, long tickets, long airlines, long customers,long reviews)
        {           
            FlightsCount = flights;
            TicketsCount = tickets;
            AirlinesCount = airlines;
            CustomersCount = customers;
            CountriesCount = 0;
            AdminsCount = 0;
            UsersCount = 0;
            ReviewsCount = reviews;
        }        
        public bool IsEmpty()
        {
            return CountriesCount == 0 &&
                FlightsCount == 0 &&
                TicketsCount == 0 &&
                AirlinesCount == 0 &&
                CustomersCount == 0 &&
                AdminsCount == 0 &&
                ReviewsCount == 0;
        }
    }
}
