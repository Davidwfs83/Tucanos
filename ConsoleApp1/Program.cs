using DataCommunicator.Pocos;
using Pg_Sql_DataCommunicator.pg_sql_daos;
using System;

namespace ConsoleApp1
{
    class Program
    {
        static void Main(string[] args)
        {
            CustomerDAOPGSQL instancecustomerdao = new CustomerDAOPGSQL();
            Customer c = instancecustomerdao.Get(14);

        }
    }
}
