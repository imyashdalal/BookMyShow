const {
    bookingCreationValidationSchema,
    verifyPaymentValidationSchema,
    createBookingValidationSchema,
    lockSeatsValidationSchema,
    unlockSeatsValidationSchema,
    seatStatusValidationSchema,
} = require('../lib/validators/booking.validator');
const Show = require('../models/theatre-hall-movie-mapping');
const User = require('../models/user.model');
const Hall = require('../models/theatre-halls.model');
const Booking = require('../models/booking.model');
const SeatLock = require('../models/seat-lock.model');
const axios = require('axios');
const { hash, createId } = require('../utils/hash');
const { emitSeatsLocked, emitSeatsUnlocked, emitSeatsBooked, emitSeatStatusUpdate } = require('../utils/socket');
// const {Cashfree} = require('cashfree-pg');
// import { Cashfree } from "cashfree-pg"; 

ClientId = process.env.CASHFREE_CLIENT_ID;
ClientSecret = process.env.CASHFREE_CLIENT_SECRET;

// Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID;
// Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET;
// Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

async function handleCreateBooking(req, res) {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const user = await User.findById(req.user._id).select({
        firstname: true,
        lastname: true,
        email: true,
        role: true,
    });

    const order_expiry_time = new Date(Date.now() + 5.8 * 60 * 60 * 1000)
        .toISOString()
        .replace(/\.\d+Z/, '+05:30');

    const orderId = await createId();

    const validationResult =
        await bookingCreationValidationSchema.safeParseAsync(req.body);

    if (validationResult.error)
        return res.status(400).json({ error: validationResult.error });

    const { seatNumbers, showId, totalPrice } = validationResult.data;
    console.log('totalPrice', totalPrice);
    console.log(typeof totalPrice);

    const show = await Show.findById(showId);

    if (!show) return res.status(400).json({ error: 'Invalid Show' });

    const hall = await Hall.findById(show.theatreHallId);

    if (!hall) return res.status(400).json({ error: 'Invalid Hall' });

    try {
        let request = {
            method: 'POST',
            url: 'https://sandbox.cashfree.com/pg/orders',
            headers: {
            accept: 'application/json',
            'x-api-version': '2023-08-01',
            'content-type': 'application/json',
            'x-client-id': ClientId,
            'x-client-secret': ClientSecret,
            },
            data: {
            customer_details: {
                customer_id: user._id,
                customer_phone: '9999999999',
                customer_email: user.email,
                customer_name: `${user.firstname} ${user.lastname}`,
            },
            order_id: orderId,
            order_amount: Number(totalPrice),
            order_currency: 'INR',
            order_expiry_time: order_expiry_time,
            },
        };

        axios
            .request(request)
            .then((response) => {
                console.log('/payment response', response.data);
                res.json(response.data);
            })
            .catch((error) => {
                console.error('payment error', error.response.data.message);
            });
    } catch (error) {
        console.log(error);
    }

    // var requestPayment = {
    //     "order_amount": Number(totalPrice),
    //     "order_currency": "INR",
    //     "order_id": orderId,
    //     "customer_details": {
    //         "customer_id": user._id,
    //         "customer_phone": "8474090589",
    //         "customer_name": `${user.firstname} ${user.lastname}`,
    //         "customer_email": user.email
    //     },
    //     "order_meta": {
    //         "return_url": "https://www.cashfree.com/devstudio/preview/pg/web/popupCheckout?order_id={order_id}",
    //         "payment_methods": "cc,dc,upi"
    //     },
    //     "order_expiry_time": order_expiry_time
    // };

    // Cashfree.PGCreateOrder("2023-08-01", requestPayment).then((response) => {
    //     console.log('Order created successfully:',response.data);
    //     res.json(response.data)
    // }).catch((error) => {
    //     console.error('Error:', error.response.data.message);
    //     res.status(400).json('Error', error)
    // });


}

