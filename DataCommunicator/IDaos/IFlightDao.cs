using DataCommunicator.Pocos;
using DataCommunicator.Queries;
using System.Collections.Generic;

namespace DataCommunicator.IDaos
{
    public interface IFlightDao 
    {
        public List<Flight> GetAll(FlightQuery query);
        public long Add(Flight input);
        public Flight Get(long Id);
        public long Remove(long flight_id ,long airline_id);
        public long Update(Flight flight);
    }
}
