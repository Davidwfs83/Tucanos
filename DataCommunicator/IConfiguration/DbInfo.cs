
namespace DataCommunicator.IConfiguration
{
    public class DbInfo
    {
        public DbInfo(string username, string password, string dbName, string host, string port, int connPoolCapacity)
        {
            Username = username;
            Password = password;
            DbName = dbName;
            Host = host;
            Port = port;
            ConnPoolCapacity = connPoolCapacity;
        }

        public string Username { get; set; }
        public string Password { get; set; }
        public string DbName { get; set; }
        public string Host { get; set; }
        public string Port { get; set; }
        public int ConnPoolCapacity { get; set; }
    }
}

