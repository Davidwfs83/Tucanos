using DataCommunicator.IConfiguration;
using DataCommunicator.IDaos;
using Npgsql;
using Pg_Sql_DataCommunicator.Configuration;
using System.Collections.Generic;
using System.Data.Common;
using System.Threading;

namespace Pg_Sql_DataCommunicator.Daos
{

    internal class MyConnectionPool : IMyConnectionPool
    {
        public DbInfo CurrentDbInfo { get; set; }
        private Queue<DbConnection> m_connections;
        private int m_connpool_capacity = 50;
        private string conn_string;
        private static MyConnectionPool INSTANCE;
        private static object key = new object();
        public static MyConnectionPool Instance
        {
            get
            {
                if (INSTANCE == null)
                {
                    lock (key)
                    {
                        if (INSTANCE == null)
                        {
                            INSTANCE = new MyConnectionPool();
                        }
                    }
                }
                return INSTANCE;
            }
        }
        public void SetConnStringPoolCapacity(DbInfo dbInfo)
        {
            if (CurrentDbInfo == dbInfo) return;
            string connString = $"Host={dbInfo.Host};Username={dbInfo.Username};Password={dbInfo.Password};Database={dbInfo.DbName}";
            m_connections = new Queue<DbConnection>();
            for (int i = 0; i < dbInfo.ConnPoolCapacity; i++)
            {
                m_connections.Enqueue(new NpgsqlConnection(connString));
            }
        }
        private MyConnectionPool()
        {
            SetConnStringPoolCapacity(PgsqlConfig.MainDbInfo);
        }
        public DbConnection GetConnection()
        {
            lock (key)
            {
                while (m_connections.Count == 0)
                {
                    Monitor.Wait(key);
                }
                DbConnection result = m_connections.Dequeue();
                result.Open();
                return result;
            }
        }
        public void ReturnConnection(DbConnection conn)
        {
            lock (key)
            {
                conn?.Close();
                m_connections.Enqueue(conn);
                Monitor.Pulse(key);
            }
        }
    }


}
