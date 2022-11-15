

using DataCommunicator.IConfiguration;

namespace Pg_Sql_DataCommunicator.Configuration
{
    internal static class PgsqlConfig
    {
        internal static DbInfo MainDbInfo { get; set; }
        internal static DbInfo TesterDbInfo { get; set; }            
        static PgsqlConfig()
        {                                          
        }                
        
    }
}
