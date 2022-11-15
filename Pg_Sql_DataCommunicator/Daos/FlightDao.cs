using DataCommunicator.IDaos;
using DataCommunicator.Pocos;
using DataCommunicator.Queries;
using Npgsql;
using System;
using System.Collections.Generic;

namespace Pg_Sql_DataCommunicator.Daos
{
    internal class FlightDao : IFlightDao
    {
        internal FlightDao()
        {
        }
        public long Add(Flight input)
        {
            NpgsqlParameter[] col_and_params = new NpgsqlParameter[] {
                new NpgsqlParameter("a_airline_company_id", input.AirlineCompanyFk.Id),
                new NpgsqlParameter("a_origin_country_id", input.OriginCountryFk.Id),
                new NpgsqlParameter("a_destination_country_id", input.DestinationCountryFk.Id),
                new NpgsqlParameter("a_departure_time", input.DepartureTime),
                new NpgsqlParameter("a_landing_time", input.LandingTime),
                new NpgsqlParameter("a_remaning_tickets", input.RemainingTickets),
                new NpgsqlParameter("a_price", input.Price)
            };
            return StoredProcedureDispatcher.AddFunc("addflight", col_and_params);
        }
        public Flight Get(long Id)
        {
            NpgsqlParameter[] col_and_params = new NpgsqlParameter[] { new NpgsqlParameter("a_flight_id", Id) };
            Dictionary<string, object> flight = StoredProcedureDispatcher.GetFunc("getflight", col_and_params,
                new string[] { "r_id", "r_airline_id", "r_airline_name",
                    "r_airline_country_name","r_origin_country_name", "r_origin_country_lat", "r_origin_country_lon",
                "r_destination_country_name","r_destination_country_lat", "r_destination_country_lon",
                    "r_departure_time", "r_landing_time","r_remaining_tickets", "r_price"});
            Flight result = new Flight
            (
                (long)flight["r_id"],
                new Airline
                (
                    (long)flight["r_airline_id"],
                    (string)flight["r_airline_name"],
                  new Country(
                      (string)flight["r_airline_country_name"]
                      )
                ),
                new Country(
                    (string)flight["r_origin_country_name"],
                    (int)flight["r_origin_country_lat"],
                    (int)flight["r_origin_country_lon"]
                    ),
                new Country(
                    (string)flight["r_destination_country_name"],
                    (int)flight["r_destination_country_lat"],
                    (int)flight["r_destination_country_lon"]
                    ),
                (DateTime)flight["r_departure_time"],
                (DateTime)flight["r_landing_time"],
                (int)flight["r_remaining_tickets"],
                (int)flight["r_price"]
            );
            return result;
        }
        public List<Flight> GetAll(FlightQuery query)
        {
            string[] returnColumns = new string[] { "r_id", "r_airline_id", "r_airline_name", "r_airline_country_id",
                    "r_airline_country_name", "r_origin_country_id","r_origin_country_name", "r_origin_country_lat",
                    "r_origin_country_lon", "r_destination_country_id", "r_destination_country_name", "r_destination_country_lat",
                "r_destination_country_lon","r_departure_time", "r_landing_time", "r_remaining_tickets",
                    "r_price"};
            NpgsqlParameter[] inputArguments = new NpgsqlParameter[] {
                new NpgsqlParameter("a_min_price", (query?.MinPrice is null) ? (object)DBNull.Value :  query?.MinPrice ),
                new NpgsqlParameter("a_max_price", (query?.MaxPrice is null) ? (object)DBNull.Value :  query?.MaxPrice),
                new NpgsqlParameter("a_airlines", (query?.AllowedAirlinesIds is null) ? (object)DBNull.Value :  query?.AllowedAirlinesIds),
                new NpgsqlParameter("a_origin_countries", (query?.AllowedOriginCountriesIds is null) ? (object)DBNull.Value :  query?.AllowedOriginCountriesIds),
                new NpgsqlParameter("a_destination_countries", (query?.AllowedDestinationCountriesIds is null) ? (object)DBNull.Value :  query?.AllowedDestinationCountriesIds),
                new NpgsqlParameter("a_departure_time", (query?.DepartureTime is null) ? (object)DBNull.Value :  query?.DepartureTime),
                new NpgsqlParameter("a_landing_time", (query?.LandingTime is null) ? (object)DBNull.Value :  query?.LandingTime)
            };
            List<Dictionary<string, object>> allFlights = StoredProcedureDispatcher.GetAllWithParams("getallflights", returnColumns
                , inputArguments);
            List<Flight> Result = new List<Flight>();
            for (int i = 0; i < allFlights.Count; i++)
            {
                Flight flight = new Flight
                    (
                      (long)((allFlights[i])["r_id"]),
                      new Airline
                          (
                           (long)((allFlights[i])["r_airline_id"]),
                           (string)((allFlights[i])["r_airline_name"]),
                           new Country
                                       (
                                         (long)((allFlights[i])["r_airline_country_id"]),
                                         (string)((allFlights[i])["r_airline_country_name"])
                                       )
                          ),
                      new Country
                          (
                            (long)((allFlights[i])["r_origin_country_id"]),
                            (string)((allFlights[i])["r_origin_country_name"]),
                            (int)((allFlights[i])["r_origin_country_lat"]),
                            (int)((allFlights[i])["r_origin_country_lon"])
                          ),
                      new Country
                          (
                            (long)((allFlights[i])["r_destination_country_id"]),
                            (string)((allFlights[i])["r_destination_country_name"]),
                            (int)((allFlights[i])["r_destination_country_lat"]),
                            (int)((allFlights[i])["r_destination_country_lon"])
                          ),
                      (DateTime)((allFlights[i])["r_departure_time"]),
                      (DateTime)((allFlights[i])["r_landing_time"]),
                      (int)((allFlights[i])["r_remaining_tickets"]),
                      (int)((allFlights[i])["r_price"])
                    );
                Result.Add(flight);

            }
            return Result;
        }
        public long Remove(long flight_id, long airline_id)
        {
            NpgsqlParameter[] funcArguments = new NpgsqlParameter[]
            {
            new NpgsqlParameter("a_flight_id", flight_id),
            new NpgsqlParameter("a_airline_id", airline_id)
            };
            return StoredProcedureDispatcher.RemoveItem("removeflight", funcArguments);
        }
        //Update flight can be called by an airline which then is enabled only if its that airline flight
        // or by an which is enable to update any flight
        public long Update(Flight flight)
        {
            NpgsqlParameter[] col_and_params = new NpgsqlParameter[] {
                new NpgsqlParameter("a_id", flight.Id),
                new NpgsqlParameter("a_airline_id",  flight.AirlineCompanyFk?.Id),
                new NpgsqlParameter("a_origin_country_id", (flight.OriginCountryFk is null) ? (object)DBNull.Value :  flight.OriginCountryFk.Id ),
                new NpgsqlParameter("a_destination_country_id", (flight.DestinationCountryFk is null) ? (object)DBNull.Value : flight.DestinationCountryFk.Id),
                new NpgsqlParameter("a_departure_time", (flight.DepartureTime is null) ? (object)DBNull.Value :  flight.DepartureTime ),
                new NpgsqlParameter("a_landing_time", (flight.LandingTime is null) ? (object)DBNull.Value :  flight.LandingTime),
                new NpgsqlParameter("a_remaining_tickets", (flight.RemainingTickets is null) ? (object)DBNull.Value :  flight.RemainingTickets),
                new NpgsqlParameter("a_price", (flight.Price is null) ? (object)DBNull.Value :  flight.Price)
            };
            return StoredProcedureDispatcher.UpdateItem("updateflight", col_and_params);
        }
    }
}
