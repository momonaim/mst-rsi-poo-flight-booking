package com.flight.flight_backend.repository;

import com.flight.flight_backend.model.Reservation;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // Custom queries can be added here if needed
    List<Reservation> findByUserId(Long userId);
}
