using DataCommunicator.IDaos;

namespace DataCommunicator.IFacades
{
    public abstract class FacadeBase
    {
        protected IAirlineDao _airlineDao;
        protected ICountryDao _countryDao;
        protected ICustomerDao _customerDao;
        protected IAdminDao _adminDao;
        protected IFlightDao _flightDao;
        protected ITicketDao _ticketDao;
        protected IReviewDao _reviewDao;
        protected FacadeBase(IAirlineDao airlineDAO, ICountryDao countryDAO, ICustomerDao customerDAO,
            IAdminDao adminDAO, IFlightDao flightDAO, ITicketDao ticketDAO, IReviewDao reviewDAO)
        {
            _airlineDao = airlineDAO;
            _countryDao = countryDAO;
            _customerDao = customerDAO;
            _adminDao = adminDAO;
            _flightDao = flightDAO;
            _ticketDao = ticketDAO;
            _reviewDao = reviewDAO;
        }
    }
}
