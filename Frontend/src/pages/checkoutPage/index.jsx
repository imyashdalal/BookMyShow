import { useSelector, useDispatch } from 'react-redux';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { load } from '@cashfreepayments/cashfree-js';
import { apiInstance } from '../../api';
import { setOrderID } from '../../store/slices/bookingSlice';

const CheckOutPage = () => {
  const movie = useSelector((state) => state.movie);
  const hall = useSelector((state) => state.hall);
  const booking = useSelector((state) => state.booking);
  const [convenienceFees, setConvenienceFees] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  let cashfree;
var initializeSDK = async function () {          
    cashfree = await load({
        mode: "sandbox"
    });
};
initializeSDK();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You need to be logged in to access the checkout page. Please sign in to continue.');
      navigate('/sign-in', { state: { returnUrl: '/checkout' } });
      return;
    }

    if (booking.selectedSeats.length === 0) {
      navigate('/explore');
    }
    if (movie._id === null) {
      navigate('/explore');
    }
    if (hall.showId === null) {
      navigate('/explore');
    }

    setConvenienceFees(30);
  }, [booking.selectedSeats.length, movie._id, hall.showId, navigate]);

  const orderIdRef = useRef('');

  const getSessionId = async () => {
    try {
      const totalPrice =
        Number.parseFloat(booking.totalPrice) +
        Number.parseFloat(convenienceFees) +
        Number.parseFloat(convenienceFees * 0.18);
      const formattedTotalPrice = totalPrice.toFixed(2);
      let res = await apiInstance.post(`/booking/create`, {
        showId: hall.showId,
        seatNumber: booking.selectedSeats,
        totalPrice: formattedTotalPrice,
      });

      if (res.data && res.data.payment_session_id) {
        console.log('/payment response', res.data);
        orderIdRef.current = res.data.order_id;
        return res.data.payment_session_id;
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        alert('You need to be logged in to complete this booking. Please sign in to continue.');
        navigate('/sign-in', { state: { returnUrl: '/checkout' } });
      } else if (error.response?.status === 409) {
        alert('Selected seats are no longer available. Returning to seat selection.');
        navigate(-1);
      } else {
        alert('Unable to initiate payment. Please try again.');
      }
      throw error;
    }
  };

  const verifyPayment = async (orderIdRef) => {
    try {
      console.log("in verify payment")
      dispatch(setOrderID({ orderId: orderIdRef }));
      let res = await apiInstance.post(`/booking/verify-payment`, {
        showId: hall.showId,
        orderId: orderIdRef,
        seatNumber: booking.selectedSeats,
      });
      if (res && res.data) {
        console.log('payment verified', res.data);
        if (res.data.order_status === 'PAID') navigate('/success');
        else navigate('/failure');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      let sessionId = await getSessionId();
      console.log('sessionId', sessionId);
      let checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_modal",
    };

      cashfree.checkout(checkoutOptions).then((res) => {
        console.log('payment initialized');
        verifyPayment(orderIdRef.current);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-neutral p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold">Checkout</h1>
          <p className="text-secondary mt-2">Review your booking details and complete payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Details - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Movie & Theatre Info Card */}
            <div className="card bg-neutral shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">Booking Details</h2>
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Movie Poster */}
                  <div className="avatar">
                    <div className="w-40 rounded-xl shadow-lg">
                      <img
                        src={movie.imageURL}
                        alt={movie.title}
                      />
                    </div>
                  </div>

                  {/* Movie Details */}
                  <div className="flex-1 space-y-3">
                    <h3 className="text-3xl font-bold">{movie.title}</h3>
                    
                    <div className="flex flex-wrap gap-2">
                      <div className="badge badge-primary badge-lg">
                        {movie.language}
                      </div>
                      <div className="badge badge-secondary badge-lg">
                        {movie.durationInMinutes} min
                      </div>
                    </div>

                    <div className="divider my-2"></div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                        <span className="font-semibold">Theatre:</span>
                        <span>{hall.theatreName}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-secondary">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        <span className="font-semibold">Date:</span>
                        <span>{hall.showDate}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-accent">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold">Time:</span>
                        <span>{hall.showTiming}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Seats */}
                <div className="divider"></div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                    </svg>
                    Selected Seats ({booking.selectedSeats.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {booking.selectedSeats.map((seat, index) => (
                      <div key={index} className="badge badge-lg badge-primary">
                        Seat {seat}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary - Right Column */}
          <div className="lg:col-span-1">
            <div className="card bg-neutral shadow-xl sticky top-6">
              <div className="card-body">
                <h2 className="card-title text-xl mb-4">Payment Summary</h2>
                
                <div className="space-y-3">
                  {/* Ticket Price */}
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">
                      Ticket Price × {booking.selectedSeats.length}
                    </span>
                    <span className="font-semibold">
                      ₹{Number.parseFloat(booking.totalPrice).toFixed(2)}
                    </span>
                  </div>

                  {/* Convenience Fees with Collapse */}
                  <div className="collapse collapse-arrow bg-neutral rounded-lg">
                    <input type="checkbox" /> 
                    <div className="collapse-title font-medium px-4 py-3 min-h-0">
                      <div className="flex justify-between items-center">
                        <span className="text-secondary">Convenience Fees</span>
                        <span className="font-semibold">
                          ₹{Number.parseFloat(
                            convenienceFees + convenienceFees * 0.18
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="collapse-content px-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Base Fee</span>
                          <span>₹{Number.parseFloat(convenienceFees).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>CGST (9%)</span>
                          <span>₹{Number.parseFloat(convenienceFees * 0.09).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>SGST (9%)</span>
                          <span>₹{Number.parseFloat(convenienceFees * 0.09).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="divider my-2"></div>

                  {/* Total */}
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-primary text-2xl">
                      ₹{Number.parseFloat(
                        booking.totalPrice +
                          (convenienceFees + convenienceFees * 0.18)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="divider"></div>

                {/* Payment Button */}
                <button
                  className="btn btn-primary btn-lg w-full gap-2"
                  onClick={(e) => handlePayment(e)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  Proceed to Pay
                </button>

                {/* Security Info */}
                <div className="alert alert-info mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-xs">Your payment is secured by Cashfree Payments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOutPage;
