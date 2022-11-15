using DataCommunicator.Pocos;
namespace DataCommunicator.ILoginServices
{
    public interface ILoginTokenFactory
    {
        public ILoginToken<T> GenerateToken<T>(T user) where T : IUserResource;
    }
}
