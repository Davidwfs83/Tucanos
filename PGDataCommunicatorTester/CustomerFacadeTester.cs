//using DataCommunicator.Pocos;
//using DataCommunicator.ITesting;
//using DataCommunicatorTester.Utilities;
//using Microsoft.VisualStudio.TestTools.UnitTesting;
//using Npgsql;
//using PGDataCommunicatorTester.Helpers;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;

//namespace DataCommunicatorTester
//{
//    [TestClass]
//    public class CustomerFacadeTester
//    {
//        // Shortcut Name for an important reference
//        private ITestingTools tt;
//        public CustomerFacadeTester()
//        {
//            tt = TestManager.TestingTools;
//        }

//        [TestInitialize]
//        public void TestInit()
//        {
//            TestManager.TestingTools.DbFunc.DataCleaner();
//            TestManager.TestingTools.Data.AllGenerator(TestManager.Rows);
//        }

//        //Customer Facade 1
//        [TestMethod]
//        public void BuyTicketTester()
//        {
//            tt.DataInserter.InsertCountries(tt.Data.Countries);
//            tt.DataInserter.InsertAirlineCompanies(tt.Data.Airlines);
//            tt.DataInserter.InsertFlights(tt.Data.Flights);
//            tt.DataInserter.InsertCustomers(tt.Data.Customers);            
//            tt.Data.Tickets.ForEach(ticket =>
//            {
//                // we limit the upper value of the consumed points to make sure the Not Enough points
//                // Db exception is not thrown since that exception will be checked in another test
//                int pointsToConsume = TestingUtilityShed.rnd.Next(0, (int)ticket.CustomerFk.Points / 2);
//                ticket.Id = tt.CustomerFacade.BuyTicket(ticket, pointsToConsume);
//                int? consumedPoints = pointsToConsume >= ticket.FlightFk.Price ? ticket.FlightFk.Price : pointsToConsume;
//                ticket.Cost = ticket.FlightFk.Price - consumedPoints;
//                ticket.CustomerFk.Points -= consumedPoints;
//                ticket.FlightFk.RemainingTickets--;
//            });            
//            List<Ticket> dbTickets = tt.DataGetter.GetAllTickets();

//            tt.Data.Tickets.ForEach(ticket =>
//            {
//                dbTickets.UniqueId(ticket.Id).TestingModifiedDeepEquals(ticket);
//            });
//        }

//        //Customer Facade 2
//        [TestMethod]
//        public void GetCustomerTester()
//        {
//            tt.DataInserter.InsertCustomers(tt.Data.Customers);
//            Customer facadeResult;
//            tt.Data.Customers.ForEach(cus =>
//            {
//                facadeResult = tt.CustomerFacade.GetCustomer((long)cus.Id);
//                facadeResult.TestingModifiedDeepEquals(cus);
//            });
//        }
//        //Customer Facade 3
//        [TestMethod]
//        public void GetAllTicketsByCustomerTester()
//        {
//            tt.DataInserter.InsertCustomers(tt.Data.Customers);
//            tt.DataInserter.InsertCountries(tt.Data.Countries);
//            tt.DataInserter.InsertAirlineCompanies(tt.Data.Airlines);
//            tt.DataInserter.InsertFlights(tt.Data.Flights);
//            tt.DataInserter.InsertTickets(tt.Data.Tickets);
//            List<Ticket> facadeResult;
//            List<Ticket> actualResult;
//            tt.Data.Customers.ForEach(cus =>
//            {
//                facadeResult = tt.CustomerFacade.GetAllTicketsByCustomer((long)cus.Id);
//                actualResult = tt.Data.Tickets.Where(ticket => 
//                {
//                    // were nulling the UserFk values becuase the facade is not suppose to return those values
//                    // so we need to null those values here so the TestingModifiedDeepEquals works properly
//                    ticket.CustomerFk.UserFk = null;
//                    ticket.FlightFk.AirlineCompanyFk.UserFk = null;
//                    return ticket.CustomerFk.Id == cus.Id;
//                }).ToList();
//                actualResult.ForEach(t =>
//                {
//                    facadeResult.UniqueId(t.Id).TestingModifiedDeepEquals(t);
//                });
//            });
//        }
//        //Customer Facade 4
//        [TestMethod]
//        public void UpdateCustomerTester()
//        {
//            tt.DataInserter.InsertCustomers(tt.Data.Customers);
//            List<Customer> updatedCustomers = tt.DataGenerator.CustomersDataGenerator(
//                TestManager.Rows.CustomersCount
//                );
//            int i = 0;
//            updatedCustomers.ForEach(cus =>
//            {
//                cus.Id = tt.Data.Customers[i++].Id;
//                cus.RandomAllPropertyNullazation(20);
//                cus.UserFk.RandomAllPropertyNullazation(20);
//            });
//            i = 0;
//            updatedCustomers.ForEach(cus =>
//            {                                          
//                tt.CustomerFacade.UpdateCustomer(cus);
//                tt.Data.Customers[i].FirstName = cus.FirstName is null ? tt.Data.Customers[i].FirstName : cus.FirstName;
//                tt.Data.Customers[i].LastName = cus.LastName is null ? tt.Data.Customers[i].LastName : cus.LastName;
//                tt.Data.Customers[i].Address = cus.Address is null ? tt.Data.Customers[i].Address : cus.Address;
//                tt.Data.Customers[i].Credit_Card_No = cus.Credit_Card_No is null ? tt.Data.Customers[i].Credit_Card_No : cus.Credit_Card_No;
//                tt.Data.Customers[i].PhoneNo = cus.PhoneNo is null ? tt.Data.Customers[i].PhoneNo : cus.PhoneNo;
//                tt.Data.Customers[i].UserFk.Username = cus.UserFk.Username is null ? tt.Data.Customers[i].UserFk.Username : cus.UserFk.Username;
//                tt.Data.Customers[i].UserFk.Password = cus.UserFk.Password is null ? tt.Data.Customers[i].UserFk.Password : cus.UserFk.Password;
//                tt.Data.Customers[i].UserFk.Email = cus.UserFk.Email is null ? tt.Data.Customers[i].UserFk.Email : cus.UserFk.Email;
//                i++;
//            });
//            List<Customer> customersFromDb = tt.DataGetter.GetAllCustomers();
//            tt.Data.Customers.ForEach(cus =>
//            {
//                customersFromDb.UniqueId(cus.Id).TestingModifiedDeepEquals(cus);
//            });
//        }
//    }
//}
