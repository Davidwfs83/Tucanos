using DataCommunicator.IConfiguration;
using System.Data.Common;

namespace DataCommunicator.IDaos
{
    public interface IMyConnectionPool
    {
        public DbInfo CurrentDbInfo { get; set; }
        public DbConnection GetConnection();
        public void SetConnStringPoolCapacity(DbInfo dbInfo);
        public void ReturnConnection(DbConnection conn);
    }
}
