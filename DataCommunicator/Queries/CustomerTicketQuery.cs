using System;


namespace DataCommunicator.Queries
{
    public class CustomerTicketQuery
    {
        public CustomerTicketQuery( long? allowedCustomerId, DateTime? minDepartTime, DateTime? maxDepartTime)
        {
            CustomerId = allowedCustomerId;
            MinDepartTime = minDepartTime;
            MaxDepartTime = maxDepartTime;
        }
        public long? CustomerId { get; set; }
        public DateTime? MinDepartTime { get; set; }
        public DateTime? MaxDepartTime { get; set; }
    }
}