async function verifyPayment(req, res) {
    const validationResult = await verifyPaymentValidationSchema.safeParseAsync(
        req.body
    );

    if (validationResult.error)
        return res.status(400).json({ error: validationResult.error });

    

    const { showId, orderId, seatNumber } = validationResult.data;

    try {
        let request = {
            method: 'GET',
            url: `https://sandbox.cashfree.com/pg/orders/${orderId}`,
            headers: {
                accept: 'application/json',
                'x-api-version': '2023-08-01',
                'x-client-id': ClientId,
                'x-client-secret': ClientSecret,
            },
        };

        axios
            .request(request)
            .then((response) => {
                console.log('/verify response', response.data);
                res.json(response.data);
            })
            .catch((error) => {
                console.error('payment error', error.response.data.message);
            });
    } catch (error) {
        console.log(error);
    }
}

async function createBooking(req, res) {
    const validateResult = await createBookingValidationSchema.safeParseAsync(req.body);
    if (validateResult.error) return res.status(400).json({ error: validateResult.error });
    const {showId, seatNumber, paymentId} = validateResult.data;

    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const userId = req.user._id;

    try {
        // Check if any seats are already booked (race condition protection)
        const existingBookings = await Booking.find({
            showId,
            seatNumber: { $in: seatNumber }
        }).select('seatNumber');

        if (existingBookings.length > 0) {
            const bookedSeatNumbers = existingBookings.map(b => b.seatNumber);
            return res.status(409).json({ 
                error: 'Some seats are already booked',
                bookedSeats: bookedSeatNumbers
            });
        }

        // Create bookings
        const bookings = [];
        for (const seat of seatNumber) {
            try {
                const booking = await Booking.create({
                    showId, 
                    seatNumber: seat, 
                    paymentId, 
                    gateway: 'CASHFREE', 
                    userId
                });
                bookings.push(booking);
            } catch (error) {
                // Handle duplicate key error (race condition)
                if (error.code === 11000) {
                    console.error(`Seat ${seat} already booked during creation`);
                    // Rollback: delete successfully created bookings
                    if (bookings.length > 0) {
                        await Booking.deleteMany({
                            _id: { $in: bookings.map(b => b._id) }
                        });
                    }
                    return res.status(409).json({
                        error: 'Seat booking conflict. Please try again.',
                        conflictingSeat: seat
                    });
                }
                throw error; // Re-throw other errors
            }
        }
        
        // After successful booking, unlock the seats
        await SeatLock.deleteMany({ showId, userId });
        
        // Emit socket event for seats booked
        const io = req.app.get('io');
        if (io) {
            emitSeatsBooked(io, showId, seatNumber, userId.toString());
        }
        
        res.status(201).json({message: 'Booking created successfully'});
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({error: 'Internal server error'});
    }
    
}

async function getShowBooking(req, res) {
    const showId = req.body.showId;
    const bookings = await Booking.find({showId: showId});
    res.status(200).json(bookings);
}

