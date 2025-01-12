package com.flight.flight_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.flight.flight_backend.exeption.NotFound;
import com.flight.flight_backend.model.Ville;
import com.flight.flight_backend.repository.VilleRepository;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
public class VilleController {

    @Autowired
    private VilleRepository villeRepository;

    // Create a new Ville
    @PostMapping("/ville")
    Ville newVille(@RequestBody Ville newVille) {
        return villeRepository.save(newVille);
    }

    // Get all Villes
    @GetMapping("/villes")
    List<Ville> getAllVilles() {
        return villeRepository.findAll();
    }

    // Get a Ville by ID
    @GetMapping("/ville/{id}")
    Ville getVilleById(@PathVariable Long id) {
        return villeRepository.findById(id)
                .orElseThrow(() -> new NotFound("VILLE", id));
    }

    // Update a Ville
    @PutMapping("/ville/{id}")
    Ville updateVille(@RequestBody Ville newVille, @PathVariable Long id) {
        return villeRepository.findById(id)
                .map(ville -> {
                    ville.setNom(newVille.getNom());
                    ville.setLatitude(newVille.getLatitude());
                    ville.setLongitude(newVille.getLongitude());
                    return villeRepository.save(ville);
                }).orElseThrow(() -> new NotFound("VILLE", id));
    }

    // Delete a Ville
    @DeleteMapping("/ville/{id}")
    String deleteVille(@PathVariable Long id) {
        if (!villeRepository.existsById(id)) {
            throw new NotFound("VILLE", id);
        }
        villeRepository.deleteById(id);
        return "Ville with id " + id + " has been deleted successfully.";
    }
}
