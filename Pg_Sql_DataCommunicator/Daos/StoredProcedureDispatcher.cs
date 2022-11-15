using DataCommunicator.IDaos;
using Npgsql;
using Pg_Sql_DataCommunicator.Configuration;
using System;
using System.Collections.Generic;
using System.Net;

namespace Pg_Sql_DataCommunicator.Daos
{
    internal static class StoredProcedureDispatcher
    {
        private static HttpStatusCode calcStatusCode(string sqlStateStr)
        {
            // These are postgres's most common error codes according to the documentation
            // I could have included more options but i rathered keep it like for simplicity sake
            if (sqlStateStr == "23505")
                return HttpStatusCode.Conflict;
            else if (sqlStateStr == "02000")
                return HttpStatusCode.NotFound;
            else if (sqlStateStr == "28000")
                return HttpStatusCode.Unauthorized;
            else
                return HttpStatusCode.InternalServerError;
        }

        // Add Function for tables with no user_id therefore need to return only the id
        // Of the created row
        public static long AddFunc(string p_sp_name, NpgsqlParameter[] p_func_columnname_value_pair)
        {
            
            NpgsqlConnection cs = (NpgsqlConnection)MyConnectionPool.Instance.GetConnection();
            try
            {  
                NpgsqlCommand command = new NpgsqlCommand(p_sp_name, cs);
                command.CommandType = System.Data.CommandType.StoredProcedure;
                command.Parameters.AddRange(p_func_columnname_value_pair); 
                var reader = command.ExecuteReader();
                reader.Read();
                return (long)reader[$"{p_sp_name}"];
            }
            catch (PostgresException ex)
            {
                throw new DbExceptionModified(ex.MessageText, calcStatusCode(ex.SqlState));
            }
            finally
            {
                MyConnectionPool.Instance.ReturnConnection(cs);
            }

        }
        
        // Add for tables with more than one generated id, for example adding a customer
        // Generates both an customer id and a user id accordingly
        public static KeyValuePair<long,long> AddFunc(string p_sp_name, NpgsqlParameter[] p_func_columnname_value_pair, Tuple<string,string> result_columns_name)
        {
            NpgsqlConnection cs = (NpgsqlConnection)MyConnectionPool.Instance.GetConnection();
            try
            {
                NpgsqlCommand command = new NpgsqlCommand(p_sp_name, cs);
                command.CommandType = System.Data.CommandType.StoredProcedure;
                command.Parameters.AddRange(p_func_columnname_value_pair);
                var reader = command.ExecuteReader();
                reader.Read();
                return new KeyValuePair<long, long>((long)reader[$"{result_columns_name.Item1}"], (long)reader[$"{result_columns_name.Item2}"]);
            }
            catch(PostgresException ex)
            {
                throw new DbExceptionModified(ex.MessageText, calcStatusCode(ex.SqlState));
            }
            
            finally
            {
                MyConnectionPool.Instance.ReturnConnection(cs);
            }

        }
        public static Dictionary<string, object> GetFunc(string p_sp_name, NpgsqlParameter[] p_func_columnname_value_pair , string[] p_columns_name)
        {

            NpgsqlConnection cs = (NpgsqlConnection)MyConnectionPool.Instance.GetConnection();
            try
            {
                Dictionary<string, object> result = null;

                NpgsqlCommand command = new NpgsqlCommand(p_sp_name, cs);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                command.Parameters.AddRange(p_func_columnname_value_pair);

                var reader = command.ExecuteReader();
                if (reader.Read())
                {
                    result = new Dictionary<string, object>();
                    for (int i = 0; i < p_columns_name.Length; i++)
                    {
                        result.Add($"{p_columns_name[i]}", reader[$"{p_columns_name[i]}"]);                                           
                    }
                    return result;
                }
                return null;
            }
            catch (PostgresException ex)
            {
                throw new DbExceptionModified(ex.MessageText, calcStatusCode(ex.SqlState));
            }
            finally
            { 
                MyConnectionPool.Instance.ReturnConnection(cs);
            }            
        }

