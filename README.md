# Flight Booking Application

This project is a flight ticket booking application that allows users to search for, book, and manage their flight reservations online.  
It also includes an admin module to manage fare categories, extract statistics, and monitor flight performance.  

## Key Features

- **Flight Search:** Find available flights based on user-selected criteria (date, departure, destination, etc.).  
- **Booking:** Reserve flights and make payments through Stripe integration.  
- **Admin Panel:** Modify or add fare categories, retrieve flight occupancy rates, and analyze customer data.  
- **Statistics:** View charts and reports for data-driven strategic decisions.  

---

## Stripe API Key Configuration

To enable payment functionality, update the Stripe API keys in the relevant files.

### Backend (Secret Key)

The Stripe secret key must be updated in the following files:  

1. **`server/src/main/java/com/flight/flight_backend/StripeConfig.java`**  
   - Locate the following line:
     ```java
     Stripe.apiKey = "STRIPE_API_SECRET_KEY";
     ```
     Replace `"STRIPE_API_SECRET_KEY"` with your actual Stripe secret key.  

2. **`server/src/main/java/com/flight/flight_backend/controller/PaymentController.java`**  
   - Ensure that the secret key is correctly referenced in all methods interacting with Stripe.  

### Frontend (Public Key)

The Stripe public key must be updated in:  

1. **`client/src/index.js`**  
   - Locate the following line:
     ```javascript
     const stripePromise = loadStripe('STRIPE_API_PUBLIC_KEY');
     ```
     Replace `'STRIPE_API_PUBLIC_KEY'` with your actual Stripe public key.  

---

## Important Notes

- **Security:** Never expose the secret key on the frontend. Use environment variables to securely store the API keys, especially in a production environment.  
- **Stripe Documentation:** For more information about managing API keys, refer to the [official Stripe documentation](https://stripe.com/docs/api).  

---

## Technologies Used

- **Frontend:** React with Material-UI for the user interface.  
- **Backend:** Spring Boot for handling services and REST APIs.  
- **Database:** MySQL for storing flight, customer, and reservation data.  
- **Payment:** Stripe integration for seamless payment management.  

## Contribution

Contributions are welcome! If you'd like to participate, feel free to open an issue or submit a pull request.

---

Thank you for your interest in this flight booking project. 🚀  
