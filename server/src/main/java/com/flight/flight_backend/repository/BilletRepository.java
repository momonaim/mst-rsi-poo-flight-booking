package com.flight.flight_backend.repository;

import com.flight.flight_backend.model.Billet;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BilletRepository extends JpaRepository<Billet, Long> {
    // You can add custom query methods here if needed
    List<Billet> findByReservation_Id(Long reservationId);
}
