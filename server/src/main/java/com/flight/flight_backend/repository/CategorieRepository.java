package com.flight.flight_backend.repository;

import com.flight.flight_backend.model.Categorie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategorieRepository extends JpaRepository<Categorie, Long> {
}
