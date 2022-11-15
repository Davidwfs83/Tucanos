

namespace DataCommunicator.Pocos
{

    public interface IUserResource : IPoco
    {       
        public User UserFk { get; set; }
        // Image Byte Array Converted To 64 Base string
        public string ImgByteArr { get; set; }
    }
}
