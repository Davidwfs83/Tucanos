using System;
using System.Runtime.Serialization;

namespace Pg_Sql_DataCommunicator.DataGenerators.FreeApiOne
{
    
    [Serializable]
    internal class GeneratorApiDownException : Exception
    {
        
        public GeneratorApiDownException()
        {
        }

        public GeneratorApiDownException(string message) : base(message)
        {
        }

        public GeneratorApiDownException(string message, Exception innerException) : base(message, innerException)
        {
        }

        protected GeneratorApiDownException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}
