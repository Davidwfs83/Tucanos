

namespace DataCommunicator.Pocos
{
    //***************************
    // admin level 1: ( lowest)
    // (add/delete/update) customers table
    // (update) users table only users that belong to customers
    // (add/delete/remove) tickets table
    //admin level 2:
    //(add/delete/update) flights table
    //(add/delte/update) airlines table
    //admin level 3:
    // (add/delte/update) admins table only admins that are level lower than 3, obviously cannot create an admin level 3...
    // or update an existing admin to levle 3
    //(add/delete/update) countries table
    //admin level 4: (highest) (ONLY ONE ADMIN LEVEL 4 AND HE IS NOT LISTED IN THE DATABASE)
    //(add/delete/update) adminstrators table
    //****************************
    // each admin have all the capabilities that an admin at a lower level has (obviously) 
    public class Admin : IUserResource
    {
        public long? Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int? Level { get; set; }
        public string ImgLink { get; set; }
        public string ImgByteArr { get; set; }
        public User UserFk { get ; set; }
       
        public Admin(long? id, string firstName, string lastName, int? level, string imgLink, User userFk)
        {
            Id = id;
            FirstName = firstName;
            LastName = lastName;
            Level = level;
            UserFk = userFk;
            ImgLink = imgLink;
        }
        public Admin(long? id, string firstName, string lastName, int? level, User userFk)
        {
            Id = id;
            FirstName = firstName;
            LastName = lastName;
            Level = level;
            UserFk = userFk;
        }
        public Admin(string firstName, string lastName, int? level, User userFk)
        {
            FirstName = firstName;
            LastName = lastName;
            Level = level;
            UserFk = userFk;
        }
        public Admin()
        {
            UserFk = new User();
        }
    }
}
