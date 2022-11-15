using DataCommunicator.Pocos;

namespace DataCommunicator.ILoginServices
{
    public interface ILoginToken<T> where T : IUserResource
    {
       public T User { get; set; }
    }
}
