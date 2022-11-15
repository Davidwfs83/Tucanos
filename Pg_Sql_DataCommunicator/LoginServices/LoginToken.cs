using DataCommunicator.ILoginServices;
using DataCommunicator.Pocos;

namespace Pg_Sql_DataCommunicator.LoginServices
{
    internal class LoginToken<T> : ILoginToken<T> where T : IUserResource
    {
        public T User { get; set; }
        public LoginToken(T user)
        {
            User = user;
        }
        public LoginToken()
        {

        }
    }
}
