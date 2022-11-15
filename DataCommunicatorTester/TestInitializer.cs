using System;
using System.Collections.Generic;
using System.Text;

namespace DataCommunicatorTester
{
    class TestInitializer
    {
        private string p_pgdump_location;
        private string p_psql_location;
        private string p_pgdump_arguments;
        private string p_psql_arguments;
        private string p_dbpassword;
        internal string p_dbtesterconnstring;
        internal int p_connpoolcapacity;
        internal int p_numberofrowsintesterdb;

        internal List<Flight> p_flights;
        internal List<AirlineCompany> p_airlinecompany;
        internal List<Country> p_countries;
        internal List<Ticket> p_Tickets;
        internal List<Administrator> p_administrator;
        internal List<User> p_users;
        internal List<Customer> p_customers;

        internal TestInitializer()
        {
            p_flights = new List<Flight>();
            p_airlinecompany = new List<AirlineCompany>();
            p_countries = new List<Country>();
            p_Tickets = new List<Ticket>();
            p_administrator = new List<Administrator>();
            p_users = new List<User>();
            p_customers = new List<Customer>();

            ConfigfileReader();
            for (int i = 0; i < p_numberofrowsintesterdb; i++)
            {
                p_customers.Add(new Customer());
                p_flights.Add(new Flight());
                p_airlinecompany.Add(new AirlineCompany());
                p_countries.Add(new Country());
                p_Tickets.Add(new Ticket());
                p_administrator.Add(new Administrator());
                p_users.Add(new User());
            }
        }

        internal void TestDBInitializer()
        {
            FileInfo file = new FileInfo("d:\\Flight_DB\\DB_DUMPED.sql");
            file.Delete();
            SchemaDropper();
            PG_Dumper();
            PG_Psql();


            DataGetter();



        }

