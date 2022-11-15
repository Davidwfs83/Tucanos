using DataCommunicator.Pocos;
using System;
using System.Collections.Generic;

namespace DataCommunicator.IDaos
{
    public interface IUserDao
    {
        public long Add(User input);
        public User Get(long Id);
        public List<User> GetAll();
        public long Remove(long Id);
        public Int64 Update(User user);

    }
}
