using System;
using System.Collections.Generic;
using System.Text;

namespace PGDataCommunicatorTester.Helpers
{
    internal class DoubleIdException : Exception
    {
        internal DoubleIdException()
        {

        }
        internal DoubleIdException(string message) : base(message)
        {

        }

        internal DoubleIdException(string message, Exception innerException) : base(message, innerException)
        {
        }

       
    }
}
