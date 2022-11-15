using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace Sharat.Utilities
{
    
    [Serializable]
    internal class AspValidationException : Exception
    {
        public int StatusCode { get; set; }
        public AspValidationException()
        {
        }

        public AspValidationException(string msg, int statusCode) : base(msg)
        {
           
            StatusCode = statusCode;
        }

        public AspValidationException(string message, Exception innerException) : base(message, innerException)
        {
        }
        protected AspValidationException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}
