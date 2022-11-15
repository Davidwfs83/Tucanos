
namespace DataCommunicator.Pocos
{
    
    public class Country : IPoco
    {

        public long? Id { get; set; }
        public string Name { get; set; }
        public string ImgLink { get; set; }
        public byte[] ImageByteArr { get; set; }
        public int? Latitude { get; set; }
        public int? Longitude { get; set; }

        public Country(long? id, string name)
        {
            Id = id;
            Name = name;
        }
        public Country(long? id, string name, int? latitude, int? longitude)
        {
            Id = id;
            Name = name;
            Latitude = latitude;
            Longitude = longitude;
        }       
        public Country(string name, int? latitude, int? longitude)
        {
            Name = name;
            Latitude = latitude;
            Longitude = longitude;
        }       
        public Country(long? id, string name, string imgLink)
        {
            Id = id;
            Name = name;
            ImgLink = imgLink;  
        }
        public Country(long? id)
        {
            Id = id;
        }
        public Country(string name)
        {
            Name = name;
        }
        public Country(string name, string imgLink)
        {
            Name = name;
            ImgLink = imgLink;
        }
        public Country()
        {
        }
        public override string ToString()
        {
            return $"{Newtonsoft.Json.JsonConvert.SerializeObject(this)}";
        }
    }
}