        public static List<Dictionary<string,object>> GetAllWithParams(string p_sp_name, string[] p_ReturnColumnName, NpgsqlParameter[] p_ProcedureArguments)
        {
            NpgsqlConnection cs = (NpgsqlConnection)MyConnectionPool.Instance.GetConnection();
            try
            {
                List<Dictionary<string, object>> result = new List<Dictionary<string, object>>();
                NpgsqlCommand command = new NpgsqlCommand(p_sp_name, cs);
                command.CommandType = System.Data.CommandType.StoredProcedure;
                if (!(p_ProcedureArguments is null))
                {
                    command.Parameters.AddRange(p_ProcedureArguments);
                }
                var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    Dictionary<string, object> record = new Dictionary<string, object>();
                    for (int i = 0; i < p_ReturnColumnName.Length; i++)
                    {

                        record.Add(p_ReturnColumnName[i] , reader[$"{p_ReturnColumnName[i]}"] );
                    }
                    result.Add(record);
                }
                return result;
            }
            catch (PostgresException ex)
            {
                throw new DbExceptionModified(ex.MessageText, calcStatusCode(ex.SqlState));
            }
            finally
            {
                MyConnectionPool.Instance.ReturnConnection(cs);
            }
        }
        
        public static long RemoveItem(string p_sp_name, NpgsqlParameter[] p_func_columnname_value_pair)
        {
            NpgsqlConnection cs = (NpgsqlConnection)MyConnectionPool.Instance.GetConnection();
            try
            {
                NpgsqlCommand command = new NpgsqlCommand(p_sp_name, cs);
                command.CommandType = System.Data.CommandType.StoredProcedure;
                command.Parameters.AddRange(p_func_columnname_value_pair);
                var reader = command.ExecuteReader();
                reader.Read();
                return (long)reader[$"{p_sp_name}"];
            }
            catch (PostgresException ex)
            {
                throw new DbExceptionModified(ex.MessageText, calcStatusCode(ex.SqlState));
            }
            finally
            {
               MyConnectionPool.Instance.ReturnConnection(cs);
            }
        }
        public static long UpdateItem(string p_sp_name, NpgsqlParameter[] p_func_columnname_value_pair)
        {
            NpgsqlConnection cs = (NpgsqlConnection)MyConnectionPool.Instance.GetConnection();
            try
            {
                for (int i = 1; i < p_func_columnname_value_pair.Length; i++)
                {
                    if (p_func_columnname_value_pair[i].Value == null)
                    {
                        p_func_columnname_value_pair[i].Value = DBNull.Value;
                    }

                }
                NpgsqlCommand command = new NpgsqlCommand(p_sp_name, cs);
                command.CommandType = System.Data.CommandType.StoredProcedure;
                command.Parameters.AddRange(p_func_columnname_value_pair);
                var reader = command.ExecuteReader();
                reader.Read();
                return (long)reader[$"{p_sp_name}"];
            }
            catch (PostgresException ex)
            {
                throw new DbExceptionModified(ex.MessageText, calcStatusCode(ex.SqlState));
            }
            finally
            {
                MyConnectionPool.Instance.ReturnConnection(cs);
            }
        }
        public static KeyValuePair<long, string> RemoveTicket(NpgsqlParameter[] p_func_columnname_value_pair)
        {
            NpgsqlConnection cs = (NpgsqlConnection)MyConnectionPool.Instance.GetConnection();
            try
            {
                NpgsqlCommand command = new NpgsqlCommand("removeticket", cs);
                command.CommandType = System.Data.CommandType.StoredProcedure;
                command.Parameters.AddRange(p_func_columnname_value_pair);
                var reader = command.ExecuteReader();
                reader.Read();
                return new KeyValuePair<long, string>((long)reader["r_ticket_id"], (string)reader["r_stripe_id"]);
            }
            catch (PostgresException ex)
            {
                throw new DbExceptionModified(ex.MessageText, calcStatusCode(ex.SqlState));
            }
            finally
            {
                MyConnectionPool.Instance.ReturnConnection(cs);
            }
        }
    }
}
