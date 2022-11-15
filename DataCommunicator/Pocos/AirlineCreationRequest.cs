

namespace DataCommunicator.Pocos
{
    public class AirlineCreationRequest
    {
        public AirlineCreationRequest(string companyName, long selectedCountry, string username, string password, string email, string companyDescription)
        {
            CompanyName = companyName;
            SelectedCountry = selectedCountry;
            Username = username;
            Password = password;
            Email = email;
            CompanyDescription = companyDescription;
        }
        public string CompanyName { get; set; }       
        public long SelectedCountry { get; set; }     
        public string Username { get; set; }      
        public string Password { get; set; }       
        public string Email { get; set; }       
        public string CompanyDescription { get; set; }       
    }
}
