package com.flight.flight_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.flight.flight_backend.model.Trajet;

public interface TrajetRepository extends JpaRepository<Trajet, Long> {

}
