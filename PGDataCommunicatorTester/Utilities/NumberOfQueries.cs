using System;
using System.Collections.Generic;
using System.Text;

namespace DataCommunicatorTester.Utilities
{
    internal struct NumberOfQueries
    {
        internal readonly int FlightQueries { get; }
        internal readonly int CustomerQueries { get; }
        internal readonly int AirlineQueries { get; }
        internal readonly int CountryQueries { get; }

        public NumberOfQueries(int flightQueries, int customerQueries, int airlineQueries, int countryQueries)
        {
            FlightQueries = flightQueries;
            CustomerQueries = customerQueries;
            AirlineQueries = airlineQueries;
            CountryQueries = countryQueries;
        }
    }
}
