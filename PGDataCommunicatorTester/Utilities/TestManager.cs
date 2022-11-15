//using DataCommunicator.IDataGenerators;
//using Newtonsoft.Json.Linq;
//using System;
//using System.Collections.Generic;
//using System.Runtime.CompilerServices;
//using System.Text;
//using DataCommunicator.ITesting;
//using Pg_Sql_DataCommunicator.Testing;
//using Newtonsoft.Json;
//using DataCommunicator.Pocos;
//using Pg_Sql_DataCommunicator.DataGenerators.Gibberish;
//using Pg_Sql_DataCommunicator.DataGenerators.Gibberish.GeneratorConstants;

//namespace DataCommunicatorTester.Utilities
//{
//    internal static class TestManager
//    {
//        private static JObject configFileJsonObject;
//        internal static GeneratorConsts GeneratorConstants { get; set; }
//        internal static RecordsCount Rows { get; set; }
//        internal static NumberOfQueries QueriesCount { get; set; }
//        internal static ITestingTools TestingTools { get; set; }
//        static TestManager()
//        {
//            configFileJsonObject = (JObject)JsonConvert.DeserializeObject(System.IO.File.ReadAllText(GetThisFilePath() + "UnitTest.config.json"));
//            TableRowsNumberConfigReader();
//            DataGeneratorConfigReader();
//            NumberOfQueriesConfigReader();
//            // THIS PART NEEDS TO BE LATER ON DEPENDECY INJECTED
//            TestingTools = new TestingTools(Rows, GeneratorConstants);
//        }
//        private static string GetThisFilePath([CallerFilePath] string path = null)
//        {
//            return path.Substring(0, path.LastIndexOf(@"\") + 1);
//        }
//        private static void TableRowsNumberConfigReader()
//        {
//            JObject root = (JObject)configFileJsonObject["NumberOfRows"];
//            Rows = new RecordsCount
//                (
//                root["NumberOfRowsCountriesTable"].Value<int>(),
//                root["NumberOfRowsFlightsTable"].Value<int>(),
//                root["NumberOfRowsTicketsTable"].Value<int>(),
//                root["NumberOfRowsAirlineTable"].Value<int>(),
//                root["NumberOfRowsCustomerTable"].Value<int>(),
//                root["NumberOfRowsAdminstratorsTable"].Value<int>()
//                );
//        }
//        private static void DataGeneratorConfigReader()
//        {
//            JObject root = (JObject)configFileJsonObject["DataGeneratorConstants"];
//            UserConsts userConsts = new UserConsts
//                      (
//                       ((JObject)root["UsersGenerator"])["UserNameLength"].Value<int>(),
//                       ((JObject)root["UsersGenerator"])["PassWordLength"].Value<int>(),
//                       ((JObject)root["UsersGenerator"])["EmailLength"].Value<int>()
//                      );
//            // for simplicity sake we assume the admin,airline and customer share the same
//            // user consts
//            GeneratorConstants = new GeneratorConsts
//                (
//                new AdminConsts
//                    (
//                      ((JObject)root["AdminsGenerator"])["FirstNameLength"].Value<int>(),
//                      ((JObject)root["AdminsGenerator"])["LastNameLength"].Value<int>(),
//                      userConsts
//                    ),
//                new AirlineConsts
//                    (
//                       ((JObject)root["AirlinesGenerator"])["AirlineNameLength"].Value<int>(),
//                       userConsts
//                    ),
//                new CountryConsts
//                    (
//                      ((JObject)root["CountriesGenerator"])["CountryNameLength"].Value<int>()
//                    ),
//                new CustomerConsts
//                    (
//                      ((JObject)root["CustomersGenerator"])["FirstNameLength"].Value<int>(),
//                      ((JObject)root["CustomersGenerator"])["LastNameLength"].Value<int>(),
//                      ((JObject)root["CustomersGenerator"])["AddressLength"].Value<int>(),
//                      ((JObject)root["CustomersGenerator"])["PhoneNumLength"].Value<int>(),
//                      ((JObject)root["CustomersGenerator"])["CreditCardLength"].Value<int>(),
//                      ((JObject)root["CustomersGenerator"])["MaxPoints"].Value<int>(),
//                      ((JObject)root["CustomersGenerator"])["MinPoints"].Value<int>(),
//                      userConsts
//                    ),
//                new FlightConsts
//                    (
//                      ((JObject)root["FlightsGenerator"])["DepartureDateMinYear"].Value<int>(),
//                      ((JObject)root["FlightsGenerator"])["DepartureDateMaxYear"].Value<int>(),
//                      ((JObject)root["FlightsGenerator"])["LandingDateMinYear"].Value<int>(),
//                      ((JObject)root["FlightsGenerator"])["LandingDateMaxYear"].Value<int>(),
//                      ((JObject)root["FlightsGenerator"])["MaxAviableTickets"].Value<int>(),
//                      ((JObject)root["FlightsGenerator"])["MinAviableTickets"].Value<int>(),
//                      ((JObject)root["FlightsGenerator"])["MaxPrice"].Value<int>()
//                    ),
//                new TicketConsts
//                    (
//                      ((JObject)root["TicketGenerator"])["CostMinValue"].Value<int>(),
//                      ((JObject)root["TicketGenerator"])["CostMaxValue"].Value<int>()
//                    )
                
//                );
//        }
//        private static void NumberOfQueriesConfigReader()
//        {
//            JObject root = (JObject)configFileJsonObject["NumberOfQueries"];
//            QueriesCount = new NumberOfQueries
//                (
//                root["FlightQuery"].Value<int>(),
//                root["CustomerQuery"].Value<int>(),
//                root["AirlineQuery"].Value<int>(),
//                root["CountryQuery"].Value<int>()
//                );
//        }
//    }
//}
