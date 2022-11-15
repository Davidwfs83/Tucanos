using DataCommunicator.Pocos;
using DataCommunicator.Queries;
using System.Collections.Generic;

namespace DataCommunicator.IDaos
{
   public  interface ITicketDao
    {
        public long Add(Ticket input, int pointsToConsume);
        public Ticket Get(long Id);
        public List<Ticket> GetAllActiveTickets(long customerId);
        public List<Ticket> GetAllTicektsByFlight(FlightTicketQuery query);
        // Returns The Ticket Id And The Stripe Id
        public KeyValuePair<long, string> Remove(long Id, long customerId);
        public List<Ticket> GetAllTicketsHistory(long customerId);
        public long Update(Ticket ticket);


    }
}
