package com.flight.flight_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.flight.flight_backend.model.Ville;

public interface VilleRepository extends JpaRepository<Ville, Long> {
    Optional<Ville> findByNom(String nom);
}
