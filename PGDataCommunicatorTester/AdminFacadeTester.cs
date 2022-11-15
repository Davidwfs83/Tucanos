using DataCommunicator.IDaos;
using DataCommunicator.Pocos;
using DataCommunicator.Queries;
using DataCommunicator.ITesting;
using DataCommunicatorTester.Utilities;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using PGDataCommunicatorTester.Helpers;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;

namespace DataCommunicatorTester
{
    [TestClass]
    public class AdminFacadeTester
    {
        // Shortcut Name for an important reference
        private ITestingTools tt;
        private Random rnd;
        public AdminFacadeTester()
        {
            tt = TestManager.TestingTools;
            rnd = new Random();
        }
        [TestInitialize]
        public void TestInit()
        {
            TestManager.TestingTools.DbFunc.DataCleaner();
            TestManager.TestingTools.Data.AllGenerator(TestManager.Rows);
        }

        //Admin Facade 1
        [TestMethod]
        public void GetAllCustomerTester()
        {
            tt.DataInserter.InsertCustomers(tt.Data.Customers);
            List<Customer> facadeResult, actualResult;
            List<CustomerQuery> queriesList = tt.QueriesGenerator.CustomerQueryGenerator(TestManager.QueriesCount.CustomerQueries);
            queriesList.ForEach(query =>
            {
                facadeResult = tt.AdminFacade.GetAllCustomers(query);
                actualResult =  tt.Data.Customers.Where(cus =>
                   (query.FirstName is null ? true : cus.FirstName.IsThisSubstringOfMine(query.FirstName) ) &&
                   (query.LastName is null ? true : cus.LastName.IsThisSubstringOfMine(query.LastName)) &&
                   (query.Address is null ? true : cus.Address.IsThisSubstringOfMine(query.Address)) &&
                   (query.Gender is null ? true : cus.Gender == query.Gender)
                ).ToList();
                actualResult.ForEach(cus =>
                facadeResult.UniqueId(cus.Id).TestingModifiedDeepEquals(cus)
                );
            });
        }