        private void SchemaDropper()
        {
            NpgsqlConnection cs = MyConnectionPool.Instance.GetConnection();

            NpgsqlCommand command = new NpgsqlCommand("drop schema if exists \"Flight_Project\" cascade;", cs);
            command.CommandType = System.Data.CommandType.Text;

            command.ExecuteNonQuery();

        }
        private void DataGetter()
        {

            List<int> customers_user_id = RandomDistinctIntlistGenerator(p_numberofrowsintesterdb);
            List<int> flights_airline_id = RandomIntlistGenerator(p_numberofrowsintesterdb);
            List<int> flights_origincountry_id = RandomIntlistGenerator(p_numberofrowsintesterdb);
            List<int> flights_destinationcountry_id = RandomIntlistGenerator(p_numberofrowsintesterdb);
            List<int> airline_country_id = RandomIntlistGenerator(p_numberofrowsintesterdb);
            List<int> airline_user_id = RandomDistinctIntlistGenerator(p_numberofrowsintesterdb);
            List<int> tickets_flight_id = RandomDistinctIntlistGenerator(p_numberofrowsintesterdb);
            List<int> tickets_customer_id = RandomDistinctIntlistGenerator(p_numberofrowsintesterdb);
            List<int> adminstrators_user_id = RandomDistinctIntlistGenerator(p_numberofrowsintesterdb);
            Random rnd = new Random();
            int i = 0;
            // data for customers, countries, users, flights, tickets, airline

            while (i < p_numberofrowsintesterdb)
            {


                string response = Httpgetrequest();
                response = response.Replace(@"'", "");
                JsonRoot jo = JsonConvert.DeserializeObject<JsonRoot>(response);
                if (p_airlinecompany.FirstOrDefault(x => x.Name == jo.results[0].location.city + jo.results[0].id.name) != null)
                {
                    continue;
                }
                if ((p_customers.FirstOrDefault(x => x.PhoneNo == jo.results[0].phone) != null) ||
                    (p_customers.FirstOrDefault(x => x.Credit_Card_No == jo.results[0].cell) != null))
                {
                    continue;
                }
                if ((p_users.FirstOrDefault(x => x.Email == jo.results[0].email) != null) ||
                    (p_users.FirstOrDefault(x => x.Password == jo.results[0].login.password) != null) ||
                    (p_users.FirstOrDefault(x => x.Username == jo.results[0].login.username) != null))
                {
                    continue;
                }





                p_customers[i].Id = i + 1;
                p_customers[i].FirstName = jo.results[0].name.first;
                p_customers[i].LastName = jo.results[0].name.last;
                p_customers[i].Adress = jo.results[0].location.street.name + Convert.ToString(jo.results[0].location.street.number);
                p_customers[i].PhoneNo = jo.results[0].phone;
                p_customers[i].Credit_Card_No = jo.results[0].cell;
                p_customers[i].UserIdUsersFk = new User { Id = customers_user_id[i] };


                p_users[i].Id = i + 1;
                p_users[i].Username = jo.results[0].login.username;
                p_users[i].Password = jo.results[0].login.password;
                p_users[i].Email = jo.results[0].email;
                p_users[i].UserRoleUsersRoleFk = new UserRole { Id = rnd.Next(1, 4) };
                p_flights[i].Id = i + 1;
                p_flights[i].AirlineCompanyIdAirlineCompaniesFk = new AirlineCompany { Id = flights_airline_id[i] };

                p_flights[i].OriginCountryIdCountriesFk = new Country { Id = flights_origincountry_id[i] };
                p_flights[i].DestinationCountryIdCountriesFk = new Country { Id = flights_destinationcountry_id[i] };
                p_flights[i].DepartureTime = new DateTime(rnd.Next(1900, 2021), rnd.Next(1, 12), rnd.Next(1, 28), rnd.Next(0, 24), rnd.Next(0, 60), rnd.Next(0, 60));
                p_flights[i].LandingTime = new DateTime(rnd.Next(1900, 2021), rnd.Next(1, 12), rnd.Next(1, 28), rnd.Next(0, 24), rnd.Next(0, 60), rnd.Next(0, 60));
                p_flights[i].RemainingTickets = rnd.Next(1, 35);
                p_airlinecompany[i].Id = i + 1;
                p_airlinecompany[i].Name = jo.results[0].location.city + jo.results[0].id.name;
                p_airlinecompany[i].CountryIdCountriesFk = new Country { Id = airline_country_id[i] };
                p_airlinecompany[i].UserIdUsersFk = new User { Id = airline_user_id[i] };
                p_Tickets[i].Id = i + 1;
                p_Tickets[i].FlightIdFlightFk = new Flight { Id = tickets_flight_id[i] };
                p_Tickets[i].CustomerIdCustomerFk = new Customer { Id = tickets_customer_id[i] };
                // in adminstrators we just interchange the last name to first and the first to last to save another api call
                p_administrator[i].Id = i + 1;
                p_administrator[i].FirstName = jo.results[0].name.last;
                p_administrator[i].LastName = jo.results[0].name.first;
                p_administrator[i].Level = rnd.Next(1, 4);
                p_administrator[i].UserIdUsersFk = new User { Id = adminstrators_user_id[i] };
                i++;

            }

            // the api barely returns 10 different country ( counting only the one with assci chars so only countries table 
            // we insert values manually
            string[] countries =  {"Texas", "LalaLand", "FuckPalestine", "Canada", "Denmark", "South Africa", "Jamaica", "Japan", "Tanzania", "Azeroth", "Outland",
            "Northrend", "Dorm", "The Iron Islands", "The Shire", "Mordor", "Rivendell", "Erabor", "Tanaris","Casterly Rock", "The Reach", "Orgrimmar","Stormwind"};
            List<int> whichCountryToAdd = RandomDistinctIntlistGenerator(countries.Length - 1);
            for (i = 0; i < p_numberofrowsintesterdb; i++)
            {
                p_countries[i] = (new Country { Id = i + 1, Name = countries[whichCountryToAdd[i]] });
            }



        }

        // return list of int the size and untill the param number for exampe if list_size == 10
        // possible output { 3,4,6,7,3,4,2,1,10,2}
        internal List<int> RandomIntlistGenerator(int list_size)
        {
            List<int> result = new List<int>();
            Random rnd = new Random();
            int i = 0;

            while (i < list_size)
            {
                int random = rnd.Next(1, list_size + 1);

                result.Add(random);
                i++;
            }

            return result;
        }
        internal List<int> RandomDistinctIntlistGenerator(int list_size)
        {
            List<int> result = new List<int>();
            Random rnd = new Random();
            int i = 0;

            while (i < list_size)
            {
                int random = rnd.Next(1, list_size + 1);
                if (result.Count == list_size)
                {
                    return result;
                }

                if (Convert.ToBoolean(result.Where(x => x == random).FirstOrDefault()))
                {

                    continue;
                }
                result.Add(random);
                i++;
            }

            return result;
        }
        private string Httpgetrequest()
        {
            string result = "";
            bool flag = false;
            do
            {

                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(@"https://randomuser.me/API");
                request.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;

                using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                using (Stream stream = response.GetResponseStream())
                using (StreamReader reader = new StreamReader(stream))
                {
                    result = reader.ReadToEnd();

                }
                for (int i = 0; i < result.Length; i++)
                {
                    char c = result[i];
                    if (c > 127)
                    {
                        flag = true;
                        break;
                    }
                    flag = false;
                }



            } while (flag);
            return result;






        }

