

namespace DataCommunicator.Pocos
{
    public class Ticket : IPoco
    {
        public long? Id { get; set; }
        public Flight FlightFk { get; set; }
        public Customer CustomerFk { get; set; }
        public int? Cost { get; set; }
        public string StripeId { get; set; }       
        public Ticket(long flightfkId, long customerfkId, string stripeId)
        {

            FlightFk = new Flight(flightfkId);
            CustomerFk = new Customer(customerfkId);
            StripeId = stripeId;
        }      
        public Ticket(Flight flightfk, Customer customerfk)
        {
            FlightFk = flightfk;
            CustomerFk = customerfk;           
        }
        public Ticket()
        {
            FlightFk = new Flight();
            CustomerFk = new Customer();
        }
        public override string ToString()
        {
            return $"{Newtonsoft.Json.JsonConvert.SerializeObject(this)}";
        }
    }
}

