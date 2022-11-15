using DataCommunicator.Pocos;
using DataCommunicator.Queries;
using System;
using System.Collections.Generic;

namespace DataCommunicator.IDaos
{
    public interface IAirlineDao 
    {
        public long RequestAirlineCreation(AirlineCreationRequest airlineRequest);
        public KeyValuePair<long, long> Add(Airline input);
        public Airline Get(long? Id, long? user_id);
        public List<Airline> GetAll(AirlineQuery query);
        public long Remove(long Id, long? adminId);
        public Int64 Update(Airline airlinecompany);
       
    }
}
