using DataCommunicator.Pocos;
using Npgsql;
using Pg_Sql_DataCommunicator.pg_sql_daos;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;

namespace TesterConsole
{
    class DataInserter
    {
        private static DataInserter INSTANCE;

        private static object key = new object();
        internal static DataInserter Instance
        {
            get
            {
                if (INSTANCE == null)
                {
                    lock (key)
                    {
                        if (INSTANCE == null)
                        {
                            // TODO: change this! should come from config file - the number of possible connections!
                            INSTANCE = new DataInserter();
                        }
                    }
                }
                return INSTANCE;
            }
        }
        private DataInserter()
        {

        }
        internal void InsertAll(List<Country> countries, List<AirlineCompany> airlines,
           List<Administrator> administrators, List<Customer> customers, List<Flight> flights,
           List<Ticket> tickets)
        {
            InsertCountries(countries);
            InsertAirlineCompanies(airlines);
            InsertAdminstrators(administrators);
            InsertCustomers(customers);
            InsertFlights(flights);
            InsertTickets(tickets);
        }
        internal void InsertCountries(List<Country> countries)
        {
            NpgsqlConnection cs = MyConnectionPool.Instance.GetConnection();
            try
            {
                string query = "insert into countries (\"name\") values";
                for (int i = 0; i < countries.Count; i++)
                {
                    query = query + $"('{countries[i].Name}'),";
                }
                // to delete the last ,
                query = query.Remove(query.Length - 1);
                query = query + "returning id;";
                NpgsqlCommand command = new NpgsqlCommand(query, cs);
                command.CommandType = System.Data.CommandType.Text;
                var reader = command.ExecuteReader();
                for (int i = 0; reader.Read() ; i++)
                {
                    countries[i].Id = (long)reader["id"];
                }  
            }
            finally
            {
                MyConnectionPool.Instance.ReturnConnection(cs);
            }
        }
        internal void InsertFlights(List<Flight> flights)
        {
            NpgsqlConnection cs = MyConnectionPool.Instance.GetConnection();
            try
            {
                string query = "insert into Flights (airlinecompany_id,origin_country_id,destination_country_id,departure_time,landing_time,remaining_tickets, price) values";
                for (int i = 0; i < flights.Count; i++)
                {
                    query = query + $"({flights[i].AirlineCompanyFk.Id},{flights[i].OriginCountryFk.Id},";
                    query = query + $"{flights[i].DestinationCountryFk.Id},'{flights[i].DepartureTime.ToString("G", CultureInfo.GetCultureInfo("es-ES"))}','{flights[i].LandingTime.ToString("G", CultureInfo.GetCultureInfo("es-ES"))}',";
                    query = query + $"{flights[i].RemainingTickets},{flights[i].Price} ),";
                }
                // to delete the last ,
                query = query.Remove(query.Length - 1);
                query = query + "returning id;";

                NpgsqlCommand command = new NpgsqlCommand(query, cs);
                command.CommandType = System.Data.CommandType.Text;

                var reader = command.ExecuteReader();
                for (int i = 0; reader.Read(); i++)
                {
                    flights[i].Id = (long)reader["id"];
                }

            }
            finally
            {
                MyConnectionPool.Instance.ReturnConnection(cs);
            }

        }
        internal void InsertAirlineCompanies(List<AirlineCompany> airlines)
        {
            List<User> users = new List<User>();
            airlines.ForEach(x =>
            {
                users.Add(x.UserFk);
            });
            InsertUsers(users);
            NpgsqlConnection cs = MyConnectionPool.Instance.GetConnection();
            try
            {
                string query = "insert into airline_companies (\"name\",country_id,user_id) values";
                for (int i = 0; i < airlines.Count; i++)
                {
                    query = query + $"('{airlines[i].Name}',{airlines[i].CountryFk.Id},{airlines[i].UserFk.Id}),";
                }
                // to delete the last ,
                query = query.Remove(query.Length - 1);
                query = query + "returning id;";

                NpgsqlCommand command = new NpgsqlCommand(query, cs);
                command.CommandType = System.Data.CommandType.Text;

                var reader = command.ExecuteReader();
                for (int i = 0; reader.Read(); i++)
                {
                    airlines[i].Id = (long)reader["id"];
                }
            }
            finally
            {
                MyConnectionPool.Instance.ReturnConnection(cs);
            }
        }
        internal void InsertTickets(List<Ticket> tickets)
        {
            NpgsqlConnection cs = MyConnectionPool.Instance.GetConnection();
            try
            {
                string query = "insert into tickets(flight_id,customer_id,cost) values";
                for (int i = 0; i < tickets.Count; i++)
                {
                    query = query + $"({tickets[i].FlightFk.Id},{tickets[i].CustomerFk.Id}, {tickets[i].Cost}),";
                }
                // to delete the last ,
                query = query.Remove(query.Length - 1);
                query = query + "returning id;";

                NpgsqlCommand command = new NpgsqlCommand(query, cs);
                command.CommandType = System.Data.CommandType.Text;

                var reader = command.ExecuteReader();
                for (int i = 0; reader.Read(); i++)
                {
                    tickets[i].Id = (long)reader["id"];
                }
            }
            finally
            {
                MyConnectionPool.Instance.ReturnConnection(cs);
            }
        }
        internal void InsertCustomers(List<Customer> customers)
        {
            List<User> users = new List<User>();
            customers.ForEach(x =>
            {
                users.Add(x.UserFk);
            });
            InsertUsers(users);
            NpgsqlConnection cs = MyConnectionPool.Instance.GetConnection();
            try
            {
                string query = "insert into customers (first_name,last_name,address,phone_no,credit_card_no,user_id,gender,points) values";
                for (int i = 0; i < customers.Count; i++)
                {
                    query = query + $"('{customers[i].FirstName}','{customers[i].LastName}',";
                    query = query + $"'{customers[i].Address}','{customers[i].PhoneNo}','{customers[i].Credit_Card_No}',{customers[i].UserFk.Id},";
                    query = query + $"{customers[i].Gender.ToString()},'{customers[i].Points}'),";
                }
                // to delete the last ,
                query = query.Remove(query.Length - 1);
                query = query + "returning id;";

                NpgsqlCommand command = new NpgsqlCommand(query, cs);
                command.CommandType = System.Data.CommandType.Text;

                var reader = command.ExecuteReader();
                for (int i = 0; reader.Read(); i++)
                {
                    customers[i].Id = (long)reader["id"];
                }
            }
            finally
            {
                MyConnectionPool.Instance.ReturnConnection(cs);
            }

        }
        private void InsertUsers(List<User> users)
        {
            NpgsqlConnection cs = MyConnectionPool.Instance.GetConnection();
            try
            {
                string query = "insert into users (username,\"password\",email,user_role) values";
                for (int i = 0; i < users.Count; i++)
                {
                    query = query + $"('{users[i].Username}','{users[i].Password}',";
                    query = query + $"'{users[i].Email}',{users[i].UserRoleFk.Id}),";

                }
                // to delete the last ,
                query = query.Remove(query.Length - 1);
                query = query + "returning id;";

                NpgsqlCommand command = new NpgsqlCommand(query, cs);
                command.CommandType = System.Data.CommandType.Text;

                var reader = command.ExecuteReader();
                for (int i = 0; reader.Read(); i++)
                {
                    users[i].Id = (long)reader["id"];
                }
            }
            finally
            {
                MyConnectionPool.Instance.ReturnConnection(cs);
            }

        }
        internal void InsertAdminstrators(List<Administrator> administrators)
        {
            List<User> users = new List<User>();
            administrators.ForEach(x =>
            {
                users.Add(x.UserFk);
            });
            InsertUsers(users);
            NpgsqlConnection cs = MyConnectionPool.Instance.GetConnection();
            try
            {
                string query = "insert into adminstrators (first_name,last_name,\"level\",user_id) values";
                for (int i = 0; i < administrators.Count; i++)
                {
                    query = query + $"('{administrators[i].FirstName}','{administrators[i].LastName}',";
                    query = query + $"{administrators[i].Level},{administrators[i].UserFk.Id}),";

                }
                // to delete the last ,
                query = query.Remove(query.Length - 1);
                query = query + "returning id;";

                NpgsqlCommand command = new NpgsqlCommand(query, cs);
                command.CommandType = System.Data.CommandType.Text;
                var reader = command.ExecuteReader();
                for (int i = 0; reader.Read(); i++)
                {
                    administrators[i].Id = (long)reader["id"];
                }
            }
            finally
            {
                MyConnectionPool.Instance.ReturnConnection(cs);
            }

        }
        //The Userrole table data is supposed to always remain constant and since the DatabaseCleaner
        //Method will clean the Userrole table aswell we need to populate it
        internal bool UserRolePopulation()
        {
            NpgsqlConnection cs = null;
            try
            {
                cs = MyConnectionPool.Instance.GetConnection();
                NpgsqlCommand command = new NpgsqlCommand("populateusersroles", cs);
                command.CommandType = System.Data.CommandType.StoredProcedure;
                var reader = command.ExecuteReader();
                if (reader.Read())
                {
                    return true;
                }

                return false;


                //}
            }

            finally
            {
                MyConnectionPool.Instance.ReturnConnection(cs);
            }
        }
    }
}
