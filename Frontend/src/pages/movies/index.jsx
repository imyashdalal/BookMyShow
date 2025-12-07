import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useGetMovieCast, useGetMovieCrew } from "../../hooks/movie-role.hooks";
import { useGetCriticReviews, useGetMovieReviews, useCreateMovieReview } from "../../hooks/review.hooks";

const MoviesPage = () => {
  const movie = useSelector((state) => state.movie);
  const location = useSelector((state) => state.location);
  const navigate = useNavigate();
  const { id } = useParams();
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [activeTab, setActiveTab] = useState("cast");
  
  const { data: cast, isLoading: castLoading } = useGetMovieCast(id);
  const { data: crew, isLoading: crewLoading } = useGetMovieCrew(id);
  const { data: criticReviews, isLoading: criticLoading } = useGetCriticReviews(id);
  const { data: userReviews, isLoading: userReviewsLoading } = useGetMovieReviews(id);
  const createReview = useCreateMovieReview();

  useEffect(() => {
    if (movie._id === null) {
      navigate("/explore");
    }
  }, []);

  const handleNavigation = () => {
    const cityName = location.location || "Nagpur";
    navigate(`/${cityName}/movies/${movie._id}/bookShow`);
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (userRating === 0) {
      alert("Please select a rating");
      return;
    }
    try {
      await createReview.mutateAsync({
        movieId: id,
        rating: userRating,
        review: userReview,
      });
      setUserRating(0);
      setUserReview("");
      setShowReviewForm(false);
      alert("Review submitted successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit review");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const StarRating = ({ rating, onRate, readonly = false }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onRate && onRate(star)}
            className={`text-2xl ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'}`}
            disabled={readonly}
          >
            {star <= rating ? '⭐' : '☆'}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4">
        <div className="breadcrumbs text-sm">
          <ul>
            <li><a onClick={() => navigate('/')}>Home</a></li>
            <li><a onClick={() => navigate('/explore')}>Movies</a></li>
            <li className="text-primary">{movie.title || 'Movie'}</li>
          </ul>
        </div>
      </div>

      {/* Hero Section with Movie Details */}
      <div className="hero bg-neutral min-h-[60vh]">
        <div className="hero-content flex-col lg:flex-row gap-8 container mx-auto">
          {/* Movie Poster */}
          <div className="lg:w-1/3">
            <div className="card bg-base-100 shadow-xl text-primary">
              <figure>
                <img
                  src={movie.imageURL}
                  alt={movie.title}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </figure>
            </div>
          </div>

          {/* Movie Info */}
          <div className="lg:w-2/3">
            <h1 className="text-5xl font-bold text-primary">{movie.title}</h1>
            
            {/* Metadata Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              {movie.adultRating && (
                <div className="badge badge-neutral badge-lg">{movie.adultRating}</div>
              )}
              {movie.durationInMinutes && (
                <div className="badge badge-outline badge-lg">{movie.durationInMinutes} min</div>
              )}
              {movie.language && (
                <div className="badge badge-outline badge-lg">{movie.language}</div>
              )}
            </div>

            {/* Genres */}
            {movie.genre && movie.genre.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {movie.genre.map((g, index) => (
                  <span key={index} className="badge badge-secondary">{g}</span>
                ))}
              </div>
            )}

            {/* Categories */}
            {movie.categories && movie.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {movie.categories.map((category, index) => (
                  <span key={index} className="badge badge-accent">{category}</span>
                ))}
              </div>
            )}

            {/* Synopsis */}
            <p className="py-6 text-secondary">{movie.description}</p>

            {/* Get Tickets Button */}
            <button className="btn btn-primary btn-lg" onClick={handleNavigation}>
              Get Tickets
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="container mx-auto px-4 py-8">
        <div role="tablist" className="tabs tabs-lifted tabs-lg">
          <input
            type="radio"
            name="movie_tabs"
            role="tab"
            className="tab"
            aria-label="Cast & Crew"
            checked={activeTab === "cast"}
            onChange={() => setActiveTab("cast")}
          />
          <div role="tabpanel" className="tab-content bg-base-100 border-accent rounded-box p-6 text-primary">
            {/* Cast Carousel */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Cast</h2>
              {castLoading ? (
                <div className="flex gap-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="skeleton h-32 w-32 rounded-full"></div>
                  ))}
                </div>
              ) : cast && cast.length > 0 ? (
                <div className="carousel carousel-center gap-4 p-4 bg-neutral rounded-box">
                  {cast.map((member) => (
                    <div
                      key={member._id}
                      className="carousel-item flex flex-col items-center cursor-pointer hover:scale-105 transition-transform w-32"
                      onClick={() => navigate(`/person/${member.personId._id}`)}> 
                      <div className="avatar">
                        <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                          <img
                            src={member.personId.imageURL || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                            alt={member.personId.name}
                          />
                        </div>
                      </div>
                      <p className="mt-2 font-semibold text-center w-full line-clamp-1">{member.personId.name}</p>
                      {member.characterName && (
                        <p className="text-sm opacity-70 text-center w-full line-clamp-2">as {member.characterName}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-secondary opacity-70">No cast information available</p>
              )}
            </div>

            {/* Crew Carousel */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Crew</h2>
              {crewLoading ? (
                <div className="flex gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="skeleton h-32 w-32 rounded-full"></div>
                  ))}
                </div>
              ) : crew && crew.length > 0 ? (
                <div className="carousel carousel-center gap-4 p-4 bg-neutral rounded-box">
                  {crew.map((member) => (
                    <div
                      key={member._id}
                      className="carousel-item flex flex-col items-center cursor-pointer hover:scale-105 transition-transform w-32"
                      onClick={() => navigate(`/person/${member.personId._id}`)}>
                      <div className="avatar">
                        <div className="w-32 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
                          <img
                            src={member.personId.imageURL || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                            alt={member.personId.name}
                          />
                        </div>
                      </div>
                      <p className="mt-2 font-semibold text-center w-full line-clamp-1">{member.personId.name}</p>
                      <p className="text-sm opacity-70 text-center capitalize w-full line-clamp-2">{member.role}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-secondary opacity-70">No crew information available</p>
              )}
            </div>
          </div>

          <input
            type="radio"
            name="movie_tabs"
            role="tab"
            className="tab"
            aria-label="Details"
            checked={activeTab === "details"}
            onChange={() => setActiveTab("details")}
          />
          <div role="tabpanel" className="tab-content bg-base-100 border-accent rounded-box p-6 text-primary">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-bold text-lg mb-2">Movie Information</h3>
                <div className="space-y-2">
                  {movie.durationInMinutes && (
                    <p><span className="font-semibold">Duration:</span> {movie.durationInMinutes} minutes</p>
                  )}
                  {movie.language && (
                    <p><span className="font-semibold">Language:</span> {movie.language}</p>
                  )}
                  {movie.adultRating && (
                    <p><span className="font-semibold">Rating:</span> {movie.adultRating}</p>
                  )}
                  {movie.genre && movie.genre.length > 0 && (
                    <p><span className="font-semibold">Genres:</span> {movie.genre.join(', ')}</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Synopsis</h3>
                <p className="text-secondary opacity-80">{movie.description}</p>
              </div>
            </div>
          </div>

          <input
            type="radio"
            name="movie_tabs"
            role="tab"
            className="tab"
            aria-label="Reviews"
            checked={activeTab === "reviews"}
            onChange={() => setActiveTab("reviews")}
          />
          <div role="tabpanel" className="tab-content bg-base-100 border-accent rounded-box p-6 text-primary">
            {/* Critic Reviews */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Critics Reviews</h2>
              {criticLoading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="skeleton h-32 w-full"></div>
                  ))}
                </div>
              ) : criticReviews && criticReviews.length > 0 ? (
                <div className="space-y-2">
                  {criticReviews.map((review) => (
                    <div key={review._id} className="collapse collapse-arrow bg-neutral">
                      <input type="checkbox" /> 
                      <div className="collapse-title">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-bold text-lg">{review.criticName}</h3>
                            <p className="text-sm opacity-70">{review.publication}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <StarRating rating={review.rating} readonly={true} />
                            <p className="text-xs opacity-70 mt-1">{formatDate(review.reviewDate)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="collapse-content">
                        <p className="pt-2">{review.review}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-secondary opacity-70">No critic reviews yet</p>
              )}
            </div>

            {/* User Reviews */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">User Reviews</h2>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowReviewForm(!showReviewForm)}>
                  Write a Review
                </button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <div className="card bg-neutral shadow-xl mb-6 text-primary">
                  <div className="card-body">
                    <h3 className="card-title">Write Your Review</h3>
                    <form onSubmit={handleSubmitReview}>
                      <div className="form-control mb-4">
                        <label className="label">
                          <span className="label-text">Rating</span>
                        </label>
                        <StarRating rating={userRating} onRate={setUserRating} />
                      </div>
                      <div className="form-control mb-4">
                        <label className="label">
                          <span className="label-text">Your Review</span>
                        </label>
                        <textarea
                          className="textarea textarea-bordered h-24"
                          placeholder="Share your thoughts about this movie..."
                          value={userReview}
                          onChange={(e) => setUserReview(e.target.value)}
                          maxLength={1000}></textarea>
                        <label className="label">
                          <span className="label-text-alt">{userReview.length}/1000</span>
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={createReview.isPending}>
                          {createReview.isPending ? "Submitting..." : "Submit Review"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={() => {
                            setShowReviewForm(false);
                            setUserRating(0);
                            setUserReview("");
                          }}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* User Reviews List */}
              {userReviewsLoading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="skeleton h-32 w-full"></div>
                  ))}
                </div>
              ) : userReviews && userReviews.length > 0 ? (
                <div className="space-y-2">
                  {userReviews.map((review) => (
                    <div key={review._id} className="collapse collapse-arrow bg-neutral">
                      <input type="checkbox" /> 
                      <div className="collapse-title">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-bold text-lg">
                              {review.userId.firstname} {review.userId.lastname}
                              {review.isVerifiedBooking && (
                                <span className="badge badge-success badge-sm ml-2">Verified</span>
                              )}
                            </h3>
                            <p className="text-xs opacity-70">{formatDate(review.createdAt)}</p>
                          </div>
                          <StarRating rating={review.rating} readonly={true} />
                        </div>
                      </div>
                      <div className="collapse-content">
                        {review.review && <p className="pt-2">{review.review}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-secondary opacity-70">No user reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviesPage;

