import { useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUnlockSeats } from '../../../hooks/booking.hooks';

const OnFailure = () => {
    const movie = useSelector((state) => state.movie)
    const hall = useSelector((state) => state.hall);
    const booking = useSelector((state) => state.booking);
    const location = useSelector((state) => state.location) 
    const navigate = useNavigate();
    const { mutateAsync: unlockSeatsAsync } = useUnlockSeats();

    useEffect(() => {
        // Unlock seats when payment fails
        if (hall.showId) {
            unlockSeatsAsync({ showId: hall.showId }).catch(console.error);
        }
    }, [hall.showId, unlockSeatsAsync]);

    const handleRetryBooking = () => {
        navigate(`/${location.location}/movies/${movie._id}/bookShow`)
    }

    return (
        <div className="min-h-screen bg-base-100 flex justify-center items-center p-6">
            <div className="w-full max-w-3xl">
                {/* Error Animation Header */}
                <div className="text-center mb-8">
                    <div className="inline-block">
                        <div className="bg-error rounded-full p-6 mb-4 animate-pulse">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-error-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-error mb-2">Payment Failed!</h1>
                    <p className="text-base-content/70">Unfortunately, your payment could not be processed</p>
                </div>

                {/* Failure Details Card */}
                <div className="card bg-base-100 shadow-2xl border border-error/20">
                    <div className="card-body">
                        {/* What Went Wrong */}
                        <div className="alert alert-error mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <div className="font-bold">Transaction Declined</div>
                                <div className="text-sm">Your payment was not successful. Please try again or use a different payment method.</div>
                            </div>
                        </div>

                        {/* Booking Summary */}
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-4">Attempted Booking Details</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-base-200 p-4 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="bg-error/10 p-2 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-xs text-base-content/60 uppercase font-semibold">Movie</div>
                                        <div className="font-semibold">{movie.title}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="bg-error/10 p-2 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-xs text-base-content/60 uppercase font-semibold">Theatre</div>
                                        <div className="font-semibold">{hall.theatreName}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="bg-error/10 p-2 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-xs text-base-content/60 uppercase font-semibold">Date & Time</div>
                                        <div className="font-semibold">{hall.showDate} • {hall.showTiming}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="bg-error/10 p-2 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-xs text-base-content/60 uppercase font-semibold">Seats</div>
                                        <div className="font-semibold">{booking.selectedSeats.join(', ')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="divider"></div>

                        {/* Refund Information */}
                        <div className="alert alert-warning mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div>
                                <div className="font-bold">Refund Policy</div>
                                <div className="text-sm">If any amount was deducted from your account, it will be automatically refunded to the source within 5-7 business days.</div>
                            </div>
                        </div>

                        {/* Common Reasons */}
                        <div className="mb-6">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Common Reasons for Payment Failure
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-base-content/70 ml-7">
                                <li>Insufficient balance in your account</li>
                                <li>Incorrect card details or CVV</li>
                                <li>Payment gateway timeout or network issues</li>
                                <li>Card declined by your bank</li>
                                <li>Daily transaction limit exceeded</li>
                            </ul>
                        </div>

                        <div className="divider"></div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button 
                                className="btn btn-error btn-lg gap-2"
                                onClick={handleRetryBooking}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Try Again
                            </button>
                            <button 
                                className="btn btn-outline btn-lg gap-2"
                                onClick={() => navigate('/explore')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Browse Movies
                            </button>
                            <button 
                                className="btn btn-ghost btn-lg gap-2"
                                onClick={() => navigate('/dashboard')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Go to Dashboard
                            </button>
                        </div>

                        {/* Help Section */}
                        <div className="alert mt-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <div>
                                <div className="font-semibold">Need Help?</div>
                                <div className="text-sm">If you continue to face issues, please contact our support team or try a different payment method.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OnFailure;