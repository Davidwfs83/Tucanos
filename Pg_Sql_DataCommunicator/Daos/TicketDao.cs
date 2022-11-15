using DataCommunicator.IDaos;
using DataCommunicator.Pocos;
using DataCommunicator.Queries;
using Npgsql;
using System;
using System.Collections.Generic;

namespace Pg_Sql_DataCommunicator.Daos
{
    internal class TicketDao : ITicketDao
    {
        internal TicketDao()
        {
        }

        
        public long Add(Ticket input, int pointsToConsume)
        {
            NpgsqlParameter[] col_and_params = new NpgsqlParameter[] {
                new NpgsqlParameter("a_flight_id", input.FlightFk.Id),
                new NpgsqlParameter("a_customer_id", input.CustomerFk.Id),
                new NpgsqlParameter("a_points", pointsToConsume),
                new NpgsqlParameter("a_stripe_id", input.StripeId)
            };
            return StoredProcedureDispatcher.AddFunc("addticket", col_and_params);
        }
        public Ticket Get(long Id)
        {
            throw new NotImplementedException();
        }


        public List<Ticket> GetAllTicektsByFlight(FlightTicketQuery query)
        {
            NpgsqlParameter[] procedureArguments = new NpgsqlParameter[] {
                new NpgsqlParameter("a_flight_id", (query?.FlightId is null) ? (object)DBNull.Value :  query.FlightId),
                new NpgsqlParameter("a_airline_id", (query?.AirlineId is null) ? (object)DBNull.Value :  query.AirlineId)
            };
            string[] returnColumns = new string[] { "r_ticket_id", "r_cost", "r_customer_id",
                "r_customer_firstname","r_customer_lastname","r_customer_address",
                "r_customer_phone_no", "r_customer_gender", "r_customer_imglink", "r_customer_user_id"};
            List<Dictionary<string, object>> allTickets = StoredProcedureDispatcher.GetAllWithParams("getallticketsbyflight", returnColumns
                , procedureArguments);
            List<Ticket> Result = new List<Ticket>();
            for (int i = 0; i < allTickets.Count; i++)
            {
                Ticket p_ticket = new Ticket();
                p_ticket.FlightFk = new Flight();
                p_ticket.FlightFk.OriginCountryFk = new Country();
                p_ticket.FlightFk.DestinationCountryFk = new Country();
                p_ticket.FlightFk.AirlineCompanyFk = new Airline();
                p_ticket.CustomerFk = new Customer();
                p_ticket.Id = (long)((allTickets[i])["r_ticket_id"]);
                p_ticket.Cost = (int)((allTickets[i])["r_cost"]);
                p_ticket.CustomerFk.Id = (long)((allTickets[i])["r_customer_id"]);
                p_ticket.CustomerFk.FirstName = (string)((allTickets[i])["r_customer_firstname"]);
                p_ticket.CustomerFk.LastName = (string)((allTickets[i])["r_customer_lastname"]);
                p_ticket.CustomerFk.Address = (string)((allTickets[i])["r_customer_address"]);
                p_ticket.CustomerFk.PhoneNo = (string)((allTickets[i])["r_customer_phone_no"]);
                p_ticket.CustomerFk.Gender = (bool)((allTickets[i])["r_customer_gender"]);
                p_ticket.CustomerFk.ImgLink = (string)((allTickets[i])["r_customer_imglink"]);
                p_ticket.CustomerFk.UserFk.Id = (long)((allTickets[i])["r_customer_user_id"]);

                Result.Add(p_ticket);
            }
            return Result;
        }