async function getUserBookings(req, res) {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    
    try {
        const bookings = await Booking.find({ userId: req.user._id })
            .populate({
                path: 'showId',
                populate: [
                    {
                        path: 'movieId',
                        select: 'title imageURL language durationInMinutes'
                    },
                    {
                        path: 'theatreHallId',
                        populate: {
                            path: 'theatreId',
                            select: 'name plot street city state pincode'
                        }
                    }
                ]
            })
            .sort({ createdAt: -1 });
        
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
}

async function lockSeats(req, res) {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    
    const validationResult = await lockSeatsValidationSchema.safeParseAsync(req.body);
    if (validationResult.error)
        return res.status(400).json({ error: validationResult.error.errors });
    
    const { showId, seatNumbers } = validationResult.data;
    
    const userId = req.user._id;
    const lockDuration = 10 * 60 * 1000; // 10 minutes in milliseconds
    const expiresAt = new Date(Date.now() + lockDuration);
    
    try {
        // Check if any seats are already booked
        const bookedSeats = await Booking.find({
            showId,
            seatNumber: { $in: seatNumbers }
        }).select('seatNumber');
        
        if (bookedSeats.length > 0) {
            const bookedSeatNumbers = bookedSeats.map(b => b.seatNumber);
            return res.status(409).json({ 
                error: 'Some seats are already booked',
                bookedSeats: bookedSeatNumbers
            });
        }
        
        // Check if any seats are locked by other users
        const existingLocks = await SeatLock.find({
            showId,
            seatNumber: { $in: seatNumbers },
            userId: { $ne: userId },
            expiresAt: { $gt: new Date() }
        }).select('seatNumber userId');
        
        if (existingLocks.length > 0) {
            const lockedSeatNumbers = existingLocks.map(l => l.seatNumber);
            return res.status(409).json({ 
                error: 'Some seats are locked by other users',
                lockedSeats: lockedSeatNumbers
            });
        }
        
        // Remove any existing locks by this user for this show
        await SeatLock.deleteMany({ showId, userId });
        
        // Create new locks (or update existing ones)
        const locks = seatNumbers.map(seatNumber => ({
            showId,
            seatNumber,
            userId,
            expiresAt
        }));
        
        // Use bulkWrite for better performance and atomic updates
        const bulkOps = locks.map(lock => ({
            updateOne: {
                filter: { showId: lock.showId, seatNumber: lock.seatNumber },
                update: { $set: lock },
                upsert: true
            }
        }));
        
        await SeatLock.bulkWrite(bulkOps);
        
        // Emit socket event to all clients watching this show
        const io = req.app.get('io');
        if (io) {
            emitSeatsLocked(io, showId, seatNumbers, userId.toString());
        }
        
        res.status(200).json({ 
            message: 'Seats locked successfully',
            expiresAt,
            lockedSeats: seatNumbers
        });
    } catch (error) {
        console.error('Error locking seats:', error);
        if (error.code === 11000) {
            // Duplicate key error - seat already locked
            return res.status(409).json({ error: 'One or more seats are already locked' });
        }
        res.status(500).json({ error: 'Failed to lock seats' });
    }
}

async function unlockSeats(req, res) {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    
    const validationResult = await unlockSeatsValidationSchema.safeParseAsync(req.body);
    if (validationResult.error)
        return res.status(400).json({ error: validationResult.error.errors });
    
    const { showId, seatNumbers } = validationResult.data;
    
    const userId = req.user._id;
    
    try {
        // Get seats that will be unlocked before deleting
        const seatsToUnlock = await SeatLock.find({ 
            showId, 
            userId 
        }).select('seatNumber');
        
        const unlockedSeatNumbers = seatsToUnlock.map(s => s.seatNumber);
        
        // If specific seats provided, only unlock those
        let result;
        if (seatNumbers && Array.isArray(seatNumbers)) {
            result = await SeatLock.deleteMany({ 
                showId, 
                userId, 
                seatNumber: { $in: seatNumbers } 
            });
        } else {
            result = await SeatLock.deleteMany({ showId, userId });
        }
        
        // Emit socket event if seats were unlocked
        if (result.deletedCount > 0) {
            const io = req.app.get('io');
            if (io) {
                const seatsUnlocked = seatNumbers || unlockedSeatNumbers;
                emitSeatsUnlocked(io, showId, seatsUnlocked, userId.toString());
            }
        }
        
        res.status(200).json({ 
            message: 'Seats unlocked successfully',
            unlockedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Error unlocking seats:', error);
        // Return success even on error to prevent blocking user flow
        res.status(200).json({ 
            message: 'Unlock attempted',
            unlockedCount: 0
        });
    }
}

async function getLockedAndBookedSeats(req, res) {
    const validationResult = await seatStatusValidationSchema.safeParseAsync(req.body);
    if (validationResult.error)
        return res.status(400).json({ error: validationResult.error.errors });
    
    const { showId } = validationResult.data;
    
    try {
        // Get booked seats
        const bookings = await Booking.find({ showId }).select('seatNumber');
        const bookedSeats = bookings.map(b => b.seatNumber);
        
        // Get locked seats (excluding expired ones)
        const locks = await SeatLock.find({ 
            showId,
            expiresAt: { $gt: new Date() }
        }).select('seatNumber userId');
        
        const lockedSeats = locks.map(l => ({
            seatNumber: l.seatNumber,
            isLockedByCurrentUser: req.user ? l.userId.toString() === req.user._id.toString() : false
        }));
        
        res.status(200).json({
            bookedSeats,
            lockedSeats
        });
    } catch (error) {
        console.error('Error fetching seat status:', error);
        res.status(500).json({ error: 'Failed to fetch seat status' });
    }
}

module.exports = { 
    handleCreateBooking, 
    verifyPayment, 
    createBooking, 
    getShowBooking, 
    getUserBookings,
    lockSeats,
    unlockSeats,
    getLockedAndBookedSeats
};
