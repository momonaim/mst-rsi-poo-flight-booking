package com.flight.flight_backend.controller;

import com.flight.flight_backend.model.Billet;
import com.flight.flight_backend.model.Reservation;
import com.flight.flight_backend.repository.BilletRepository;
import com.flight.flight_backend.repository.ReservationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/billets")
public class BilletController {

    @Autowired
    private BilletRepository billetRepository;
    @Autowired
    private ReservationRepository reservationRepository;

    @GetMapping("/reservation/{reservationId}")
    public ResponseEntity<List<Billet>> getBilletsByReservationId(@PathVariable Long reservationId) {
        List<Billet> billets = billetRepository.findByReservation_Id(reservationId);
        if (billets.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(billets);
        }
    }

    @GetMapping
    public List<Billet> getAllBillets() {
        return billetRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Billet> getBilletById(@PathVariable Long id) {
        Optional<Billet> billet = billetRepository.findById(id);
        return billet.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Billet createBillet(@RequestBody Billet billet, @RequestParam Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        // Set the found reservation to the billet
        billet.setReservation(reservation);
        return billetRepository.save(billet);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Billet> updateBillet(@PathVariable Long id, @RequestBody Billet updatedBillet) {
        if (billetRepository.existsById(id)) {
            updatedBillet.setId(id);
            return ResponseEntity.ok(billetRepository.save(updatedBillet));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBillet(@PathVariable Long id) {
        if (billetRepository.existsById(id)) {
            billetRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
