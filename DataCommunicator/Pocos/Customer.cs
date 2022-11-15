using System;


namespace DataCommunicator.Pocos
{
    public class Customer : IUserResource
    {
        public long? Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string PhoneNo { get; set; }
        public string Credit_Card_No { get; set; }
        public string ImgLink { get; set; }
        //false for Female, True for Male
        public Boolean? Gender { get; set; }
        public int? Points { get; set; }
        public string ImgByteArr { get; set; }
        public User UserFk { get; set; }      
        public Customer(long? id, string firstname, string lastname, string address, string phoneno,
           string credit_card, Boolean? gender, int? points,string imgLink, User userfk)
        {
            Id = id;
            FirstName = firstname;
            LastName = lastname;
            Address = address;
            PhoneNo = phoneno;
            Credit_Card_No = credit_card;
            Points = points;
            ImgLink = imgLink;
            Gender = gender;
            UserFk = userfk;
        }
        public Customer(long? id)
        {
            Id = id;
        }
       
        public Customer()
        {
            UserFk = new User();
        }
        public override string ToString()
        {
            return $"{Newtonsoft.Json.JsonConvert.SerializeObject(this)}";
        }
    }
}
