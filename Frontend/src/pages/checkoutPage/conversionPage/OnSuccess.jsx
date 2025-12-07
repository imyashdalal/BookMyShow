import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCreatreBooking, useUnlockSeats } from '../../../hooks/booking.hooks';

const OnSuccess = () => {
    const movie = useSelector((state) => state.movie);
    const hall = useSelector((state) => state.hall);
    const booking = useSelector((state) => state.booking);
    const navigate = useNavigate();

    const { mutateAsync: CreatreBookingAync } = useCreatreBooking();
    const { mutateAsync: unlockSeatsAsync } = useUnlockSeats();

    const isBookingCreatedRef = useRef(false);

  const createBooking = async () => {
    if (!isBookingCreatedRef.current) {
      isBookingCreatedRef.current = true;
      try {
        await CreatreBookingAync({
          showId: hall.showId,
          seatNumber: booking.selectedSeats,
          paymentId: booking.orderId,
        });
        
        // Unlock seats after successful booking
        await unlockSeatsAsync({ showId: hall.showId });
      } catch (error) {
        console.error("Error creating booking or unlocking seats:", error);
      }
    }
  };

  useEffect(() => {
    createBooking();
  }, []);

    return (
        <div className='min-h-screen bg-base-100 flex justify-center items-center p-6'>
          <div className='w-full max-w-4xl'>
            {/* Success Animation Header */}
            <div className="text-center mb-8">
              <div className="inline-block">
                <div className="bg-success rounded-full p-6 mb-4 animate-bounce">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-success-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-success mb-2">Booking Confirmed!</h1>
              <p className="text-base-content/70">Your tickets have been successfully booked</p>
              <div className="mt-4">
                <span className="text-sm text-base-content/60">Booking ID: </span>
                <span className="font-mono font-semibold text-primary">{booking.orderId}</span>
              </div>
            </div>

            {/* Booking Details Card */}
            <div className="card bg-base-100 shadow-2xl border border-success/20">
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Movie Poster */}
                  <div className="flex justify-center md:p-16 sm:p-22">
                    <div className="avatar">
                      <div className="w-full max-w-xs rounded-xl shadow-xl ring-4 ring-success ring-offset-2 ring-offset-base-100">
                        <img src={movie.imageURL} alt={movie.title} className="object-cover" />
                      </div>
                    </div>
                  </div>

                  {/* Movie & Show Details */}
                  <div className="md:col-span-2 space-y-6">
                    {/* Movie Info */}
                    <div>
                      <h2 className="text-3xl font-bold mb-3">{movie.title}</h2>
                      <div className="flex flex-wrap gap-2">
                        <div className="badge badge-success badge-lg">{movie.language}</div>
                        <div className="badge badge-success badge-lg">{movie.durationInMinutes} min</div>
                      </div>
                    </div>

                    <div className="divider"></div>

                    {/* Theatre & Timing Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="bg-success/10 p-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-xs text-base-content/60 uppercase font-semibold">Theatre</div>
                            <div className="font-semibold text-lg">{hall.theatreName}</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="bg-success/10 p-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-xs text-base-content/60 uppercase font-semibold">Date</div>
                            <div className="font-semibold text-lg">{hall.showDate}</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="bg-success/10 p-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-xs text-base-content/60 uppercase font-semibold">Show Time</div>
                            <div className="font-semibold text-lg">{hall.showTiming}</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="bg-success/10 p-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-xs text-base-content/60 uppercase font-semibold">Tickets</div>
                            <div className="font-semibold text-lg">{booking.selectedSeats.length} {booking.selectedSeats.length === 1 ? 'Ticket' : 'Tickets'}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="divider"></div>

                    {/* Seat Numbers */}
                    <div>
                      <div className="text-xs text-base-content/60 uppercase font-semibold mb-2">Your Seats</div>
                      <div className="flex flex-wrap gap-2">
                        {booking.selectedSeats.map((seat, index) => (
                          <div key={index} className="badge badge-success badge-lg gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Seat {seat}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="divider"></div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button 
                    className="btn btn-primary btn-lg gap-2"
                    onClick={() => navigate('/dashboard')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    View My Bookings
                  </button>
                  <button 
                    className="btn btn-outline btn-lg gap-2"
                    onClick={() => navigate('/explore')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                    Book More Tickets
                  </button>
                </div>

                {/* Info Alert */}
                <div className="alert alert-info mt-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <div className="font-semibold">Booking Confirmation Sent!</div>
                    <div className="text-sm">A confirmation email with your ticket details has been sent to your registered email address.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
};

export default OnSuccess;