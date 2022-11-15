

namespace DataCommunicator.IFacades
{
    public struct FacadesCount
    {
        public FacadesCount(short anonFacadeCount, short customerFacadeCount, short airlineFacadeCount, short adminFacadeCount)
        {
            AnonFacadeCount = anonFacadeCount;
            CustomerFacadeCount = customerFacadeCount;
            AirlineFacadeCount = airlineFacadeCount;
            AdminFacadeCount = adminFacadeCount;
        }

        public short AnonFacadeCount { get; set; }
        public short CustomerFacadeCount { get; set; }
        public short AirlineFacadeCount { get; set; }
        public short AdminFacadeCount { get; set; }      
    }
}
