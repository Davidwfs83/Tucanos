using DataCommunicator.IDataGenerators;
using DataCommunicator.Pocos;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PGDataCommunicatorTester.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;

namespace PGDataCommunicatorTester.Helpers
{
    internal static class TestingUtilityShed 
    {
        internal static Random rnd = new Random();
        internal static JObject configFileJsonObject;
        internal static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[rnd.Next(s.Length)]).ToArray());
        }
        // This method returns the path of the current calling cs file
        private static string GetThisFilePath([CallerFilePath] string path = null)
        {
            return path;
        }
        internal static string RandomNumbersString(int length)
        {
            const string chars = "0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[rnd.Next(s.Length)]).ToArray());
        }
        // This extension method job is to iterate over the IEnumberable<T> and return the one and only one Element(IPoco)
        // With the id provided.
        // if there is more than one element with that id it throws DoubleIdException
        // if there is no element with that id it throws ArgumentNullException
        internal static T UniqueId<T>(this IEnumerable<T> obj, long? id) where T: IPoco
        {
            IEnumerable<T> arr = obj.Where(x => x.Id == id );
            if( arr.Count() > 1 )
            {
                throw new DoubleIdException($"Double Id: {id} at ${obj}");
            }
            return arr.First();
        }
        // This extension method returns true only if the substring is actually of a substring
        // Of the main string and the sub string starts at position 0.
        // This extension method will mostly server the tests where we there's free text queries.
        internal static bool IsThisSubstringOfMine(this string str, string substr)
        {
            for (int i = 0; i < substr.Length; i++)
            {
                if (str[i] != substr[i])
                    return false;
            }
            return true;
        }
        internal static List<int> RandomIntlistGenerator(int list_size)
        {
            List<int> result = new List<int>();
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
        // the percentage is the chance in % (obviosuly) that a certain property will be null
        // otherwise it remains unchanged
        internal static void RandomAllPropertyNullazation(this object obj ,short percentage)
        {
            foreach(var property in obj.GetType().GetProperties())
            {
                if (property.Name == "Id" || property.Name == "UserFk")
                    continue;
                var propertyValue = property.GetValue(obj);
                
                property.SetValue(obj, rnd.Next(0, 99) <= percentage ? null : propertyValue);
            }
        }
        internal static void PropertyRandonNullazation(ref object property, int percentage)
        {
            property = rnd.Next(0, 99) <= percentage ? null : property; 
        }
        internal static void TestingModifiedDeepEquals(this object obj, object another) 
        {
            if (ReferenceEquals(obj, another)) return;
            if (another == null) throw new AssertFailedException("object provided was null!"); 
            if (obj.GetType() != another.GetType()) throw new AssertFailedException("the objects type dont match!");
            if (!obj.GetType().IsClass || obj.GetType() == typeof(String))
            {
                Assert.AreEqual(obj, another);
                return;
            }
            foreach (var property in obj.GetType().GetProperties())
            {
                var propertyValue = property.GetValue(obj);
                var anotherValue = property.GetValue(another);                
                if (!(propertyValue is null) && (propertyValue.GetType().IsClass)) propertyValue.TestingModifiedDeepEquals(anotherValue);                
                
                Assert.AreEqual(propertyValue, anotherValue);      
            }
           
        }       
    }
}
