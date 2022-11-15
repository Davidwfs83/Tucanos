using DataCommunicator.IFacades;
using DataCommunicator.Pocos;
using System.Collections.Generic;


namespace Pg_Sql_DataCommunicator.Facades
{
    internal class LoggedInCustomerFacade : AnonymousUserFacade, ILoggedInCustomerFacade
    {      
        public LoggedInCustomerFacade() 
        {         
        }
        //Customer Facade 1
        public long BuyTicket(Ticket ticket, int pointsToConsume)
        {
           return _ticketDao.Add(ticket, pointsToConsume);
        }
        //Customer Facade 2
        public Customer GetCustomer(long customerId)
        {
            return _customerDao.Get(customerId, null);
        }
        //Customer Facade 3
        public List<Ticket> GetActiveTickets(long customerId)
        {
            return _ticketDao.GetAllActiveTickets(customerId);
        }
        //Customer Facade 4
        public long UpdateCustomer(Customer customer)
        {
            // customers are not allowed to update their points or their gender thats only authorized for an admin
            customer.Points = null;
            customer.Gender = null;
            return _customerDao.Update(customer);
        }

        //Customer Facade 5
        public List<Ticket> GetTicketsHistory(long customerId)
        {
            return _ticketDao.GetAllTicketsHistory(customerId);
        }

        //Customer Facade 6
        public KeyValuePair<long, string> RemoveTicket(long ticketId,long customerId)
        {
            return _ticketDao.Remove(ticketId, customerId);
        }
    }
}
