import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ContextProvider from './context/ContextProvider';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe('STRIPE_API_PUBLIC_KEY');
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ContextProvider>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </ContextProvider>
);

