using DataCommunicator.Pocos;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace TesterConsole
{

    // The Static part of the class is meant to be initialized once at the beggining of the assembly
    // and than serve as the default already initalized data, tests that wish to use data not structed
    // with the default number of rows parameter thats taken from the config file may create an instance
    // of this class in order to generate a more customized data
    // IMPORTANT DISTINCTION: all the data (pocos) generated in this class will be generated without an id
    // since we assume it is the database job to assign the id
    internal  class DataGenerator
    {
        private static int ps_numberofrowscountriestable;
        private static int ps_numberofrowsflightstable;
        private static int ps_numberofrowsticketstable;
        private static int ps_numberofrowsairlinetable;
        private static int ps_numberofrowscustomerstable;
        private static int ps_numberofrowsadminstable;
        private static int ps_numberofrowsuserstable;
        internal static List<Flight> ps_flights = new List<Flight>();
        internal static List<AirlineCompany> ps_airlinecompany = new List<AirlineCompany>();
        internal static List<Country> ps_countries = new List<Country>();
        internal static List<Ticket> ps_tickets = new List<Ticket>();
        internal static List<Administrator> ps_administrator = new List<Administrator>();
        internal static List<User> ps_users = new List<User>();
        internal static List<Customer> ps_customers = new List<Customer>();
               
        internal List<Flight> p_flights = new List<Flight>();
        internal List<AirlineCompany> p_airlinecompany = new List<AirlineCompany>();
        internal List<Country> p_countries = new List<Country>();
        internal List<Ticket> p_tickets = new List<Ticket>();
        internal List<Administrator> p_administrator = new List<Administrator>();
        internal List<User> p_users = new List<User>();
        internal List<Customer> p_customers = new List<Customer>();
        internal static Random rnd = new Random();
        
        
        

        internal  DataGenerator()
        {
           p_flights = new List<Flight>();
           p_airlinecompany = new List<AirlineCompany>();
           p_countries = new List<Country>();
           p_tickets = new List<Ticket>();
           p_administrator = new List<Administrator>();
           p_users = new List<User>();
           p_customers = new List<Customer>();          
        }
        static DataGenerator()
        {
            ps_flights = new List<Flight>();
            ps_airlinecompany = new List<AirlineCompany>();
            ps_countries = new List<Country>();
            ps_tickets = new List<Ticket>();
            ps_administrator = new List<Administrator>();
            ps_users = new List<User>();
            ps_customers = new List<Customer>();
            rnd = new Random();
            
            //TableRowsNumberConfigReader();
        }
        
        internal void AllDataGenerator(long numCountries, long numCustomers, long numAdmins,
            long numAirlines, long numFlights, long numTickets)
        {
            CountriesDataGenerator(numCountries);
            CustomerDataGenerator(numCustomers);
            AdminsDataGenerator(numAdmins);
            AirlinesDataGenerator(numAirlines);
            FlightsDataGenerator(numFlights);
            TicketsDataGenerator(numTickets);
        }

        internal static void SAllDataGenerator()
        {
            SCountriesDataGenerator();
            SCustomerDataGenerator();
            SAdminsDataGenerator();
            SAirlinesDataGenerator();
            SFlightsDataGenerator();
            STicketsDataGenerator();
        }

        internal static void SAllDataCleaner()
        {
            ps_flights = new List<Flight>();
            ps_airlinecompany = new List<AirlineCompany>();
            ps_countries = new List<Country>();
            ps_tickets = new List<Ticket>();
            ps_administrator = new List<Administrator>();
            ps_users = new List<User>();
            ps_customers = new List<Customer>();
        }

        private static void TableRowsNumberConfigReader()
        {
            // Just assinging the reference to get a shorter variable name
            JObject jo = TestingUtilityShed.configFileJsonObject;
            ps_numberofrowsflightstable = jo["NumberOfRowsFlightsTable"].Value<int>();
            ps_numberofrowsticketstable = jo["NumberOfRowsTicketsTable"].Value<int>();
            ps_numberofrowsairlinetable = jo["NumberOfRowsAirlineTable"].Value<int>();
            ps_numberofrowscustomerstable = jo["NumberOfRowsCustomerTable"].Value<int>();
            ps_numberofrowsadminstable = jo["NumberOfRowsAdminstratorsTable"].Value<int>();
            ps_numberofrowscountriestable = jo["NumberOfRowsCountriesTable"].Value<int>();
            ps_numberofrowsuserstable = ps_numberofrowscustomerstable + ps_numberofrowsuserstable + ps_numberofrowsadminstable;
        }
        private Stack<User> UsersDataGenerator(short userRole, long quantity)
        {
            List<string> uniqueUserName = new List<string>();
            List<string> uniquePassword = new List<string>();
            List<string> uniqueEmail = new List<string>();
            p_users.ForEach(x => {
                uniqueUserName.Add(x.Username);
                uniquePassword.Add(x.Password);
                uniqueEmail.Add(x.Email);
            });
            Stack<User> result = new Stack<User>();
            string userName;
            string passWord;
            string email;
            for (int i = 0; i < quantity; i++)
            {
                userName = TestingUtilityShed.RandomString(8);
                passWord = TestingUtilityShed.RandomNumbersString(7);
                email = TestingUtilityShed.RandomString(6);
                if (
                    uniqueUserName.Contains(userName) ||
                    uniquePassword.Contains(passWord) ||
                    uniqueEmail.Contains(email)
                    )
                {
                    i--;
                    continue;
                }
                uniqueUserName.Add(userName);
                uniquePassword.Add(passWord);
                uniqueEmail.Add(email);
                User user = new User
                            (
                              userName,
                              passWord,
                              email,
                              new UserRole
                                  (
                                    userRole
                                  )
                            );
                p_users.Add(user);
                result.Push(user);
                    
            }
            return result;
        }
        private static Stack<User> SUsersDataGenerator(short userRole, long quantity)
        {
            List<string> uniqueUserName = new List<string>();
            List<string> uniquePassword = new List<string>();
            List<string> uniqueEmail = new List<string>();
            ps_users.ForEach(x => {
                uniqueUserName.Add(x.Username);
                uniquePassword.Add(x.Password);
                uniqueEmail.Add(x.Email);
            });
            Stack<User> result = new Stack<User>();

            string userName;
            string passWord;
            string email;

            for (int i = 0; i < quantity; i++)
            {
                userName = TestingUtilityShed.RandomString(8);
                passWord = TestingUtilityShed.RandomNumbersString(7);
                email = TestingUtilityShed.RandomString(6);
                if (
                    uniqueUserName.Contains(userName) ||
                    uniquePassword.Contains(passWord) ||
                    uniqueEmail.Contains(email)
                    )
                {
                    i--;
                    continue;
                }
                uniqueUserName.Add(userName);
                uniquePassword.Add(passWord);
                uniqueEmail.Add(email);
                User user = new User
                            (
                              userName,
                              passWord,
                              email,
                              new UserRole
                                  (
                                     userRole
                                  )
                            );
                ps_users.Add(user);
                result.Push(user);
            }
            return result;
        }
        internal void AdminsDataGenerator(long quantity)
        {
            Stack<User> users = UsersDataGenerator(3, quantity);
            for (int i = 0; i < quantity; i++)
            {
                p_administrator.Add
                      (new Administrator
                          (
                            TestingUtilityShed.RandomString(8),
                            TestingUtilityShed.RandomString(7),
                            rnd.Next(1, 4),
                            users.Pop()
                          )
                      );
            }
        }
        internal static void SAdminsDataGenerator()
        {
            Stack<User> users = SUsersDataGenerator(3, ps_numberofrowsadminstable);
            for (int i = 0; i < ps_numberofrowsadminstable; i++)
            {
                ps_administrator.Add
                      (new Administrator
                          (
                            TestingUtilityShed.RandomString(8),
                            TestingUtilityShed.RandomString(7),
                            rnd.Next(1, 4),
                            users.Pop()
                          )
                      );
            }
        }
        // A Couple of Assumptions to obtain a certain level of simplicity
        // 1) all flights departure between the years 1948-1967 and land
        // and land at the years 1968- 1980
        internal void FlightsDataGenerator(long quantity)
        {
            for (int i = 0; i < quantity; i++)
            {
                p_flights.Add
                    (new Flight
                        (        
                          p_airlinecompany[rnd.Next(0, p_airlinecompany.Count)],
                          p_countries[rnd.Next(0, p_countries.Count)],
                          p_countries[rnd.Next(0, p_countries.Count)],
                          new DateTime(rnd.Next(1980, 2000), rnd.Next(1, 12), rnd.Next(1, 28), rnd.Next(0, 24), rnd.Next(0, 60), rnd.Next(0, 60)),
                          new DateTime(rnd.Next(2001, 2019), rnd.Next(1, 12), rnd.Next(1, 28), rnd.Next(0, 24), rnd.Next(0, 60), rnd.Next(0, 60)),
                          rnd.Next(1, 200),
                          rnd.Next(1, 300)
                        )
                    );
            }
        }
        internal static void SFlightsDataGenerator()
        {
            for (int i = 0; i < ps_numberofrowsflightstable; i++)
            {
                ps_flights.Add
                    (new Flight
                        (
                          ps_airlinecompany[rnd.Next(1, ps_airlinecompany.Count)],
                          ps_countries[rnd.Next(1, ps_countries.Count)],
                          ps_countries[rnd.Next(1, ps_countries.Count)],
                          new DateTime(rnd.Next(1980, 2000), rnd.Next(1, 12), rnd.Next(1, 28), rnd.Next(0, 24), rnd.Next(0, 60), rnd.Next(0, 60)),
                          new DateTime(rnd.Next(2001, 2020), rnd.Next(1, 12), rnd.Next(1, 28), rnd.Next(0, 24), rnd.Next(0, 60), rnd.Next(0, 60)),
                          rnd.Next(1, 200),
                          rnd.Next(1, 300)
                        )
                    );
            }
        }
        internal void AirlinesDataGenerator(long quantity)
        {
            List<string> uniqueAirlineName = new List<string>();
            string airlineName;
            p_airlinecompany.ForEach(x =>
            {
                uniqueAirlineName.Add(x.Name);
            });
            Stack<User> users = UsersDataGenerator(2, quantity);
            for (int i = 0; i < quantity; i++)
            {
                airlineName = TestingUtilityShed.RandomString(7);
                
                if (
                    uniqueAirlineName.Contains(airlineName)
                   )
                {
                    i--;
                    continue;
                }
                uniqueAirlineName.Add(airlineName);
                p_airlinecompany.Add
                    (new AirlineCompany
                                (                                  
                                  airlineName,
                                  p_countries[rnd.Next(1, p_countries.Count)],
                                  users.Pop()
                                )
                    );
            }
        }
        internal static void SAirlinesDataGenerator()
        {
            List<string> uniqueAirlineName = new List<string>();
            string airlineName;

            Stack<User> users = SUsersDataGenerator(2, ps_numberofrowsairlinetable);
            for (int i = 0; i < ps_numberofrowsairlinetable; i++)
            {
                airlineName = TestingUtilityShed.RandomString(7);
                if (
                    uniqueAirlineName.Contains(airlineName)
                   )
                {
                    i--;
                    continue;
                }
                uniqueAirlineName.Add(airlineName);
                ps_airlinecompany.Add
                    (new AirlineCompany
                                (
                                  airlineName,
                                  ps_countries[rnd.Next(1, ps_numberofrowscountriestable)],
                                  users.Pop()
                                )
                    );
            }
        }
        internal void CountriesDataGenerator(long quantity)
        {
            List<string> uniqueCountriesNames = new List<string>();
            p_countries.ForEach(x =>
            {
                uniqueCountriesNames.Add(x.Name);
            });
            string countryName;
            for (int i = 0; i < quantity; i++)
            {
                countryName = TestingUtilityShed.RandomString(8);

                if (
                    uniqueCountriesNames.Contains(countryName)
                   )
                {
                    i--;
                    continue;
                }
                uniqueCountriesNames.Add(countryName);
                p_countries.Add(new Country(countryName));
            }
        }
        internal static void SCountriesDataGenerator()
        {
            List<string> uniqueCountriesNames = new List<string>();
            string countryName;
            for (int i = 0; i < ps_numberofrowscountriestable; i++)
            {
                countryName = TestingUtilityShed.RandomString(8);

                if (
                    uniqueCountriesNames.Contains(countryName)
                   )
                {
                    i--;
                    continue;
                }
                uniqueCountriesNames.Add(countryName);
                ps_countries.Add(new Country(countryName));
            }
        }
        internal void CustomerDataGenerator(long quantity)
        {
            List<string> uniquePhoneNo = new List<string>();
            List<string> uniqueCreditCard = new List<string>();
            string phoneNo;
            string creditCard;
            Stack<User> users = UsersDataGenerator(1, quantity);
            for (int i = 0; i < quantity; i++)
            {
                phoneNo = TestingUtilityShed.RandomNumbersString(8);
                creditCard = TestingUtilityShed.RandomNumbersString(9);             
                if (uniquePhoneNo.Contains(phoneNo) ||
                    uniqueCreditCard.Contains(creditCard)
                    )
                {
                    i--;
                    continue;
                }
                uniquePhoneNo.Add(phoneNo);
                uniqueCreditCard.Add(creditCard);
                p_customers.Add
                    (new Customer
                       (
                            TestingUtilityShed.RandomString(7),
                            TestingUtilityShed.RandomString(7),
                            TestingUtilityShed.RandomString(7),
                            phoneNo,
                            creditCard,
                            i % 2 == 0 ? true : false,
                            rnd.Next(1, 300),
                            users.Pop()
                       )
                    ); ;
            }
        }
        internal static void SCustomerDataGenerator()
        {
            List<string> uniquePhoneNo = new List<string>();
            List<string> uniqueCreditCard = new List<string>();
            
            string phoneNo;
            string creditCard;
            Stack<User> users = SUsersDataGenerator(1, ps_numberofrowscustomerstable);
            for (int i = 0; i < ps_numberofrowscustomerstable; i++)
            {
                phoneNo = TestingUtilityShed.RandomNumbersString(8);
                creditCard = TestingUtilityShed.RandomNumbersString(9);
                if (uniquePhoneNo.Contains(phoneNo) ||
                    uniqueCreditCard.Contains(creditCard) 
                    )
                {
                    i--;
                    continue;
                }
                uniquePhoneNo.Add(phoneNo);
                uniqueCreditCard.Add(creditCard);
                ps_customers.Add
                    (new Customer
                       (
                            TestingUtilityShed.RandomString(7),
                            TestingUtilityShed.RandomString(7),
                            TestingUtilityShed.RandomString(7),
                            phoneNo,
                            creditCard,
                            i % 2 == 0 ? true : false,
                            rnd.Next(1, 300),
                            users.Pop()
                       )
                    ); ;
            }
        }
        internal void TicketsDataGenerator(long quantity)
        {

            int flightId;
            int customerId;
            for (int i = 0; i < quantity; i++)
            {
                flightId = rnd.Next(0, p_flights.Count);
                customerId = rnd.Next(0, p_customers.Count);
                p_tickets.Add
                    (new Ticket
                                (                                 
                                  p_flights[rnd.Next(0, p_flights.Count)],
                                  p_customers[rnd.Next(0, p_customers.Count)],
                                  rnd.Next(50,250)
                                )
                    );
            }
        }
        internal static void STicketsDataGenerator()
        {

            int flightId;
            int customerId;
            for (int i = 0; i < ps_numberofrowsticketstable; i++)
            {
                flightId = rnd.Next(1, ps_numberofrowsflightstable);
                customerId = rnd.Next(1, ps_numberofrowscustomerstable);
                ps_tickets.Add
                    (new Ticket
                                (
                                  ps_flights[rnd.Next(0, ps_numberofrowsflightstable)],
                                  ps_customers[rnd.Next(0, ps_numberofrowscustomerstable )],
                                  rnd.Next(50, 250)
                                )
                    );
            }
        }
    }
}
