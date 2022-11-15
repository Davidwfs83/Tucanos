using DataCommunicator.IDaos;
using DataCommunicator.Pocos;
using DataCommunicator.Queries;
using Npgsql;
using System;
using System.Collections.Generic;

namespace Pg_Sql_DataCommunicator.Daos
{
    internal class AirlineDao : IAirlineDao
    {
        internal AirlineDao()
        {
        }
        public long RequestAirlineCreation(AirlineCreationRequest airlineRequest)
        {
            NpgsqlParameter[] spArguments = new NpgsqlParameter[] {
                new NpgsqlParameter("company_name", airlineRequest.CompanyName),
                new NpgsqlParameter("country_id", airlineRequest.SelectedCountry),
                new NpgsqlParameter("a_username", airlineRequest.Username),
                new NpgsqlParameter("a_password", airlineRequest.Password),
                new NpgsqlParameter("a_email", airlineRequest.Email),
                new NpgsqlParameter("a_company_description", (airlineRequest.CompanyDescription is null) ? (object)DBNull.Value :  airlineRequest.CompanyDescription)
            };
            return StoredProcedureDispatcher.AddFunc("addairlinecreationrequest", spArguments);
        }
        //add airline and his user
        // if the company name already exist throws exception with constraint name : "airline_companies_un"
        // if the username already exist throws exception with constraint name : "users_uusername"
        // if the password already exist throws exception with constraint name : "users_upassword"
        // if the email already exist throws exception with constraint name : "users_uemail"
        public KeyValuePair<long, long> Add(Airline input)
        {
            NpgsqlParameter[] col_and_params = new NpgsqlParameter[] {
                new NpgsqlParameter("a_name", input.Name),
                new NpgsqlParameter("a_country_id", input.CountryFk.Id),
                new NpgsqlParameter("a_user_username", input.UserFk.Username),
                new NpgsqlParameter("a_user_password", input.UserFk.Password),
                new NpgsqlParameter("a_user_email", input.UserFk.Email),
                new NpgsqlParameter("a_imglink",(input.ImgLink is null) ? (object)DBNull.Value :  input.ImgLink),
                new NpgsqlParameter("a_overallscore", input.OverAllScore)
            };
            return StoredProcedureDispatcher.AddFunc("addairline", col_and_params, new Tuple<string, string>("r_id", "r_user_id"));
        }
        public Airline Get(long? Id, long? userId)
        {
            NpgsqlParameter[] col_and_params = new NpgsqlParameter[]
            {
                new NpgsqlParameter("a_airline_id", (Id is null) ? (object)DBNull.Value :  Id ),
                new NpgsqlParameter("a_user_id", (userId is null) ? (object)DBNull.Value : userId)
            };
            Dictionary<string, object> airline = StoredProcedureDispatcher.GetFunc("getairline", col_and_params,
                new string[] { "r_id", "r_name" , "r_country_id" ,"r_country_name", "r_user_id"
                ,"r_user_username","r_user_password","r_user_email", "r_imglink", "r_overallscore"});
            if (airline is null)
            {
                return null;
            }
            Airline result = new Airline
            (
                (long)airline["r_id"],
                (string)airline["r_name"],
                ((airline["r_imglink"]) == (object)DBNull.Value) ? null : (string)airline["r_imglink"],
                new Country
                (
                (long)airline["r_country_id"],
                (string)airline["r_country_name"]
                ),
                new User
                (
                (long)airline["r_user_id"],
                (string)airline["r_user_username"],
                (string)airline["r_user_password"],
                (string)airline["r_user_email"],
                UserRole.Airline
                )
            );
            result.OverAllScore = (decimal)airline["r_overallscore"];
            return result;
        }


        public List<Airline> GetAll(AirlineQuery query)
        {
            NpgsqlParameter[] inputArguments = new NpgsqlParameter[] {
                new NpgsqlParameter("a_name", (query?.Name is null) ? (object)DBNull.Value :  query.Name ),
                new NpgsqlParameter("a_countries", (query?.AllowedCountriesId is null) ? (object)DBNull.Value :  query.AllowedCountriesId)
            };
            List<Dictionary<string, object>> AllAirlines = StoredProcedureDispatcher.GetAllWithParams("getallairlines",
               new string[] { "r_id","r_name","r_country_id", "r_country_name", "r_user_id", "r_user_username",
               "r_user_password", "r_user_email", "r_imglink", "r_overallscore"}, inputArguments);
            List<Airline> Result = new List<Airline>();
            for (int i = 0; i < AllAirlines.Count; i++)
            {
                Airline p_airlinecompany = new Airline
                    (
                      (long)((AllAirlines[i])["r_id"]),
                      (string)((AllAirlines[i])["r_name"]),
                      ((AllAirlines[i])["r_imglink"]) == (object)DBNull.Value ? null : (string)((AllAirlines[i])["r_imglink"]),
                      new Country
                      (
                          (long)((AllAirlines[i])["r_country_id"]),
                          (string)((AllAirlines[i])["r_country_name"])
                      ),
                      new User
                      (
                          (long)((AllAirlines[i])["r_user_id"]),
                          (string)((AllAirlines[i])["r_user_username"]),
                          (string)((AllAirlines[i])["r_user_password"]),
                          (string)((AllAirlines[i])["r_user_email"]),
                          UserRole.Airline
                      )
                    );
                p_airlinecompany.OverAllScore = (decimal)((AllAirlines[i])["r_overallscore"]);
                Result.Add(p_airlinecompany);
            }
            return Result;
        }
        public long Remove(long Id, long? adminId)
        {
            NpgsqlParameter[] func_params_id_tobe_removed = new NpgsqlParameter[]
            {
                new NpgsqlParameter("a_airline_id", Id),
                new NpgsqlParameter("a_admin_id", adminId)
            };
            return StoredProcedureDispatcher.RemoveItem("removeairline", func_params_id_tobe_removed);
        }
        public long Update(Airline airlinecompany)
        {
            NpgsqlParameter[] col_and_params = new NpgsqlParameter[] {
                new NpgsqlParameter("a_airlinecompany_id", airlinecompany.Id),
                new NpgsqlParameter("a_name",  airlinecompany.Name),
                new NpgsqlParameter("a_country_id", airlinecompany.CountryFk?.Id),
                new NpgsqlParameter("a_username", airlinecompany.UserFk?.Username),
                new NpgsqlParameter("a_password", airlinecompany.UserFk?.Password),
                new NpgsqlParameter("a_email", airlinecompany.UserFk?.Email),
                new NpgsqlParameter("a_imglink", (airlinecompany?.ImgLink is null) ? (object)DBNull.Value :  airlinecompany.ImgLink )
            };
            return StoredProcedureDispatcher.UpdateItem("updateairline", col_and_params);
        }
    }
}
