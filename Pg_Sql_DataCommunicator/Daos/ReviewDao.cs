using DataCommunicator.IDaos;
using DataCommunicator.Pocos;
using Npgsql;
using System;
using System.Collections.Generic;

namespace Pg_Sql_DataCommunicator.Daos
{
    internal class ReviewDao : IReviewDao
    {
        public long AddReview(Review review)
        {
            NpgsqlParameter[] params_to_sp = new NpgsqlParameter[] {
                new NpgsqlParameter("a_description", review.Description),
                new NpgsqlParameter("a_airline_id", review.AirlineFk.Id),
                new NpgsqlParameter("a_customer_id", review.CustomerFk.Id),
                new NpgsqlParameter("a_score", review.Score)
            };
            return StoredProcedureDispatcher.AddFunc("addreview", params_to_sp);
        }
        public List<Review> GetRandomThreeReviews()
        {

            string[] returnColumns = new string[] { "r_id", "r_description", "r_customer_user_id", "r_customer_firstname",
                    "r_customer_lastname","r_customer_imglink","r_airline_name", "r_score","r_createat"};
          
            List<Dictionary<string, object>> allReviews = StoredProcedureDispatcher.GetAllWithParams("threerandomreview", returnColumns, null);
            List<Review> Result = new List<Review>();
            for (int i = 0; i < allReviews.Count; i++)
            {
                Review review = new Review();
                review.Id = (long)((allReviews[i])["r_id"]);
                review.Description = (string)((allReviews[i])["r_description"]);
                review.CustomerFk.UserFk.Id = (long)((allReviews[i])["r_customer_user_id"]);
                review.CustomerFk.FirstName = (string)((allReviews[i])["r_customer_firstname"]);
                review.CustomerFk.LastName = (string)((allReviews[i])["r_customer_lastname"]);
                review.CustomerFk.ImgLink = (string)((allReviews[i])["r_customer_imglink"]);
                review.AirlineFk.Name = (string)((allReviews[i])["r_airline_name"]);
                review.Score = (decimal)((allReviews[i])["r_score"]);
                review.CreateAt = (DateTime)((allReviews[i])["r_createat"]);

                Result.Add(review);

            }
            return Result;
        }

        public List<Review> GetAllReviewsByAirline(long airlineId)
        {
            string[] returnColumns = new string[] { "r_id","r_airline_name", "r_description", "r_customer_user_id", "r_customer_firstname",
                    "r_customer_lastname","r_customer_imglink", "r_score","r_createat"};
            NpgsqlParameter[] inputArguments = new NpgsqlParameter[] {
                new NpgsqlParameter("a_airline_id", airlineId )
                           };
            List<Dictionary<string, object>> allReviews = StoredProcedureDispatcher.GetAllWithParams("getallreviewsbyairline", returnColumns
                , inputArguments);
            List<Review> Result = new List<Review>();
            for (int i = 0; i < allReviews.Count; i++)
            {
                Review review = new Review();
                review.Id = (long)((allReviews[i])["r_id"]);
                review.AirlineFk.Name = (string)((allReviews[i])["r_airline_name"]);
                review.Description = (string)((allReviews[i])["r_description"]);
                review.CustomerFk.UserFk.Id = (long)((allReviews[i])["r_customer_user_id"]);
                review.CustomerFk.FirstName = (string)((allReviews[i])["r_customer_firstname"]);
                review.CustomerFk.LastName = (string)((allReviews[i])["r_customer_lastname"]);
                review.CustomerFk.ImgLink = (string)((allReviews[i])["r_customer_imglink"]);
                review.Score = (decimal)((allReviews[i])["r_score"]);
                review.CreateAt = (DateTime)((allReviews[i])["r_createat"]);

                Result.Add(review);

            }
            return Result;
        }

        

        public long RemoveReview(long reviewId)
        {
            throw new NotImplementedException();
        }
    }
}
