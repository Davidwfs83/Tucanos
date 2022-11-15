using System.Data.Common;
using System.Net;


namespace DataCommunicator.IDaos
{
    public class DbExceptionModified : DbException
    {        
        public DbExceptionModified(string message, HttpStatusCode errCode) : base(message)
        {
            statusCode = errCode;
        }
        public HttpStatusCode statusCode { get; set; }
    }
}
