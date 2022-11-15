using DataCommunicator.Pocos;
using System.Collections.Generic;



namespace DataCommunicator.IFacades
{
    public interface ILoggedInCustomerFacade : IAnonymousUserFacade
    {
        //Customer Facade 1
        public long BuyTicket(Ticket ticket, int pointsToConsume);
        //Customer Facade 2
        public Customer GetCustomer(long customerId);
        //Customer Facade 3
        public List<Ticket> GetActiveTickets(long customerId);
        //Customer Facade 4
        public long UpdateCustomer(Customer customer);
        //Customer Facade 5
        public List<Ticket> GetTicketsHistory(long customerId);

        // Recives Ticket Id To Be Deleted Return The Ticket Id And The Stripe Id
        //Customer Facade 6
        public KeyValuePair<long, string> RemoveTicket(long ticketId, long customerId);
    }
}
