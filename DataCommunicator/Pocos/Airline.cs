

namespace DataCommunicator.Pocos
{
    
    public class Airline : IUserResource
    {
        public long? Id { get; set; }
        public string Name { get; set; }
        public Country CountryFk { get; set; }
        public string ImgLink { get; set; }
        public string ImgByteArr { get; set; }
        public User UserFk { get; set; }
        public decimal OverAllScore { get; set; }
        public Airline(long? id, string name, Country country, User userfk)
        {
            Id = id;
            Name = name;
            CountryFk = country;
            UserFk = userfk;
        }       
        public Airline(long? id, string name, Country country, User userfk, decimal overAllScore)
        {
            Id = id;
            Name = name;
            CountryFk = country;
            UserFk = userfk;
            OverAllScore = overAllScore;
        }
        public Airline(long? id)
        {
            Id = id;  
        }

        public Airline(long? id, string name,string imgLink, Country country, User userfk)
        {
            Id = id;
            Name = name;
            CountryFk = country;
            UserFk = userfk;
            ImgLink = imgLink;
        }       
        public Airline(long? id, string name, Country country)
        {
            Id = id;
            Name = name;
            CountryFk = country;
        }
        public Airline(string name, long countryId, User userfk)
        {
            Name = name;
            CountryFk = new Country(countryId);
            UserFk = userfk;
        }       
        public Airline()
        {
            CountryFk = new Country();
            UserFk = new User();
        }
        public override string ToString()
        {
            return $"{Newtonsoft.Json.JsonConvert.SerializeObject(this)}";
        }
    }
}
