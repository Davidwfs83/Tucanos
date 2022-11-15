using DataCommunicator.Pocos;
using DataCommunicator.Queries;
using System;
using System.Collections.Generic;

namespace DataCommunicator.IDaos
{
    public interface ICountryDao 
    {
        public long Add(Country input);
        public Country Get(long Id);
        public List<Country> GetAll(CountryQuery query);
        public long Remove(long Id);
        public Int64 Update(Country country);

    }
}
