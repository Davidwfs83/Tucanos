using DataCommunicator.ILoginServices;
using DataCommunicator.Pocos;

namespace Pg_Sql_DataCommunicator.LoginServices
{
    internal class LoginTokenFactory : ILoginTokenFactory
    {
        public ILoginToken<T> GenerateToken<T>(T user) where T : IUserResource
        {
            return new LoginToken<T>(user);
        }
    }
}
