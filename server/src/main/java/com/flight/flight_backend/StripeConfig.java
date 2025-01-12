package com.flight.flight_backend;

import com.stripe.Stripe;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StripeConfig {
    public void init() {
        Stripe.apiKey = "STRIPE_API_SECRET_KEY";
    }
}
