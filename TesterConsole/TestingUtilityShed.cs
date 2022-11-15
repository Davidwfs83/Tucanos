using DataCommunicator.Pocos;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PGDataCommunicatorTester.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;

namespace TesterConsole
{
    internal static class TestingUtilityShed
    {
        internal static JObject configFileJsonObject;

         static TestingUtilityShed()
        {
            string path = GetThisFilePath();
            string configPath = path.Substring(0, path.LastIndexOf(@"\") + 1) + "UnitTest.config.json";
            string content= System.IO.File.ReadAllText(configPath);
            configFileJsonObject = (JObject)JsonConvert.DeserializeObject(content);
        }
        internal static string RandomString(int length)
        {
            Random random = new Random();
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        // This method returns the path of the current calling cs file
        private static string GetThisFilePath([CallerFilePath] string path = null)
        {
            return path;
        }

        internal static string RandomNumbersString(int length)
        {
            Random random = new Random();
            const string chars = "0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        // This extension method job is to iterate over the IEnumberable<T> and return the one and only one Element(IPoco)
        // With the id provided.
        // if there is more than one element with that id it throws DoubleIdException
        // if there is no element with that id it throws ArgumentNullException
        

        internal static List<int> RandomIntlistGenerator(int list_size)
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
        internal static List<int> RandomDistinctIntlistGenerator(int list_size)
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
        internal static void TestingModifiedDeepEquals(this object obj, object another) 
        {
            if (ReferenceEquals(obj, another)) return;
            if ((obj == null) || (another == null)) throw new AssertFailedException("one or two of the objects provided is null!"); 
            if (obj.GetType() != another.GetType()) throw new AssertFailedException("the objects type dont match!");
            if (!obj.GetType().IsClass || obj.GetType() == typeof(String))
            {
                Assert.AreEqual(obj, another);
                return;
            }
            foreach (var property in obj.GetType().GetProperties())
            {
                var propertyValue = property.GetValue(obj);
                if (propertyValue.GetType().IsClass) propertyValue.TestingModifiedDeepEquals(property.GetValue(another));                
                var anotherValue = property.GetValue(another);
                Assert.AreEqual(propertyValue, anotherValue);
                
            }
           
        }
          
    }
}
