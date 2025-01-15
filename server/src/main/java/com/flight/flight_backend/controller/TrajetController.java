package com.flight.flight_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.flight.flight_backend.exeption.NotFound;
import com.flight.flight_backend.model.Trajet;
import com.flight.flight_backend.model.Ville;
import com.flight.flight_backend.repository.TrajetRepository;
import com.flight.flight_backend.repository.VilleRepository;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("http://localhost:3000")
public class TrajetController {

    @Autowired
    private TrajetRepository trajetRepository;

    @Autowired
    private VilleRepository villeRepository;

    @PostMapping("/trajet")
    public Trajet newTrajet(@RequestBody Trajet newTrajet) {
        Optional<Ville> departVille = villeRepository.findByNom(newTrajet.getVilleDepart());
        Optional<Ville> arriveeVille = villeRepository.findByNom(newTrajet.getVilleArrivee());

        if (departVille.isPresent() && arriveeVille.isPresent()) {
            // Calculate distance using the Haversine formula
            double distance = calculateDistance(departVille.get(), arriveeVille.get());
            String formattedDistance = String.format("%.2f", distance);
            formattedDistance.replace(",", ".");

            double vitesseAvion = 800.0; // en km/h
            System.out.println(distance + " km" + formattedDistance);

            // Calculez la durée en heures
            double dureeHeures = distance / vitesseAvion;

            // Convertir la durée en minutes si nécessaire
            double dureeMinutes = dureeHeures * 60;
            newTrajet.setDistance(distance);
            newTrajet.setDuree(dureeMinutes);
        } else {
            // Handle case where one of the Ville objects is not found
            throw new RuntimeException("Ville not found");
        }
        return trajetRepository.save(newTrajet);
    }

    @GetMapping("/trajets")
    public List<Trajet> getAllTrajets() {
        return trajetRepository.findAll();
    }

    @GetMapping("/trajet/{id}")
    public Trajet getTrajetById(@PathVariable Long id) {
        return trajetRepository.findById(id)
                .orElseThrow(() -> new NotFound("TRAJET", id));
    }

    @PutMapping("/trajet/{id}")
    public Trajet updateTrajet(@RequestBody Trajet newTrajet, @PathVariable Long id) {
        return trajetRepository.findById(id)
                .map(trajet -> {
                    trajet.setVilleDepart(newTrajet.getVilleDepart());
                    trajet.setVilleArrivee(newTrajet.getVilleArrivee());
                    return trajetRepository.save(trajet);
                }).orElseThrow(() -> new NotFound("TRAJET", id));
    }

    @DeleteMapping("/trajet/{id}")
    public String deleteTrajet(@PathVariable Long id) {
        if (!trajetRepository.existsById(id)) {
            throw new NotFound("TRAJET", id);
        }
        trajetRepository.deleteById(id);
        return "Trajet with id " + id + " has been deleted successfully.";
    }

    // Haversine formula to calculate the distance
    private double calculateDistance(Ville villeDepart, Ville villeArrivee) {
        final double R = 6371; // Radius of the Earth in km
        double lat1 = Math.toRadians(villeDepart.getLatitude());
        double lon1 = Math.toRadians(villeDepart.getLongitude());
        double lat2 = Math.toRadians(villeArrivee.getLatitude());
        double lon2 = Math.toRadians(villeArrivee.getLongitude());

        double dlat = lat2 - lat1;
        double dlon = lon2 - lon1;

        double a = Math.sin(dlat / 2) * Math.sin(dlat / 2) +
                Math.cos(lat1) * Math.cos(lat2) *
                        Math.sin(dlon / 2) * Math.sin(dlon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }
}
