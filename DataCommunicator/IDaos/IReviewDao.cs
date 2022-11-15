using DataCommunicator.Pocos;
using System.Collections.Generic;

namespace DataCommunicator.IDaos
{
    public interface IReviewDao
    {
        public long AddReview(Review review);
        public List<Review> GetAllReviewsByAirline(long airlineId);
        public List<Review> GetRandomThreeReviews();
        public long RemoveReview(long reviewId);
    }
}
