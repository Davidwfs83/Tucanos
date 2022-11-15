using System;
namespace DataCommunicator.Pocos
{
    public class Review : IPoco
    {
        public long? Id { get; set; }
        public string  Description { get; set; }
        public Airline AirlineFk { get; set; }
        public Customer CustomerFk { get; set; }
        public decimal Score { get; set; }
        public DateTime CreateAt { get; set; }
        public Review()
        {
            AirlineFk = new Airline();
            CustomerFk = new Customer();
        }
    }
}
