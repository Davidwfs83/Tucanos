using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace Sharat.Utilities
{
    [Serializable]
    internal class UnParsableDateException : Exception
    {
        public UnParsableDateException()
        {
        }

        public UnParsableDateException(string message) : base(message)
        {
        }

        public UnParsableDateException(string message, Exception innerException) : base(message, innerException)
        {
        }

        protected UnParsableDateException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}
