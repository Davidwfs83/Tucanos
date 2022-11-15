using Npgsql;
using System;
using System.Collections.Generic;
using DataCommunicator.IDaos;
using DataCommunicator.Pocos;
using DataCommunicator.Queries;

namespace Pg_Sql_DataCommunicator.Daos
{
    internal class CountryDao : ICountryDao
    {
        internal CountryDao()
        {
        }
        public long Add(Country input)
        {
            NpgsqlParameter[] col_and_params = new NpgsqlParameter[] 
            { 
                new NpgsqlParameter("a_name", input.Name),
                new NpgsqlParameter("a_imglink", (input.ImgLink is null) ? (object)DBNull.Value :  input.ImgLink),
                new NpgsqlParameter("a_lat", (input.Latitude is null) ? (object)DBNull.Value :  input.Latitude),
                new NpgsqlParameter("a_lon", (input.Longitude is null) ? (object)DBNull.Value :  input.Longitude)
            };
            return StoredProcedureDispatcher.AddFunc("addcountry", col_and_params);
        }
        public Country Get(long Id)
        {
            throw new NotImplementedException();
        }
        public List<Country> GetAll(CountryQuery query)
        {
            List<Dictionary<string, object>> GetAllCountries = StoredProcedureDispatcher.GetAllWithParams("getallcountries",
                new string[] { "r_id", "r_name", "r_imglink" }, new NpgsqlParameter[] {
                new NpgsqlParameter("a_name", (query?.Name is null) ? (object)DBNull.Value :  query.Name )
              });
            List<Country> Result = new List<Country>();
            for(int i = 0 ; i < GetAllCountries.Count ; i++)
            {
                Country p_country = new Country
                    (
                     (long)((GetAllCountries[i])["r_id"]),
                     (string)((GetAllCountries[i])["r_name"]),
                     ((GetAllCountries[i])["r_imglink"]) == (object)DBNull.Value ? null : (string)((GetAllCountries[i])["r_imglink"])
                    );
                Result.Add(p_country);
            }
            return Result;
        }
        public long Remove(long Id)
        {
            NpgsqlParameter[] func_params_id_tobe_removed = new NpgsqlParameter[] 
            { new NpgsqlParameter("a_countryid", (int)Id) };
            return StoredProcedureDispatcher.RemoveItem("removecountry", func_params_id_tobe_removed);
        }
        public long Update(Country country)
        {
            NpgsqlParameter[] col_and_params = new NpgsqlParameter[] 
            { 
                new NpgsqlParameter("a_id", country.Id),
                new NpgsqlParameter("a_name", (country?.Name is null) ? (object)DBNull.Value :  country.Name),
                new NpgsqlParameter("a_imglink", (country?.ImgLink is null) ? (object)DBNull.Value :  country.ImgLink)
            };
           return  StoredProcedureDispatcher.UpdateItem("updatecountry", col_and_params);
        }
    }
}
