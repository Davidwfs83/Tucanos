using System;
using System.Runtime.Serialization;

namespace DataCommunicator.Queries
{
    [Serializable]
    internal class DepartureLandingDatetimeException : Exception
    {
        public DepartureLandingDatetimeException()
        {
        }
        public DepartureLandingDatetimeException(string message) : base(message)
        {
        }
        public DepartureLandingDatetimeException(string message, Exception innerException) : base(message, innerException)
        {
        }
        protected DepartureLandingDatetimeException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}