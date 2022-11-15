using System;


namespace DataCommunicator.Pocos
{
    public class Flight : IPoco
    {
        public long? Id { get; set; }
        public Airline AirlineCompanyFk { get; set; }
        public Country OriginCountryFk { get; set; }
        public Country DestinationCountryFk { get; set; }
        public DateTime? DepartureTime { get; set; }
        public DateTime? LandingTime { get; set; }
        public int? RemainingTickets { get; set; }
        public int? Price { get; set; }
        public Flight(long id, Airline airline, Country originCountry, Country Destinationcountry,
            DateTime? departureTime, DateTime? landingTime, int remainingtickets, int price)
        {
            Id = id;
            AirlineCompanyFk = airline;
            OriginCountryFk = originCountry;
            DestinationCountryFk = Destinationcountry;
            DepartureTime = departureTime;
            LandingTime = landingTime;
            RemainingTickets = remainingtickets;
            Price = price;
        }
        public Flight(long airlineId, long originCountryId, long DestinationcountryId,
            DateTime? departureTime, DateTime? landingTime, int remainingtickets, int price)
        {
         
            AirlineCompanyFk = new Airline(airlineId);
            OriginCountryFk = new Country(originCountryId);
            DestinationCountryFk = new Country(DestinationcountryId);
            DepartureTime = departureTime;
            LandingTime = landingTime;
            RemainingTickets = remainingtickets;
            Price = price;
        }       
        public Flight(long id)
        {
            Id = id;
        }      
        public Flight()
        {
            OriginCountryFk = new Country();
            DestinationCountryFk = new Country();
        }        
        public override string ToString()
        {
            return $"{Newtonsoft.Json.JsonConvert.SerializeObject(this)}";
        }

    }
}
