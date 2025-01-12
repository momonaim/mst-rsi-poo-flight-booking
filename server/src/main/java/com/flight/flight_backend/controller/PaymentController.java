
package com.flight.flight_backend.controller;

import com.flight.flight_backend.model.Reservation;
import com.flight.flight_backend.repository.ReservationRepository;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private ReservationRepository reservationRepository;

    @PostMapping("/create-payment-intent")
    public Map<String, String> createPaymentIntent(@RequestBody Map<String, Object> request) {
        Stripe.apiKey = "STRIPE_API_SECRET_KEY";

        Long reservationId = Long.parseLong(request.get("reservationId").toString());
        // Récupérer la réservation à partir de la base de données
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        try {
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount((long) (reservation.getPrixTotal() * 100)) // Convertir en cents
                    .setCurrency("usd")
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);

            Map<String, String> response = new HashMap<>();
            response.put("clientSecret", intent.getClientSecret());
            response.put("reservationId", reservationId.toString()); // Ajout de l'ID de réservation à la réponse
            return response;

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/confirm-payment")
    public String confirmPayment(@RequestBody Map<String, Object> request) {
        Long reservationId = Long.parseLong(request.get("reservationId").toString());
        String paymentIntentId = request.get("paymentIntentId").toString(); // ID du PaymentIntent

        // Vérifiez le statut du PaymentIntent
        try {
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
            if ("succeeded".equals(paymentIntent.getStatus())) {
                // Mettez à jour le statut de la réservation
                Reservation reservation = reservationRepository.findById(reservationId)
                        .orElseThrow(() -> new RuntimeException("Reservation not found"));
                reservation.setStatut(true); // Mettre à jour l'attribut statut à vrai
                reservationRepository.save(reservation); // Sauvegarder les modifications
                return "Payment successful and reservation updated.";
            } else {
                return "Payment not successful.";
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}