using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace Sharat.Filters
{
    // An Exception Thrown When A Placebo User Requests An Action That May
    // Change The State Of The App
    [Serializable]
    internal class PlaceboUserException : Exception
    {
        public int StatusCode { get; set; }
        public PlaceboUserException()
        {
        }

        public PlaceboUserException(string message) : base(message)
        {
            
        }

        public PlaceboUserException(string message, Exception innerException) : base(message, innerException)
        {
        }

        protected PlaceboUserException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}
