using DataCommunicator.Pocos;
using Npgsql;
using Pg_Sql_DataCommunicator.pg_sql_daos;
using Pg_Sql_DataCommunicator.pg_sql_facades;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;
using System.Threading;
using System.Threading.Tasks;

namespace TesterConsole
{
    
       
 
    class Program
    {
        public static T DeepClone<T>(T obj)
        {
            using (var ms = new MemoryStream())
            {
                var formatter = new BinaryFormatter();
                formatter.Serialize(ms, obj);
                ms.Position = 0;

                return (T)formatter.Deserialize(ms);
            }
        }
        static void Main(string[] args)
        {
            /*

            // DB POPULATION
            
            MyConnectionPool.Initializeconnstringandcapacity
                (
                "Host=localhost;Username=postgres;Password=admin1;Database=TesterDbFp",
                50
                );
            var generator = new DataGenerator();
            generator.AllDataGenerator(10, 30, 30, 30, 30, 30);
            DataInserter.Instance.InsertAll(generator.p_countries, generator.p_airlinecompany,
                generator.p_administrator, generator.p_customers, generator.p_flights, generator.p_tickets);
            
            */


            //MyConnectionPool.Initializeconnstringandcapacity
            //   (
            //   "Server=127.0.0.1;Port=5432;Username=postgres;Password=admin123;Database=postgres",
            //   50
            //   );
            //var dd = new FlightDAOPGSQL();
            //var aa = new AirlineCompanyDAOPGSQL();

            //var result = aa.GetAll();

            MyConnectionPool.SetConnStringPoolCapacity
               (
               "Server=127.0.0.1;Port=5432;Username=postgres;Password=admin123;Database=postgres",
               50
               );
            NpgsqlConnection cs = MyConnectionPool.Instance.GetConnection();
            try
            {
                string query = "select * from customers";
               
                NpgsqlCommand command = new NpgsqlCommand(query, cs);
                command.CommandType = System.Data.CommandType.Text;
                var reader = command.ExecuteReader();

                var r = reader.Read();
            }
            finally
            {
                MyConnectionPool.Instance.ReturnConnection(cs);
            }






            ///////////////////////////////
            //MyConnectionPool.Initializeconnstringandcapacity
            //    (
            //    "Host=localhost;Username=postgres;Password=admin1;Database=postgres",
            //    50
            //    );
            //AnonymousUserFacade facade = new AnonymousUserFacade();
            //facade.SignUp(new Customer
            //    (
            //       "Ima",
            //       "shela",
            //       "mozezet",
            //       "le aravim",
            //       "ve AHOTA",
            //       false,
            //       312321,
            //       new User
            //       (
            //           "ba li lezaien",
            //           "et shay haikin",
            //           "liftoah ota"
            //       )

            //    ));
            //try
            //{
            //    Task.Run(() =>
            //    {
            //        int z = 0;
            //        int x = 1 / z;
            //    }).GetAwaiter().GetResult();
            //}
            //catch (Exception exception)
            //{
            //    Console.WriteLine("Outside : " + exception.Message);
            //}


            //try
            //{
            //    task1.Wait();
            //}
            //catch (AggregateException ae)
            //{
            //    Console.WriteLine("hello");
            //}

            //try
            //{
            //    throw new DivideByZeroException();
            //}
            //catch(Exception ex)
            //{
            //    Console.WriteLine("hello");
            //}



            //Task task_failure = Task.Run(() =>
            //{
            //    Console.WriteLine("divide by zero task");
            //    int a = 5;
            //    int b = 0;
            //    int c = a / b;
            //    Console.WriteLine("code will not be reached. task faulted.");
            //}).ContinueWith((Task papa) =>
            //{
            //    Console.WriteLine("continue with after failure");
            //    Console.WriteLine(papa.Status);
            //    Console.WriteLine(papa.IsFaulted);
            //});
            //task_failure.Wait();




        }
    }
}
