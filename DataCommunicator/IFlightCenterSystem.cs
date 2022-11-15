using DataCommunicator.IConfiguration;
using DataCommunicator.IFacades;
using DataCommunicator.ILoginServices;

namespace DataCommunicator
{
    public interface IFlightCenterSystem
    {
        public IFacadeFactory FacadeFactory { get; set; }
        public ILoginService LoginService { get; set; }
    }
}
