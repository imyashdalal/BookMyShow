import { useState } from "react";
import { useLoggedInUser, useUpdateProfile } from "../../hooks/auth.hooks";
import { useGetUserBookings } from "../../hooks/booking.hooks";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const { data: user } = useLoggedInUser();
  const { data: bookings, isLoading: bookingsLoading } = useGetUserBookings();
  const { mutateAsync: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("upcoming");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
  });

  // Separate bookings into upcoming and past
  const now = new Date();
  
  const upcomingBookings = bookings?.filter((booking) => {
    if (!booking.showId?.startTimestamp || !booking.showId?.showDate) return false;
    const dateTimeString = `${booking.showId.showDate} ${booking.showId.startTimestamp}`;
    const showTime = moment(dateTimeString, "YYYY-MM-DD HH:mm").toDate();
    return showTime >= now;
  }) || [];
  
  const pastBookings = bookings?.filter((booking) => {
    if (!booking.showId?.startTimestamp || !booking.showId?.showDate) return false;
    const dateTimeString = `${booking.showId.showDate} ${booking.showId.startTimestamp}`;
    const showTime = moment(dateTimeString, "YYYY-MM-DD HH:mm").toDate();
    return showTime < now;
  }) || [];

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileData);
      setIsEditingProfile(false);
      alert("Profile updated successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleCancelEdit = () => {
    setProfileData({
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
    });
    setIsEditingProfile(false);
  };

  const BookingCard = ({ booking }) => {
    const show = booking.showId;
    const movie = show?.movieId;
    const theatre = show?.theatreHallId?.theatreId;
    
    // Combine showDate and startTimestamp to create proper datetime
    const dateTimeString = show?.showDate && show?.startTimestamp 
      ? `${show.showDate} ${show.startTimestamp}` 
      : null;
    const showDateTime = dateTimeString ? moment(dateTimeString, "YYYY-MM-DD HH:mm").toDate() : null;
    const isPast = showDateTime ? showDateTime < now : false;

    return (
      <div className={`card bg-base-100 shadow-xl text-primary ${isPast ? 'opacity-75' : ''}`}>
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Movie Poster */}
            <div className="avatar">
              <div className="w-24 h-36 rounded-lg shadow-md">
                <img
                  src={movie?.imageURL}
                  alt={movie?.title}
                  className="object-cover"
                />
              </div>
            </div>

            {/* Booking Details */}
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-xl font-bold">{movie?.title}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <div className="badge badge-primary">{movie?.language}</div>
                  <div className="badge badge-secondary">{movie?.durationInMinutes} min</div>
                  {isPast && <div className="badge badge-ghost">Completed</div>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="font-semibold">{theatre?.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{show?.showDate || 'N/A'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{show?.startTimestamp || 'N/A'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  <span className="font-semibold">Seat {booking.seatNumber}</span>
                </div>
              </div>

              <div className="text-xs text-base-content/60">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {theatre?.plot}, {theatre?.street}, {theatre?.city}, {theatre?.state} - {theatre?.pincode}
                </div>
              </div>

              <div className="text-xs text-base-content/50">
                Booked on: {moment(booking.createdAt).format("DD MMM YYYY, hh:mm A")}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (bookingsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.firstname}! 👋</h1>
          <p className="text-secondary">Manage your bookings and profile</p>
        </div>

        {/* Tabs */}
        <div className="tabs tabs-boxed mb-6 bg-neutral p-1">
          <a
            className={`tab tab-lg ${activeTab === "upcoming" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            Upcoming Shows ({upcomingBookings.length})
          </a>
          <a
            className={`tab tab-lg ${activeTab === "past" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("past")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Past Shows ({pastBookings.length})
          </a>
          <a
            className={`tab tab-lg ${activeTab === "profile" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile
          </a>
        </div>

        {/* Tab Content */}
        {activeTab === "upcoming" && (
          <div className="space-y-4">
            {upcomingBookings.length === 0 ? (
              <div className="card bg-base-100 shadow-xl text-primary">
                <div className="card-body text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-base-content/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  <h3 className="text-2xl font-bold mb-2">No Upcoming Shows</h3>
                  <p className="text-secondary mb-6">You haven't booked any tickets yet. Start exploring movies!</p>
                  <button className="btn btn-primary" onClick={() => navigate('/explore')}>
                    Browse Movies
                  </button>
                </div>
              </div>
            ) : (
              upcomingBookings.map((booking) => (
                <BookingCard key={booking._id} booking={booking} />
              ))
            )}
          </div>
        )}

        {activeTab === "past" && (
          <div className="space-y-4">
            {pastBookings.length === 0 ? (
              <div className="card bg-base-100 shadow-xl text-primary">
                <div className="card-body text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-base-content/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-2xl font-bold mb-2">No Past Shows</h3>
                  <p className="text-secondary">Your booking history will appear here</p>
                </div>
              </div>
            ) : (
              pastBookings.map((booking) => (
                <BookingCard key={booking._id} booking={booking} />
              ))
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Information */}
            <div className="card bg-base-100 shadow-xl text-primary">
              <div className="card-body">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="card-title text-2xl">Profile Information</h2>
                  {!isEditingProfile && (
                    <button
                      className="btn btn-sm btn-primary gap-2"
                      onClick={() => setIsEditingProfile(true)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </button>
                  )}
                </div>

                {!isEditingProfile ? (
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">First Name</span>
                      </label>
                      <div className="input input-bordered flex items-center bg-neutral">
                        {user?.firstname}
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Last Name</span>
                      </label>
                      <div className="input input-bordered flex items-center bg-neutral">
                        {user?.lastname}
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Email</span>
                      </label>
                      <div className="input input-bordered flex items-center gap-2 bg-neutral">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {user?.email}
                      </div>
                      <label className="label">
                        <span className="label-text-alt text-base-content/60">Email cannot be changed</span>
                      </label>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Role</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="badge badge-primary badge-lg capitalize">{user?.role}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">First Name</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={profileData.firstname}
                        onChange={(e) =>
                          setProfileData({ ...profileData, firstname: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Last Name</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={profileData.lastname}
                        onChange={(e) =>
                          setProfileData({ ...profileData, lastname: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Email</span>
                      </label>
                      <div className="input input-bordered flex items-center gap-2 bg-neutral">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {user?.email}
                      </div>
                      <label className="label">
                        <span className="label-text-alt text-base-content/60">Email cannot be changed</span>
                      </label>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={handleCancelEdit}
                        disabled={isUpdating}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Account Stats */}
            <div className="card bg-base-100 shadow-xl text-primary">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6">Account Statistics</h2>
                
                <div className="stats stats-vertical shadow">
                  <div className="stat">
                    <div className="stat-figure text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                    </div>
                    <div className="stat-title">Total Bookings</div>
                    <div className="stat-value text-primary">{bookings?.length || 0}</div>
                    <div className="stat-desc">All time bookings</div>
                  </div>
                  
                  <div className="stat">
                    <div className="stat-figure text-secondary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div className="stat-title">Upcoming Shows</div>
                    <div className="stat-value text-secondary">{upcomingBookings.length}</div>
                    <div className="stat-desc">Shows to watch</div>
                  </div>
                  
                  <div className="stat">
                    <div className="stat-figure text-accent">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="stat-title">Past Shows</div>
                    <div className="stat-value text-accent">{pastBookings.length}</div>
                    <div className="stat-desc">Movies watched</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
