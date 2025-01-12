package com.flight.flight_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.flight.flight_backend.model.ClassPassager;
import com.flight.flight_backend.repository.ClassPassagerRepository;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/classes")
public class ClassPassagerController {

    @Autowired
    private ClassPassagerRepository classPassagerRepository;

    // Obtenir toutes les classes de passagers
    @GetMapping
    public ResponseEntity<List<ClassPassager>> getAllClassPassagers() {
        List<ClassPassager> classPassagers = classPassagerRepository.findAll();
        return ResponseEntity.ok(classPassagers);
    }

    // Obtenir une classe de passager par ID
    @GetMapping("/{id}")
    public ResponseEntity<ClassPassager> getClassPassagerById(@PathVariable Long id) {
        Optional<ClassPassager> classPassager = classPassagerRepository.findById(id);
        return classPassager.map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Ajouter une nouvelle classe de passager
    @PostMapping
    public ResponseEntity<ClassPassager> createClassPassager(@RequestBody ClassPassager classPassager) {
        ClassPassager savedClassPassager = classPassagerRepository.save(classPassager);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedClassPassager);
    }

    // Mettre à jour une classe de passager existante
    @PutMapping("/{id}")
    public ResponseEntity<ClassPassager> updateClassPassager(
            @PathVariable Long id, @RequestBody ClassPassager updatedClassPassager) {
        Optional<ClassPassager> existingClassPassager = classPassagerRepository.findById(id);

        if (existingClassPassager.isPresent()) {
            updatedClassPassager.setId(id);
            ClassPassager savedClassPassager = classPassagerRepository.save(updatedClassPassager);
            return ResponseEntity.ok(savedClassPassager);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Supprimer une classe de passager
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClassPassager(@PathVariable Long id) {
        if (classPassagerRepository.existsById(id)) {
            classPassagerRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