        internal string RandomString(int length)
        {
            Random random = new Random();
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }
        internal void DatabaseCleaner()
        {


            NpgsqlConnection cs = MyConnectionPool.Instance.GetConnection();

            NpgsqlCommand command = new NpgsqlCommand("set search_path to \"Flight_Project\";" +
                "truncate  users , flights,tickets,customers,countries,airline_companies,adminstrators cascade;" +
                "ALTER SEQUENCE airline_companies_id_seq RESTART WITH 1;" +
                "ALTER SEQUENCE flights_id_seq RESTART WITH 1;" +
                "ALTER SEQUENCE tickets_id_seq RESTART WITH 1;" +
                "ALTER SEQUENCE customers_id_seq RESTART WITH 1;" +
                "ALTER SEQUENCE users_id_seq RESTART WITH 1;" +
                "ALTER SEQUENCE adminstrators_id_seq RESTART WITH 1;", cs);
            command.CommandType = System.Data.CommandType.Text;

            command.ExecuteNonQuery();

        }
        private void PG_Dumper()
        {
            string[] argumentsToCmd = { "cd " + $"{p_pgdump_location}", $"{p_pgdump_arguments}" };
            Process p = new Process();
            ProcessStartInfo info = new ProcessStartInfo();
            info.FileName = "cmd.exe";

            info.RedirectStandardInput = true;
            info.UseShellExecute = false;

            p.StartInfo = info;
            p.Start();

            using (StreamWriter sw = p.StandardInput)
            {
                int i = 0;
                while (sw.BaseStream.CanWrite && i <= 1)
                {
                    sw.WriteLine(argumentsToCmd[i]);
                    i++;

                }
            }
            p.WaitForExit();




        }
        private void PG_Psql()
        {
            string[] argumentsToCmd = { "cd " + $"{p_psql_location}", $"{p_psql_arguments}" };
            Process p = new Process();
            ProcessStartInfo info = new ProcessStartInfo();
            info.FileName = "cmd.exe";
            info.WindowStyle = ProcessWindowStyle.Hidden;
            info.RedirectStandardInput = true;
            info.UseShellExecute = false;

            p.StartInfo = info;
            p.Start();

            using (StreamWriter sw = p.StandardInput)
            {
                int i = 0;
                while (sw.BaseStream.CanWrite && i <= 1)
                {
                    sw.WriteLine(argumentsToCmd[i]);
                    i++;

                }
            }
            p.WaitForExit();



            //ProcessStartInfo start = new ProcessStartInfo();

            //start.Arguments = p_psql_arguments;
            //start.PasswordInClearText = p_dbpassword;
            //start.FileName = p_psql_location;

            //start.WindowStyle = ProcessWindowStyle.Hidden;
            //start.CreateNoWindow = true;
            //using (Process proc = Process.Start(start))
            //{
            //    proc.WaitForExit();
            //}

        }
        private void ConfigfileReader()
        {
            string content = System.IO.File.ReadAllText(@"C:\Users\USER\source\repos\FlightCenterSystem/ConfigMainFP.config.json");
            JObject m_configroot;
            JObject jo = (JObject)JsonConvert.DeserializeObject(content);
            m_configroot = (JObject)((JObject)jo["DBReplication"])["ToolsLocation"];
            p_pgdump_location = m_configroot["PGDumpLocation"].Value<string>();
            p_psql_location = m_configroot["PSQLLocation"].Value<string>();
            m_configroot = (JObject)((JObject)jo["DBReplication"])["ToolsArguments"];
            p_pgdump_arguments = m_configroot["PGDumpArguments"].Value<string>();
            p_psql_arguments = m_configroot["PSQLArguments"].Value<string>();
            m_configroot = ((JObject)jo["DBReplication"]);
            p_dbpassword = m_configroot["DatabasePassword"].Value<string>();
            m_configroot = ((JObject)jo["ConnectionStrings"]);
            p_dbtesterconnstring = m_configroot["TesterDBConnectionString"].Value<string>();
            m_configroot = ((JObject)jo["ConnectionPoolCapacity"]);
            p_connpoolcapacity = m_configroot["CapacityforTesting"].Value<int>();
            p_numberofrowsintesterdb = jo["NumberOfRowsInTesterDB"].Value<int>();





        }

    }
}
