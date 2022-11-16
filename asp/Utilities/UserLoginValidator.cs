using DataCommunicator.ILoginServices;
using System.ComponentModel.DataAnnotations;


namespace Sharat.Utilities
{
    public class UserLoginValidator : ValidationAttribute
    {
        private int minVal;
        private int maxVal;
        private string propertyName;
        public UserLoginValidator(int MinVal, int MaxVal, string PropName)
        {
            minVal = MinVal;
            maxVal = MaxVal;
            propertyName = PropName;
        }
        public override bool IsValid( object value)
        {
            string str = (string)value;
            if (str.Length == 0)
                throw new WrongCredentialsException($"{propertyName} Required!");
            if (str.Length < minVal)
                throw new WrongCredentialsException($"{propertyName} Needs To Be Min {minVal}!");
            if (maxVal < str.Length)
                throw new WrongCredentialsException($"{propertyName} Needs To Be Max {maxVal}!");
            return true;



        }
    }
}
