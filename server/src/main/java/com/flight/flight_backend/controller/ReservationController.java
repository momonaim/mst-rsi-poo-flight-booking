package com.flight.flight_backend.controller;

import com.flight.flight_backend.model.Reservation;
import com.flight.flight_backend.model.Vol;
import com.flight.flight_backend.model.Utilisateur;
import com.flight.flight_backend.repository.ReservationRepository;
import com.flight.flight_backend.repository.UserRepository;
import com.flight.flight_backend.repository.VolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@RestController
@CrossOrigin("http://localhost:3000")
public class ReservationController {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private VolRepository volRepository; // Repository to get Vol data

    @Autowired
    private UserRepository utilisateurRepository; // Repository to get user data

    // 1. Create Reservation
    @Async
    @PostMapping("/reservations/create")
    public CompletableFuture<ResponseEntity<?>> createReservation(
            @RequestParam Long volId,
            @RequestParam Long userId,
            @RequestParam int nbrBeneficier,
            @RequestParam Boolean canceled,
            @RequestParam Boolean statut,
            @RequestParam String selectedClass,
            @RequestParam double prixTotal) throws InterruptedException {

        // Simulate a delay for testing purposes (can be removed later)
        Thread.sleep(3000);

        try {
            Vol vol = volRepository.findById(volId).orElse(null);
            Utilisateur user = utilisateurRepository.findById(userId).orElse(null);

            if (vol == null || user == null) {
                throw new IllegalArgumentException("Invalid flight or user.");
            }

            // Thread.sleep(3000);

            // Vérifier et ajuster la capacité disponible en fonction de la classe
            // sélectionnée
            synchronized (this) {
                switch (selectedClass.toLowerCase()) {
                    case "economy":
                        if (vol.getCE_dispo() < nbrBeneficier) {
                            throw new IllegalStateException(
                                    "Not enough available seats in Economy class. Please select another class");
                        }
                        vol.setCE_dispo(vol.getCE_dispo() - nbrBeneficier);
                        break;
                    case "first class":
                        if (vol.getCP_dispo() < nbrBeneficier) {
                            throw new IllegalStateException(
                                    "Not enough available seats in Premium class. Please select another class");
                        }
                        vol.setCP_dispo(vol.getCP_dispo() - nbrBeneficier);
                        break;
                    case "business":
                        if (vol.getCA_dispo() < nbrBeneficier) {
                            throw new IllegalStateException(
                                    "Not enough available seats in Business class. Please select another class");
                        }
                        vol.setCA_dispo(vol.getCA_dispo() - nbrBeneficier);
                        break;
                    default:
                        if (vol.getCE_dispo() < nbrBeneficier) {
                            throw new IllegalStateException(
                                    "Invalid class selected. Treated as Economy: Not enough available seats.");
                        }
                        vol.setCE_dispo(vol.getCE_dispo() - nbrBeneficier);
                        break;
                }

                // Save updated flight information
                volRepository.save(vol);

                // Create a new reservation
                Reservation reservation = new Reservation();
                reservation.setVol(vol);
                reservation.setUser(user);
                reservation.setNbrBeneficier(nbrBeneficier);
                reservation.setCanceled(canceled);
                reservation.setStatut(statut);
                reservation.setPrixTotal(prixTotal);

                Reservation savedReservation = reservationRepository.save(reservation);

                // Return the saved reservation
                return CompletableFuture.completedFuture(ResponseEntity.ok(savedReservation));
            }

        } catch (IllegalArgumentException | IllegalStateException ex) {
            // Handle known exceptions and return a bad request response with the error
            // message
            return CompletableFuture.completedFuture(
                    ResponseEntity.badRequest().body(ex.getMessage()));
        } catch (Exception ex) {
            // Catch any other exception and return internal server error
            return CompletableFuture.completedFuture(
                    ResponseEntity.status(500).body(ex.getMessage()));
        }
    }

    @GetMapping("/reservations/user/{userId}")
    public ResponseEntity<List<Reservation>> getReservationsByUser(@PathVariable Long userId) {
        List<Reservation> reservations = reservationRepository.findByUserId(userId);

        if (reservations.isEmpty()) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(reservations);
        }
    }

    // 2. Get Reservation by ID
    @GetMapping("/reservation/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable Long id) {
        Optional<Reservation> reservation = reservationRepository.findById(id);

        if (reservation.isPresent()) {
            return ResponseEntity.ok(reservation.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 3. Get All Reservations
    @GetMapping("/reservations")
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    // 4. Update Reservation
    @PutMapping("/reservation/{id}")
    public ResponseEntity<Reservation> updateReservation(
            @PathVariable Long id,
            @RequestParam Long volId,
            @RequestParam Long userId,
            @RequestParam int nbrBeneficier,
            @RequestParam double prixTotal) {

        Optional<Reservation> optionalReservation = reservationRepository.findById(id);

        if (!optionalReservation.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Vol vol = volRepository.findById(volId).orElse(null);
        Utilisateur user = utilisateurRepository.findById(userId).orElse(null);

        if (vol == null || user == null) {
            return ResponseEntity.badRequest().body(null);
        }

        Reservation reservation = optionalReservation.get();
        reservation.setVol(vol);
        reservation.setUser(user);
        reservation.setNbrBeneficier(nbrBeneficier);
        reservation.setPrixTotal(prixTotal);

        Reservation updatedReservation = reservationRepository.save(reservation);
        return ResponseEntity.ok(updatedReservation);
    }

    // 5. Delete Reservation
    @DeleteMapping("/reservation/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        Optional<Reservation> reservation = reservationRepository.findById(id);

        if (reservation.isPresent()) {
            reservationRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/countreservation")
    public long getNombredereservation() {

        return reservationRepository.count();
    }

    @PutMapping("/reservation/cancel/{id}")
    public ResponseEntity<Reservation> cancelReservation(@PathVariable Long id) {
        // Find the reservation by ID
        Optional<Reservation> optionalReservation = reservationRepository.findById(id);

        if (!optionalReservation.isPresent()) {
            return ResponseEntity.notFound().build(); // Return 404 if reservation is not found
        }

        // Get the reservation and update the cancellation status
        Reservation reservation = optionalReservation.get();
        reservation.setCanceled(true);

        // Save the updated reservation
        Reservation updatedReservation = reservationRepository.save(reservation);
        return ResponseEntity.ok(updatedReservation);
    }

    @PutMapping("/reservation/redo/{id}")
    public ResponseEntity<Reservation> redoReservation(@PathVariable Long id) {
        // Find the reservation by ID
        Optional<Reservation> optionalReservation = reservationRepository.findById(id);

        if (!optionalReservation.isPresent()) {
            return ResponseEntity.notFound().build(); // Return 404 if reservation is not found
        }

        // Get the reservation and update the cancellation status
        Reservation reservation = optionalReservation.get();
        reservation.setCanceled(false);

        // Save the updated reservation
        Reservation updatedReservation = reservationRepository.save(reservation);
        return ResponseEntity.ok(updatedReservation);
    }
}
