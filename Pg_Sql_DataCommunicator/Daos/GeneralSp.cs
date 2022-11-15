using DataCommunicator.Pocos;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pg_Sql_DataCommunicator.Daos
{
    // Speical Functionality Usually Aviable Only To The Main Admin
    internal static class GeneralSp
    {
        internal static RecordsCount WipeDatabase()
        {
            NpgsqlConnection cs = (NpgsqlConnection)MyConnectionPool.Instance.GetConnection();
            try
            {
                NpgsqlCommand command = new NpgsqlCommand("wipedata", cs);
                command.CommandType = System.Data.CommandType.StoredProcedure;               
                var reader = command.ExecuteReader();
                reader.Read();
                return new RecordsCount(
                    (long)reader["r_flights_count"],
                    (long)reader["r_tickets_count"],
                    (long)reader["r_airlines_count"],
                    (long)reader["r_customers_count"],
                    (long)reader["r_reviews_count"]
                    );
            }            
            finally
            {
                MyConnectionPool.Instance.ReturnConnection(cs);
            }

        }
    }
}
