using DataCommunicator.Pocos;
using DataCommunicator.Queries;
using System.Collections.Generic;

namespace DataCommunicator.IDaos
{
    public interface IAdminDao
    {
        public KeyValuePair<long, long> Add(Admin input, long creatingAdminId);
        public Admin Get(long? adminId, long? adminUserId);
        public List<Admin> GetAll(AdminQuery query, long adminId);
        public long Remove(long Id, long removerId);
        public long Update(Admin updatedAdmin, long updaterId);
    }
}