        //Admin Facade 2
        [TestMethod]
        public void UpdateCustomerTester()
        {
            tt.DataInserter.InsertCustomers(tt.Data.Customers);
            List<Customer> updatedCustomers = tt.DataGenerator.CustomersDataGenerator(
                TestManager.Rows.CustomersCount,
                TestManager.GeneratorConstants.CustomersConsts
                );
            int i = 0;
            updatedCustomers.ForEach(cus =>
            {
                cus.Id = tt.Data.Customers[i].Id;
                cus.RandomAllPropertyNullazation(20);
                cus.UserFk.RandomAllPropertyNullazation(20);
                i++;
            });
            i = 0;
            updatedCustomers.ForEach(cus =>
            {
                tt.AdminFacade.UpdateCustomer(cus);
                tt.Data.Customers[i].FirstName = cus.FirstName is null ? tt.Data.Customers[i].FirstName : cus.FirstName;
                tt.Data.Customers[i].LastName = cus.LastName is null ? tt.Data.Customers[i].LastName : cus.LastName;
                tt.Data.Customers[i].Address = cus.Address is null ? tt.Data.Customers[i].Address : cus.Address;
                tt.Data.Customers[i].Credit_Card_No = cus.Credit_Card_No is null ? tt.Data.Customers[i].Credit_Card_No : cus.Credit_Card_No;
                tt.Data.Customers[i].PhoneNo = cus.PhoneNo is null ? tt.Data.Customers[i].PhoneNo : cus.PhoneNo;
                tt.Data.Customers[i].Gender = cus.Gender is null ? tt.Data.Customers[i].Gender : cus.Gender;
                tt.Data.Customers[i].Points = cus.Points is null ? tt.Data.Customers[i].Points : cus.Points;
                tt.Data.Customers[i].UserFk.Username = cus.UserFk.Username is null ? tt.Data.Customers[i].UserFk.Username : cus.UserFk.Username;
                tt.Data.Customers[i].UserFk.Password = cus.UserFk.Password is null ? tt.Data.Customers[i].UserFk.Password : cus.UserFk.Password;
                tt.Data.Customers[i].UserFk.Email = cus.UserFk.Email is null ? tt.Data.Customers[i].UserFk.Email : cus.UserFk.Email;
                i++;
            });
            List<Customer> customersFromDb = tt.DataGetter.GetAllCustomers();
            tt.Data.Customers.ForEach(cus =>
            {
                customersFromDb.UniqueId(cus.Id).TestingModifiedDeepEquals(cus);
            });
        }
        //Admin Facade 3
        [TestMethod]
        public void RemoveCustomerTester()
        {
            tt.DataInserter.InsertCountries(tt.Data.Countries);
            tt.DataInserter.InsertAirlineCompanies(tt.Data.Airlines);
            tt.DataInserter.InsertFlights(tt.Data.Flights);
            tt.DataInserter.InsertCustomers(tt.Data.Customers);
            tt.DataInserter.InsertTickets(tt.Data.Tickets);
            tt.DataInserter.InsertAdminstrators(tt.Data.Admins);
            Admin randomAdmin;
            List<Customer> cusFromDb;
            List<Ticket> ticketFromDb;
            tt.Data.Customers.ForEach(customer =>
            {
                randomAdmin = tt.Data.Admins[rnd.Next(0, tt.Data.Admins.Count - 1)];
                try
                {
                    tt.AdminFacade.RemoveCustomer((long)customer.Id, (long)randomAdmin.Id);
                    cusFromDb = tt.DataGetter.GetAllCustomers();
                    ticketFromDb = tt.DataGetter.GetAllTickets();
                    if (!cusFromDb.All(cus => cus.Id != customer.Id))
                        throw new InternalTestFailureException($"customer with Id:{customer.Id} wasn't deleted properly");
                    if (!ticketFromDb.All(ticket => ticket.CustomerFk.Id != customer.Id))
                        throw new InternalTestFailureException($"tickets of customer with Id:{customer.Id} weren't deleted properly");
                }
                catch (DbExceptionModified ex)
                {
                    if (ex.ErrCodeString == tt.ErrCodes.NotFound)
                    {
                        cusFromDb = tt.DataGetter.GetAllCustomers();
                        if (cusFromDb.Exists(cus => cus.Id == customer.Id))
                            throw new InternalTestFailureException(ex.Message, ex);

                    }
                    else if (ex.ErrCodeString == tt.ErrCodes.NotAuthorized)
                    {
                        if (randomAdmin.Level >= 2)
                            throw new InternalTestFailureException(ex.Message, ex);
                    }
                    else
                    {
                        throw new InternalTestFailureException(ex.Message, ex);
                    }
                }
            });
        }
        //Admin Facade 9
         /*UpdateAirline dont need to test because its exactly the same as in the Airline Facade and
         Were testing it there already */
        //Admin Facade 10
        [TestMethod]
        public void RemoveAirlineTester()
        {
            tt.DataInserter.InsertAll(tt.Data.Countries, tt.Data.Airlines, tt.Data.Admins, tt.Data.Customers,
                tt.Data.Flights, tt.Data.Tickets);
            List<Airline> airlineFromDb;
            List<Flight> flightsFromDb, flightsOfTheAirline;
            List<Ticket> ticketsFromDb;
            Admin randomAdmin;
            tt.Data.Airlines.ForEach(airline =>
            {
                randomAdmin = tt.Data.Admins[rnd.Next(0, tt.Data.Admins.Count - 1)];
                try
                {
                    flightsOfTheAirline = tt.Data.Flights.Where(flight => flight.AirlineCompanyFk.Id == airline.Id).ToList();
                    tt.AdminFacade.RemoveAirline((long)airline.Id, (long)randomAdmin.Id);
                    airlineFromDb = tt.DataGetter.GetAllAirlines();
                    ticketsFromDb = tt.DataGetter.GetAllTickets();
                    flightsFromDb = tt.DataGetter.GetAllFlights();
                    if (!airlineFromDb.All(a => a.Id != airline.Id))
                        throw new InternalTestFailureException($"airline with Id:{airline.Id} wasn't deleted properly");
                    if (!ticketsFromDb.All(ticket => !(flightsOfTheAirline.Exists(f => f.Id == ticket.FlightFk.Id))))
                        throw new InternalTestFailureException($"tickets of airline with Id:{airline.Id} weren't deleted properly");
                    if (!flightsFromDb.All(flight => flight.AirlineCompanyFk.Id != airline.Id))
                        throw new InternalTestFailureException($"flights of airline with Id:{airline.Id} weren't deleted properly");
                }
                catch (DbExceptionModified ex)
                {
                    if (ex.ErrCodeString == tt.ErrCodes.NotFound)
                    {
                        airlineFromDb = tt.DataGetter.GetAllAirlines();
                        if (airlineFromDb.Exists(a => a.Id == airline.Id))
                            throw new InternalTestFailureException(ex.Message, ex);

                    }
                    else if (ex.ErrCodeString == tt.ErrCodes.NotAuthorized)
                    {
                        if (randomAdmin.Level >= 2)
                            throw new InternalTestFailureException(ex.Message, ex);
                    }
                    else
                    {
                        throw new InternalTestFailureException(ex.Message, ex);
                    }

                }
            });
        }


        //Admin Facade 14
        [TestMethod]
        public void CreateAirlineTester()
        {
            tt.DataInserter.InsertCountries(tt.Data.Countries);
            tt.DataInserter.InsertAdminstrators(tt.Data.Admins);
            List<Airline> addedAirlines = new List<Airline>();
            Admin admin;
            Tuple<long, long> facadeResult;           
            tt.Data.Airlines.ForEach(airline =>
            {
                admin = tt.Data.Admins[rnd.Next(0, tt.Data.Admins.Count - 1)];
                try
                {
                    facadeResult = tt.AdminFacade.CreateAirline(airline, (long)admin.Id);
                    airline.Id = facadeResult.Item1;
                    airline.UserFk.Id = facadeResult.Item2;
                    addedAirlines.Add(airline);
                }
                catch(DbExceptionModified ex)
                {
                    
                    if (ex.ErrCodeString == tt.ErrCodes.Conflict)
                    {
                        if (!(tt.Data.Airlines.Exists(a => a.Name == airline.Name) ||
                                tt.Data.Users.Exists(u => u.Username == airline.UserFk.Username || u.Password == airline.UserFk.Password || u.Email == airline.UserFk.Email)))
                            throw new InternalTestFailureException(ex.Message, ex);
                    }
                    else if (ex.ErrCodeString == tt.ErrCodes.NotAuthorized)
                    {
                        if (admin.Level >= 2)
                            throw new InternalTestFailureException(ex.Message, ex);
                    }
                    else
                    {
                        throw new InternalTestFailureException(ex.Message, ex);
                    }
                    
                }               
            });
            List<Airline> airlinesFromDb = tt.DataGetter.GetAllAirlines();
            addedAirlines.ForEach(airline =>
            {
                airlinesFromDb.UniqueId(airline.Id).TestingModifiedDeepEquals(airline);
            });
        }

    }
}
