import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { setBookingDetails} from '../../store/slices/bookingSlice';
import {useGetSeatStatus, useLockSeats, useUnlockSeats} from '../../hooks/booking.hooks';
import { useRealtimeSeats } from '../../hooks/useRealtimeSeats';
import { useLoggedInUser } from '../../hooks/auth.hooks';

const BookSeatPage = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const movie = useSelector((state) => state.movie);
  const hall = useSelector((state) => state.hall);
  const {data: user, isLoading: isUserLoading} = useLoggedInUser();
  const {mutateAsync: getSeatStatusAsync} = useGetSeatStatus();
  const {mutateAsync: lockSeatsAsync} = useLockSeats();
  const {mutateAsync: unlockSeatsAsync} = useUnlockSeats();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lockTimer, setLockTimer] = useState(null);
  
  // Use real-time seat updates via Socket.IO
  const {
    bookedSeats,
    lockedSeats,
    myLockedSeats,
    isConnected,
    setBookedSeats,
    setLockedSeats,
    setMyLockedSeats
  } = useRealtimeSeats(hall.showId, user?._id);

  const isInitialLoad = useRef(true);
  
  useEffect(() => {
    if (movie._id === null) {
      navigate("/explore");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initial seat status load (only once)
  const getSeatStatus = useCallback(async () => {
    if (!isInitialLoad.current) return;
    
    setIsLoading(true);
    if (hall.showId) {
      try {
        const seatData = await getSeatStatusAsync({ showId: hall.showId });
        setBookedSeats(seatData.bookedSeats || []);
        
        // Process locked seats
        const lockedByOthers = [];
        const lockedByMe = [];
        
        seatData.lockedSeats?.forEach(lock => {
          if (lock.isLockedByCurrentUser) {
            lockedByMe.push(lock.seatNumber);
          } else {
            lockedByOthers.push(lock.seatNumber);
          }
        });
        
        setLockedSeats(lockedByOthers);
        setMyLockedSeats(lockedByMe);
        
        // If we have seats locked by current user, restore selection
        if (lockedByMe.length > 0) {
          setSelectedSeats(lockedByMe);
        }
        
        isInitialLoad.current = false;
      } catch (error) {
        console.error("Error fetching seat status:", error);
        // Handle network errors gracefully
        if (error.response?.status === 401) {
          alert('Session expired. Please login again.');
          navigate('/sign-in');
        }
      } finally {
        setIsLoading(false);
      }
    }
  }, [hall.showId, getSeatStatusAsync, setBookedSeats, setLockedSeats, setMyLockedSeats, navigate]);

  useEffect(() => {
    getSeatStatus();
  }, [getSeatStatus]);

  // Lock seats when selection changes
  useEffect(() => {
    const lockSeats = async () => {
      if (selectedSeats.length > 0 && hall.showId) {
        try {
          await lockSeatsAsync({ showId: hall.showId, seatNumbers: selectedSeats });
          
          // Set a timer to unlock seats after 9.5 minutes (before the 10-minute expiry)
          if (lockTimer) {
            clearTimeout(lockTimer);
          }
          
          const timer = setTimeout(async () => {
            // Auto-unlock if user hasn't proceeded to checkout
            try {
              await unlockSeatsAsync({ showId: hall.showId });
              setSelectedSeats([]);
              alert('Your seat selection has expired. Please select seats again.');
            } catch (error) {
              console.error("Error auto-unlocking seats:", error);
            }
          }, 9.5 * 60 * 1000);
          
          setLockTimer(timer);
        } catch (error) {
          console.error("Error locking seats:", error);
          if (error.response?.status === 409) {
            alert(error.response.data.error || 'Some seats are no longer available. Please select different seats.');
            // Remove the conflicting seats from selection
            if (error.response.data.lockedSeats) {
              setSelectedSeats(prev => prev.filter(s => !error.response.data.lockedSeats.includes(s)));
            }
            if (error.response.data.bookedSeats) {
              setSelectedSeats(prev => prev.filter(s => !error.response.data.bookedSeats.includes(s)));
            }
          } else if (error.response?.status === 401) {
            alert('Session expired. Please login again.');
            navigate('/sign-in');
          } else {
            // Network error or other issue
            alert('Unable to lock seats. Please check your connection and try again.');
            setSelectedSeats([]);
          }
        }
      } else if (selectedSeats.length === 0 && hall.showId && !isInitialLoad.current) {
        // Unlock seats when selection is cleared
        try {
          await unlockSeatsAsync({ showId: hall.showId });
          if (lockTimer) {
            clearTimeout(lockTimer);
            setLockTimer(null);
          }
        } catch (error) {
          console.error("Error unlocking seats:", error);
          // Don't show alert for unlock errors - it's not critical
        }
      }
    };

    lockSeats();
    
    // Cleanup on unmount
    return () => {
      if (lockTimer) {
        clearTimeout(lockTimer);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSeats, hall.showId]);

  // Cleanup locks on page leave
  useEffect(() => {
    return () => {
      if (hall.showId && !isInitialLoad.current) {
        unlockSeatsAsync({ showId: hall.showId }).catch(console.error);
      }
    };
  }, [hall.showId, unlockSeatsAsync]);
  
 
  const handlePayment = async () => {
    // Clear the auto-unlock timer since user is proceeding to checkout
    if (lockTimer) {
      clearTimeout(lockTimer);
      setLockTimer(null);
    }
    dispatch(setBookingDetails({selectedSeats, totalPrice: hall.price * selectedSeats.length}));
    navigate(`/bookShow/${hall.showId}/bookseat/checkout`);
  }

  const handleSeletedSeats = (index) => {
    return () => {
      if (selectedSeats.includes(index)) {
        setSelectedSeats(selectedSeats.filter((seat) => seat !== index));
      } else {
        setSelectedSeats([...selectedSeats, index]);
      }
    };
  };

  // Add warning before page refresh/close if seats are selected
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (selectedSeats.length > 0) {
        e.preventDefault();
        e.returnValue = 'You have selected seats. Are you sure you want to leave?';
        return e.returnValue;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [selectedSeats.length]);
  return (
    <div className="min-h-screen bg-neutral p-6">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-lg">Fetching bookings...</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Real-time Connection Indicator */}
          <div className="flex justify-end">
            <div className={`badge gap-2 ${isConnected ? 'badge-success' : 'badge-error'}`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success-content animate-pulse' : 'bg-error-content'}`}></div>
              {isConnected ? 'Live Updates Active' : 'Connecting...'}
            </div>
          </div>

          {/* Header Card */}
          <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-xl">
            <div className="card-body">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                <div>
                  <h1 className="text-4xl font-bold">{movie.title}</h1>
                  <p className="text-lg opacity-90 mt-2">
                    <span className="badge badge-lg bg-white/20 border-0 mr-2">{hall.showDate}</span>
                    <span className="badge badge-lg bg-white/20 border-0">{hall.showTiming}</span>
                  </p>
                  <p className="text-sm opacity-75 mt-1">{hall.theatreName}</p>
                </div>
                {selectedSeats.length > 0 && (
                  <div className="stats shadow bg-white/10 backdrop-blur">
                    <div className="stat place-items-center">
                      <div className="stat-title text-primary-content/70">Selected Seats</div>
                      <div className="stat-value text-2xl text-white">{selectedSeats.length}</div>
                    </div>
                    <div className="stat place-items-center">
                      <div className="stat-title text-primary-content/70">Total Amount</div>
                      <div className="stat-value text-2xl text-white">₹{hall.price * selectedSeats.length}</div>
                    </div>
                  </div>
                )}
              </div>
              
              {selectedSeats.length > 0 && (
                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-success btn-lg gap-2" onClick={() => handlePayment()}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>
                    Proceed to Checkout
                  </button>
                  <button
                    className="btn btn-outline btn-error btn-lg"
                    onClick={() => setSelectedSeats([])}
                  >
                    Clear Selection
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="card bg-neutral shadow-lg">
            <div className="card-body py-4">
              <div className="flex flex-wrap gap-6 justify-center items-center">
                <div className="flex items-center gap-2">
                  <div className="btn btn-sm btn-outline btn-base-200 pointer-events-none"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="btn btn-sm bg-success border-success pointer-events-none"></div>
                  <span className="text-sm">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="btn btn-sm bg-warning border-warning pointer-events-none"></div>
                  <span className="text-sm">Locked by Others</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="btn btn-sm btn-disabled pointer-events-none"></div>
                  <span className="text-sm">Booked</span>
                </div>
              </div>
            </div>
          </div>

          {/* Seating Layout */}
          <div className="card bg-neutral shadow-xl">
            <div className="card-body">
              {/* Seats Grid */}
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                  <div className="grid grid-cols-10 gap-3 place-items-center mb-8">
                    {[...Array(hall.seatNumber)].map((_, index) => {
                      const seatNumber = index + 1;
                      const isSelected = selectedSeats.includes(seatNumber);
                      const isBooked = bookedSeats.includes(seatNumber);
                      const isLocked = lockedSeats.includes(seatNumber);
                      
                      return (
                        <div key={index} className="relative group">
                          <button
                            className={`btn btn-sm w-12 h-12 ${
                              isSelected
                                ? 'bg-success hover:bg-success border-success text-white'
                                : isBooked
                                ? 'btn-disabled'
                                : isLocked
                                ? 'bg-warning hover:bg-warning border-warning text-white cursor-not-allowed'
                                : 'btn-outline hover:bg-success hover:border-success'
                            }`}
                            onClick={handleSeletedSeats(seatNumber)}
                            disabled={isBooked || isLocked}
                          >
                            {seatNumber}
                          </button>
                          {isBooked && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-error" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                          {isLocked && !isBooked && (
                            <div className="absolute -top-1 -right-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-warning-content" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Screen */}
                  <div className="relative">
                    <div className="bg-gradient-to-b from-base-300 to-base-200 text-center py-4 rounded-t-3xl shadow-lg">
                      <p className="text-lg font-semibold opacity-70">SCREEN</p>
                    </div>
                    <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Seats Summary */}
          {selectedSeats.length > 0 && (
            <div className="card bg-info text-info-content shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Your Selected Seats</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map((seat) => (
                    <div key={seat} className="badge badge-lg bg-white/20 border-0 gap-2">
                      Seat {seat}
                      <button 
                        onClick={() => setSelectedSeats(selectedSeats.filter(s => s !== seat))}
                        className="hover:text-error"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookSeatPage;
