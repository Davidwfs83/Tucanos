using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace Sharat.Filters
{
    
    [Serializable]
    internal class AdminLevelUnAllowedException : Exception
    {
        public AdminLevelUnAllowedException()
        {
        }

        public AdminLevelUnAllowedException(string message) : base(message)
        {
        }

        public AdminLevelUnAllowedException(string message, Exception innerException) : base(message, innerException)
        {
        }

        protected AdminLevelUnAllowedException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}