        public List<Ticket> GetAllActiveTickets(long customerId)
        {
            NpgsqlParameter[] procedureArguments = new NpgsqlParameter[] {
                new NpgsqlParameter("a_customer", customerId)              
            };
            string[] returnColumns = new string[] { "r_ticket_id", "r_cost",
                "r_flight_id", "r_flight_airline_name", "r_flight_origin_country_name",
                "r_flight_destination_country_name", "r_flight_departure_time", "r_flight_landing_time"
                ,"r_flight_price","r_stripe_id"};
            List<Dictionary<string, object>> allTickets = StoredProcedureDispatcher.GetAllWithParams("getallactivetickets", returnColumns
                , procedureArguments);
            List<Ticket> Result = new List<Ticket>();
            for (int i = 0; i < allTickets.Count; i++)
            {
                Ticket p_ticket = new Ticket();
                p_ticket.FlightFk = new Flight();
                p_ticket.FlightFk.OriginCountryFk = new Country();
                p_ticket.FlightFk.DestinationCountryFk = new Country();
                p_ticket.FlightFk.AirlineCompanyFk = new Airline();
                p_ticket.StripeId = (string)((allTickets[i])["r_stripe_id"]);
                p_ticket.CustomerFk = new Customer();
                p_ticket.Id = (long)((allTickets[i])["r_ticket_id"]);
                p_ticket.Cost = (int)((allTickets[i])["r_cost"]);
                p_ticket.FlightFk.Id = (long)((allTickets[i])["r_flight_id"]);
                p_ticket.FlightFk.AirlineCompanyFk.Name = (string)((allTickets[i])["r_flight_airline_name"]);
                p_ticket.FlightFk.OriginCountryFk.Name = (string)((allTickets[i])["r_flight_origin_country_name"]);
                p_ticket.FlightFk.DestinationCountryFk.Name = (string)((allTickets[i])["r_flight_destination_country_name"]);
                p_ticket.FlightFk.DepartureTime = (DateTime)((allTickets[i])["r_flight_departure_time"]);
                p_ticket.FlightFk.LandingTime = (DateTime)((allTickets[i])["r_flight_landing_time"]);
                p_ticket.FlightFk.Price = (int)((allTickets[i])["r_flight_price"]);

                Result.Add(p_ticket);
            }
            return Result;
        }
        public List<Ticket> GetAllTicketsHistory(long customerId)
        {
            NpgsqlParameter[] procedureArguments = new NpgsqlParameter[] {
                new NpgsqlParameter("a_customer", customerId)
            };
            string[] returnColumns = new string[] { "r_ticket_id", "r_cost",
                "r_flight_id", "r_flight_airline_name", "r_flight_origin_country_name",
                "r_flight_destination_country_name", "r_flight_departure_time", "r_flight_landing_time"
                ,"r_flight_price","r_stripe_id"};
            List<Dictionary<string, object>> allTickets = StoredProcedureDispatcher.GetAllWithParams("getallticketshistory", returnColumns
                , procedureArguments);
            List<Ticket> Result = new List<Ticket>();
            for (int i = 0; i < allTickets.Count; i++)
            {
                Ticket p_ticket = new Ticket();
                p_ticket.FlightFk = new Flight();
                p_ticket.FlightFk.OriginCountryFk = new Country();
                p_ticket.FlightFk.DestinationCountryFk = new Country();
                p_ticket.FlightFk.AirlineCompanyFk = new Airline();
                p_ticket.StripeId = (string)((allTickets[i])["r_stripe_id"]);
                p_ticket.CustomerFk = new Customer();
                p_ticket.Id = (long)((allTickets[i])["r_ticket_id"]);
                p_ticket.Cost = (int)((allTickets[i])["r_cost"]);
                p_ticket.FlightFk.Id = (long)((allTickets[i])["r_flight_id"]);
                p_ticket.FlightFk.AirlineCompanyFk.Name = (string)((allTickets[i])["r_flight_airline_name"]);
                p_ticket.FlightFk.OriginCountryFk.Name = (string)((allTickets[i])["r_flight_origin_country_name"]);
                p_ticket.FlightFk.DestinationCountryFk.Name = (string)((allTickets[i])["r_flight_destination_country_name"]);
                p_ticket.FlightFk.DepartureTime = (DateTime)((allTickets[i])["r_flight_departure_time"]);
                p_ticket.FlightFk.LandingTime = (DateTime)((allTickets[i])["r_flight_landing_time"]);
                p_ticket.FlightFk.Price = (int)((allTickets[i])["r_flight_price"]);

                Result.Add(p_ticket);
            }
            return Result;
        }

        public KeyValuePair<long, string> Remove(long Id, long customerId)
        {
            NpgsqlParameter[] func_params_id_tobe_removed = new NpgsqlParameter[] {
                new NpgsqlParameter("a_id", Id),
                new NpgsqlParameter("a_customer_id", customerId)
            };
            return StoredProcedureDispatcher.RemoveTicket( func_params_id_tobe_removed);
        }
        public long Update(Ticket ticket)
        {
            NpgsqlParameter[] col_and_params = new NpgsqlParameter[] { new NpgsqlParameter("p_ticket_id", ticket.Id),
                new NpgsqlParameter("p_flight_id", ticket.FlightFk?.Id  ),
                new NpgsqlParameter("p_customer_id", ticket.CustomerFk?.Id)
            };
            return StoredProcedureDispatcher.UpdateItem("updatetickettoticketstable", col_and_params);
        }

    }
     
}
