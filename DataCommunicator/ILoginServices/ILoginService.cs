using DataCommunicator.Pocos;


namespace DataCommunicator.ILoginServices
{
    public interface ILoginService
    {
        public bool TryLogin(string username, string password, out ILoginToken<IUserResource> token);  
    }
}
