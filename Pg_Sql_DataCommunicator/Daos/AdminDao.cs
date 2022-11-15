using DataCommunicator.IDaos;
using DataCommunicator.Pocos;
using DataCommunicator.Queries;
using Npgsql;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;

namespace Pg_Sql_DataCommunicator.Daos
{
    
    public class AdminDao : IAdminDao 
    {
        internal AdminDao()
        {
        }
        public KeyValuePair<long, long> Add(Admin input, long creatingAdminId)
        {
            NpgsqlParameter[] params_to_sp = new NpgsqlParameter[] {
                new NpgsqlParameter("a_first_name", input.FirstName),
                new NpgsqlParameter("a_last_name", input.LastName),
                new NpgsqlParameter("a_level", input.Level),
                new NpgsqlParameter("a_user_username", input.UserFk.Username),
                new NpgsqlParameter("a_user_password", input.UserFk.Password),
                new NpgsqlParameter("a_user_email", input.UserFk.Email),
                new NpgsqlParameter("a_admin_id", creatingAdminId),
                new NpgsqlParameter("a_imglink", (input.ImgLink is null) ? (object)DBNull.Value :  input.ImgLink)
            };
            return StoredProcedureDispatcher.AddFunc("addadmin", params_to_sp, new Tuple<string,string>("r_id","r_user_id"));
        }
        public Admin Get(long? adminId, long? adminUserId)
        {
            NpgsqlParameter[] col_and_params = new NpgsqlParameter[] 
            {
                new NpgsqlParameter("a_admin_id", (adminId is null) ? (object)DBNull.Value :  adminId  ),
                new NpgsqlParameter("a_user_id", (adminUserId is null) ? (object)DBNull.Value :  adminUserId  ) 

            };
            Dictionary<string,object> admin = StoredProcedureDispatcher.GetFunc("getadmin", col_and_params,
                new string[] { "r_id", "r_firstname" , "r_lastname" , "r_level"
                , "r_user_id", "r_user_username", "r_user_email", "r_imglink"});
            if (admin is null)
            {
                return null;
            }
            Admin result = new Admin
            (
                (long)admin["r_id"],
                (string)admin["r_firstname"],
                (string)admin["r_lastname"],
                (int)admin["r_level"],
                admin["r_imglink"] == (object)DBNull.Value ? null : (string)admin["r_imglink"],
                new User( 
                (long)admin["r_user_id"],
                (string)admin["r_user_username"],
                (string)admin["r_user_email"],
                UserRole.Admin
                )   
            );
            return result;
        }
        public List<Admin> GetAll(AdminQuery query, long adminId)
        {            
            NpgsqlParameter[] inputArguments = new NpgsqlParameter[] {
                new NpgsqlParameter("a_firstname", (query?.FirstName is null) ? (object)DBNull.Value :  query.FirstName ),
                new NpgsqlParameter("a_lastname", (query?.LastName is null) ? (object)DBNull.Value :  query.LastName),
                new NpgsqlParameter("a_level", (query?.Level is null) ? (object)DBNull.Value :  query.Level),
                new NpgsqlParameter("a_executor_id", adminId )
            };
            List<Dictionary<string, object>> AllAdmins = StoredProcedureDispatcher.GetAllWithParams("getalladmins",
                new string[] { "r_id", "r_firstname", "r_lastname",
                    "r_level", "r_user_id", "r_user_username", "r_user_email", "r_imglink"}, inputArguments);
            List<Admin> Result = new List<Admin>();
            for (int i = 0; i < AllAdmins.Count; i++)
            {
                Admin p_adminstrator = new Admin
                    (
                    (long)((AllAdmins[i])["r_id"]),
                    (string)((AllAdmins[i])["r_firstname"]),
                    (string)((AllAdmins[i])["r_lastname"]),
                    (int)((AllAdmins[i])["r_level"]),
                    ((AllAdmins[i])["r_imglink"]) == (object)DBNull.Value ? null : (string)((AllAdmins[i])["r_imglink"]),
                    new User
                        (
                          (long)((AllAdmins[i])["r_user_id"]),
                          (string)((AllAdmins[i])["r_user_username"]),
                          (string)((AllAdmins[i])["r_user_email"]),
                          UserRole.Admin
                        )
                    );
                Result.Add(p_adminstrator);
            }
            return Result;
        }    
        public long Remove(long Id, long removerId)
        {
            NpgsqlParameter[] func_params_id_tobe_removed = new NpgsqlParameter[] {
                new NpgsqlParameter("a_id", Id),
                new NpgsqlParameter("a_exectuer_id", removerId)
            };
            return StoredProcedureDispatcher.RemoveItem("removeadmin", func_params_id_tobe_removed);
        }    
        public long Update(Admin updatedAdmin, long updaterId)
        {
            NpgsqlParameter[] col_and_params = new NpgsqlParameter[] {
                new NpgsqlParameter("a_id", (updatedAdmin.Id is null) ? (object)DBNull.Value :  updatedAdmin.Id ),
                new NpgsqlParameter("a_firstname",  (updatedAdmin.FirstName is null) ? (object)DBNull.Value :  updatedAdmin.FirstName ),
                new NpgsqlParameter("a_lastname", (updatedAdmin.LastName is null) ? (object)DBNull.Value :  updatedAdmin.LastName ),
                new NpgsqlParameter("a_level", (updatedAdmin.Level is null) ? (object)DBNull.Value :  updatedAdmin.Level ),
                new NpgsqlParameter("a_updating_admin_id", updaterId),
                new NpgsqlParameter("a_user_username", (updatedAdmin.UserFk.Username is null) ? (object)DBNull.Value :  updatedAdmin.UserFk.Username ),
                new NpgsqlParameter("a_user_password", (updatedAdmin.UserFk.Password is null) ? (object)DBNull.Value :  updatedAdmin.UserFk.Password ),
                new NpgsqlParameter("a_user_email", (updatedAdmin.UserFk.Email is null) ? (object)DBNull.Value :  updatedAdmin.UserFk.Email ),
                new NpgsqlParameter("a_imglink", (updatedAdmin?.ImgLink is null) ? (object)DBNull.Value :  updatedAdmin.ImgLink )
            };
            return StoredProcedureDispatcher.UpdateItem("updateadmin", col_and_params);
        }
    }
}
