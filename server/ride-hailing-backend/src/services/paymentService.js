const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/booking');
const User = require('../models/user');

class PaymentService {
    async createPaymentIntent(amount, currency = 'usd') {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency,
                payment_method_types: ['card'],
            });
            return paymentIntent;
        } catch (error) {
            throw new Error('Payment Intent Creation Failed: ' + error.message);
        }
    }

    async confirmPayment(paymentIntentId) {
        try {
            const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
            return paymentIntent;
        } catch (error) {
            throw new Error('Payment Confirmation Failed: ' + error.message);
        }
    }

    async processPayment(bookingId, paymentMethodId) {
        const booking = await Booking.findById(bookingId).populate('user_id');
        if (!booking) {
            throw new Error('Booking not found');
        }

        const amount = Math.round(booking.fare * 100); // Convert to cents
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency: 'usd',
                payment_method: paymentMethodId,
                confirmation_method: 'manual',
                confirm: true,
            });

            booking.payment_status = 'paid';
            await booking.save();
            return paymentIntent;
        } catch (error) {
            booking.payment_status = 'failed';
            await booking.save();
            throw new Error('Payment Processing Failed: ' + error.message);
        }
    }

    async refundPayment(paymentIntentId) {
        try {
            const refund = await stripe.refunds.create({
                payment_intent: paymentIntentId,
            });
            return refund;
        } catch (error) {
            throw new Error('Refund Failed: ' + error.message);
        }
    }
}

module.exports = new PaymentService();