using System;


namespace DataCommunicator.Queries
{
    public class FlightQuery
    {
        private int? _minPrice;
        private int? _maxPrice;
        public long?[] AllowedAirlinesIds { get; set; }
        public int? MinPrice
        {
            get
            {
                return _minPrice;

            }
            set
            {
                if (!(_maxPrice is null) && _maxPrice < value)
                    throw new MinMaxPriceException($"you inserted a {value} Min Price thats greater than the current Max Price");
                _minPrice = value;
            }
        }
        public int? MaxPrice
        {
            get
            {
                return _maxPrice;

            }
            set
            {
                if (!(_minPrice is null) && value < _minPrice)
                    throw new MinMaxPriceException($"you inserted a {value} Max Price thats lower than the current Min Price");
                _maxPrice = value;
            }
        }
        public long?[] AllowedOriginCountriesIds { get; set; }
        public long?[] AllowedDestinationCountriesIds { get; set; }
        private DateTime? _departureTime;
        private DateTime? _landingTime;
        public DateTime? DepartureTime
        {
            get
            {
                return _departureTime;
            }
            set
            {
                if (!(_landingTime is null) && _landingTime <= value)
                    throw new DepartureLandingDatetimeException($"{value} Departure Time set is Greater than the current {_landingTime} Landing Time");
                _departureTime = value;
            }
        }
        public DateTime? LandingTime
        {
            get
            {
                return _landingTime;
            }
            set
            {
                if (!(_departureTime is null) && value < _departureTime)
                    throw new DepartureLandingDatetimeException($"{value} Landing Time set is Less than the current {_departureTime} Departure Time");
                _landingTime = value;
            }
        }
        public FlightQuery()
        {

        }
       
    }
}
