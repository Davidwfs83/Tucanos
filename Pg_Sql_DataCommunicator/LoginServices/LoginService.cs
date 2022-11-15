using DataCommunicator.ILoginServices;
using DataCommunicator.Pocos;
using Npgsql;
using Pg_Sql_DataCommunicator.Daos;
using System.Collections;
using System.Collections.Generic;

namespace Pg_Sql_DataCommunicator.LoginServices
{
    internal class LoginService : ILoginService
    {
        private AirlineDao _airlineDAO;
        private CustomerDao _customerDAO;
        private AdminDao _adminDAO;
        public LoginService()
        {
            _customerDAO= new CustomerDao();
            _airlineDAO = new AirlineDao();
            _adminDAO = new AdminDao();
        }
        private User CheckUsernamePwdInDB(string username, string password)
        {
            NpgsqlConnection cs = (NpgsqlConnection)MyConnectionPool.Instance.GetConnection();
            try
            {
                List<ArrayList> list_arraylist_toresult = new List<ArrayList>();               
                NpgsqlCommand command = new NpgsqlCommand("trylogin", cs);
                command.CommandType = System.Data.CommandType.StoredProcedure;
                command.Parameters.AddRange(new NpgsqlParameter[] 
                { 
                new NpgsqlParameter("a_username", username),
                new NpgsqlParameter("a_password",password)
                });
                var reader = command.ExecuteReader();
                if (!reader.Read())
                {
                    throw new WrongCredentialsException($"Wrong Username or Password");
                }
                return new User((long)reader["r_user_id"], (UserRole)reader["r_user_role"]);
            }    
            
            finally
            {
                MyConnectionPool.Instance.ReturnConnection(cs);
            }
        }
        public bool TryLogin(string username, string password, out ILoginToken<IUserResource> token)
        {            
            User user = CheckUsernamePwdInDB(username, password);
            switch(user.UserRoleFk)
            {
                case UserRole.Customer:
                    {
                        token = new LoginToken<IUserResource>(_customerDAO.Get(null, user.Id));
                        return true;
                    }
                case UserRole.Airline:
                    {
                        token = new LoginToken<IUserResource>(_airlineDAO.Get(null, user.Id));
                        return true;
                    }
                case UserRole.Admin:
                    {
                        token = new LoginToken<IUserResource>(_adminDAO.Get(null, user.Id));
                        return true;
                    }
                default:
                    {
                        token = null;
                        return false;
                    }
            }    
        }
    }
}
