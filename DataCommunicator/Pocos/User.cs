
namespace DataCommunicator.Pocos
{
    public class User : IPoco
    {
        public long? Id { get; set; }

        public string Username { get; set; }

        public string Password { get; set; }

        public string Email { get; set; }


        public UserRole? UserRoleFk { get; set; }

        public User(long id, string username, string password, string email, UserRole userole)
        {
            Id = id;
            Username = username;
            Password = password;
            Email = email;
            UserRoleFk = userole;
        }

        public User(long id, string username, string email, UserRole userole)
        {
            Id = id;
            Username = username;
            Email = email;
            UserRoleFk = userole;
        }
        public User(long id, UserRole userole)
        {
            Id = id;
            UserRoleFk = userole;
        }
        public User(long id)
        {
            Id = id;
        }
        public User(string username, string password, string email)
        {
            Username = username;
            Password = password;
            Email = email;
        }
        public User(string username, string email)
        {
            Username = username;
            Email = email;
        }
        public User()
        {

        }
        public override string ToString()
        {
            return $"{Newtonsoft.Json.JsonConvert.SerializeObject(this)}";
        }
    }
}
