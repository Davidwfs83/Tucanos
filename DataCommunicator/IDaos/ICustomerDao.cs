using DataCommunicator.Pocos;
using DataCommunicator.Queries;
using System.Collections.Generic;

namespace DataCommunicator.IDaos
{
    public  interface ICustomerDao 
    {
        public KeyValuePair<long, long> Add(Customer input);
        public List<Customer> GetAll(CustomerQuery query);
        public Customer Get(long? Id, long? userId);
        public long Remove(long Id, long? adminId);
        public long Update(Customer customer);

    }
}
