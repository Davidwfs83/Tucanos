using DataCommunicator.IDaos;
using DataCommunicator.Pocos;
using DataCommunicator.Queries;
using Npgsql;
using System;
using System.Collections.Generic;

namespace Pg_Sql_DataCommunicator.Daos
{
    internal class CustomerDao : ICustomerDao
    {
        internal CustomerDao()
        {
        }
        // add a customer and his user to the users table
        // returns a keyvalue pair which contains as its key the customer id and as it is value the user id
        public KeyValuePair<long, long> Add(Customer input)
        {
            NpgsqlParameter[] col_and_params = new NpgsqlParameter[] {
                new NpgsqlParameter("a_first_name", input.FirstName),
                new NpgsqlParameter("a_last_name", input.LastName),
                new NpgsqlParameter("a_adress", input.Address),
                new NpgsqlParameter("a_phone_no", input.PhoneNo),
                new NpgsqlParameter("a_credit_card_no", input.Credit_Card_No),
                new NpgsqlParameter("a_gender", input.Gender),
                new NpgsqlParameter("a_user_username", input.UserFk.Username),
                new NpgsqlParameter("a_user_password", input.UserFk.Password),
                new NpgsqlParameter("a_user_email", input.UserFk.Email),
                new NpgsqlParameter("a_imglink", (input.ImgLink is null) ? (object)DBNull.Value :  input.ImgLink)
            };
            return StoredProcedureDispatcher.AddFunc("addcustomer", col_and_params, new Tuple<string, string>("r_id", "r_user_id"));

        }
        public Customer Get(long? id, long? userId)
        {
            NpgsqlParameter[] col_and_params = new NpgsqlParameter[]
            {
                new NpgsqlParameter("a_customer_id", (id is null) ? (object)DBNull.Value :  id ) ,
                new NpgsqlParameter("a_user_id", (userId is null) ? (object)DBNull.Value : userId)
            };
            Dictionary<string, object> customer = StoredProcedureDispatcher.GetFunc("getcustomer", col_and_params,
                new string[] { "r_id", "r_firstname" , "r_lastname" , "r_address"
                , "r_phoneno", "r_credit_card","r_gender","r_points","r_user_id"
                , "r_user_username", "r_user_password", "r_user_email", "r_imglink"});
            if (customer is null)
            {
                return null;
            }
            Customer result = new Customer
            (
                 (long)customer["r_id"],
                 (string)customer["r_firstname"],
                 (string)customer["r_lastname"],
                 (string)customer["r_address"],
                 (string)customer["r_phoneno"],
                 (string)customer["r_credit_card"],
                 (bool)customer["r_gender"],
                 (int)customer["r_points"],
                 ((customer["r_imglink"]) == (object)DBNull.Value) ? null : (string)customer["r_imglink"],
                 new User
                (
                    (long)customer["r_user_id"],
                    (string)customer["r_user_username"],
                    (string)customer["r_user_password"],
                    (string)customer["r_user_email"],
                    UserRole.Customer
                )
            );
            return result;
        }
        public List<Customer> GetAll(CustomerQuery query)
        {
            NpgsqlParameter[] inputArguments = new NpgsqlParameter[] {
                new NpgsqlParameter("a_firstname", (query?.FirstName is null) ? (object)DBNull.Value :  query.FirstName ),
                new NpgsqlParameter("a_lastname", (query?.LastName is null) ? (object)DBNull.Value :  query.LastName),
                new NpgsqlParameter("a_address", (query?.Address is null) ? (object)DBNull.Value :  query.Address),
                new NpgsqlParameter("a_gender", (query?.Gender is null) ? (object)DBNull.Value :  query.Gender)
            };
            List<Dictionary<string, object>> AllCustomers = StoredProcedureDispatcher.GetAllWithParams("getallcustomers",
                new string[] { "r_id", "r_firstname", "r_lastname",
                    "r_address", "r_phone_no", "r_credit_card", "r_gender",
                    "r_points","r_user_id", "r_user_username","r_user_password",
                    "r_user_email", "r_imglink"}, inputArguments);
            List<Customer> Result = new List<Customer>();
            for (int i = 0; i < AllCustomers.Count; i++)
            {
                Customer currentCustomer = new Customer
                    (
                     (long)((AllCustomers[i])["r_id"]),
                     (string)((AllCustomers[i])["r_firstname"]),
                     (string)((AllCustomers[i])["r_lastname"]),
                     (string)((AllCustomers[i])["r_address"]),
                     (string)((AllCustomers[i])["r_phone_no"]),
                     (string)((AllCustomers[i])["r_credit_card"]),
                     (bool)((AllCustomers[i])["r_gender"]),
                     (int)((AllCustomers[i])["r_points"]),
                     ((AllCustomers[i])["r_imglink"]) == (object)DBNull.Value ? null : (string)((AllCustomers[i])["r_imglink"]),
                     new User
                     (
                         (long)((AllCustomers[i])["r_user_id"]),
                         (string)((AllCustomers[i])["r_user_username"]),
                         (string)((AllCustomers[i])["r_user_password"]),
                         (string)((AllCustomers[i])["r_user_email"]),
                         UserRole.Customer
                     )
                    );
                Result.Add(currentCustomer);
            }
            return Result;
        }
        public long Remove(long Id, long? adminId)
        {
            NpgsqlParameter[] func_params_id_tobe_removed = new NpgsqlParameter[]
            {
                new NpgsqlParameter("a_customer_id", Id),
                new NpgsqlParameter("a_admin_id", adminId)
            };
            return StoredProcedureDispatcher.RemoveItem("removecustomer", func_params_id_tobe_removed);
        }
        public long Update(Customer customer)
        {
            NpgsqlParameter[] col_and_params = new NpgsqlParameter[] { new NpgsqlParameter("a_customer_id", customer.Id),
                new NpgsqlParameter("a_customer_first_name",  customer.FirstName),
                new NpgsqlParameter("a_customer_last_name", customer.LastName),
                new NpgsqlParameter("a_customer_adress", customer.Address),
                new NpgsqlParameter("a_customer_phone_no", customer.PhoneNo),
                new NpgsqlParameter("a_customer_credit_card_no", customer.Credit_Card_No),
                new NpgsqlParameter("a_customer_gender", customer.Gender),
                new NpgsqlParameter("a_customer_points", customer.Points),
                new NpgsqlParameter("a_customer_user_username", customer.UserFk.Username),
                new NpgsqlParameter("a_customer_user_password", customer.UserFk.Password),
                new NpgsqlParameter("a_customer_user_email", customer.UserFk.Email),
                new NpgsqlParameter("a_imglink", (customer?.ImgLink is null) ? (object)DBNull.Value :  customer?.ImgLink )
            };
            return StoredProcedureDispatcher.UpdateItem("updatecustomer", col_and_params); ;
        }
    }
}
