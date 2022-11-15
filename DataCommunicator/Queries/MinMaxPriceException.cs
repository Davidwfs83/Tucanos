using System;
using System.Runtime.Serialization;

namespace DataCommunicator.Queries
{
    [Serializable]
    internal class MinMaxPriceException : Exception
    {
        public MinMaxPriceException()
        {
        }
        public MinMaxPriceException(string message) : base(message)
        {
        }
        public MinMaxPriceException(string message, Exception innerException) : base(message, innerException)
        {
        }
        protected MinMaxPriceException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}