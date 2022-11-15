using DataCommunicator;
using DataCommunicator.IConfiguration;
using DataCommunicator.IFacades;
using DataCommunicator.ILoginServices;
using Pg_Sql_DataCommunicator.Configuration;
using Pg_Sql_DataCommunicator.Facades;
using Pg_Sql_DataCommunicator.LoginServices;
using System.Runtime.CompilerServices;

namespace Sharat
{
    // This class Will be Made Singelton By the asp net dependecy injection mechanism
    public class FlightCenterSystem : IFlightCenterSystem
    {
        public IFacadeFactory FacadeFactory { get; set; }
        public ILoginService LoginService { get; set; }

        public FlightCenterSystem(FacadesCount facadesCount, DbInfo dbInfo)
        {
            PgsqlConfig.MainDbInfo = dbInfo;
            FacadeFactory = new FacadeFactory(facadesCount);
            LoginService = new LoginService();                      
        }
         
    }
}
