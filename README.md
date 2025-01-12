# Stripe API Key Configuration

To properly configure Stripe for this project, update the secret and public keys in the following files:

## Backend (Secret Key)

The Stripe secret key must be updated in these files:

1. **`server/src/main/java/com/flight/flight_backend/StripeConfig.java`**
   - Look for the line:
     ```java
     Stripe.apiKey = "STRIPE_API_SECRET_KEY";
     ```
     Replace `"STRIPE_API_SECRET_KEY"` with your actual Stripe secret key.

2. **`server/src/main/java/com/flight/flight_backend/controller/PaymentController.java`**
   - Ensure the secret key reference is updated as needed in any method that interacts with Stripe.

## Frontend (Public Key)

The Stripe public key must be updated in:

1. **`client/src/index.js`**
   - Look for the line:
     ```javascript
     const stripePromise = loadStripe('STRIPE_API_PUBLIC_KEY');
     ```
     Replace `'STRIPE_API_PUBLIC_KEY'` with your actual Stripe public key.
