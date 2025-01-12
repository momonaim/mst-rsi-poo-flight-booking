package com.flight.flight_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.flight.flight_backend.model.ClassPassager;

public interface ClassPassagerRepository extends JpaRepository<ClassPassager, Long> {
    // Vous pouvez ajouter des méthodes personnalisées ici si nécessaire
}
