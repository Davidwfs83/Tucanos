

namespace Sharat.Filters
{
    public class ApiResponseFormater<T>
    {
        public T Info { get; set; }
        public bool Succeeded { get; set; }
        public string Message { get; set; }
        public string Path { get; set; }
        public string Method { get; set; }
        public static ApiResponseFormater<T> Fail(string errorMessage)
        {
            return new ApiResponseFormater<T> { Succeeded = false, Message = errorMessage };
        }
        public static ApiResponseFormater<T> Success(T data, string path, string method)
        {
            return new ApiResponseFormater<T> { Succeeded = true, Info = data, Path = path, Method = method};
        }
    }
}
