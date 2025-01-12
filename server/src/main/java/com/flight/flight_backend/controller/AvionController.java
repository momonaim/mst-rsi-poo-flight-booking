package com.flight.flight_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.flight.flight_backend.exeption.NotFound;
import com.flight.flight_backend.model.Avion;
import com.flight.flight_backend.model.TauxOccupationResponse;
import com.flight.flight_backend.model.Vol;
import com.flight.flight_backend.repository.AvionRepository;
import com.flight.flight_backend.repository.VolRepository;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
public class AvionController {

    @Autowired
    private AvionRepository avionRepository;
    @Autowired
    private VolRepository volRepository;

    @GetMapping("/countavion")
    public long getNombreAvions() {
        return avionRepository.count();
    }

    @PostMapping("/avion")
    Avion newAvion(@RequestBody Avion newAvion) {
        newAvion.setVitesse(800);
        return avionRepository.save(newAvion);
    }

    @GetMapping("/avions")
    List<Avion> getAllAvions() {
        return avionRepository.findAll();
    }

    @GetMapping("/avion/{id}")
    Avion getAvionById(@PathVariable Long id) {
        return avionRepository.findById(id)
                .orElseThrow(() -> new NotFound("AVION", id));
    }

    @PutMapping("/avion/{id}")
    Avion updateAvion(@RequestBody Avion newAvion, @PathVariable Long id) {
        return avionRepository.findById(id)
                .map(avion -> {
                    avion.setNom(newAvion.getNom());
                    avion.setVitesse(newAvion.getVitesse());
                    avion.setAutonomie(newAvion.getAutonomie());
                    avion.setCapacite_CA(newAvion.getCapacite_CA());
                    avion.setCapacite_CE(newAvion.getCapacite_CE());
                    avion.setCapacite_CP(newAvion.getCapacite_CP());
                    return avionRepository.save(avion);
                }).orElseThrow(() -> new NotFound("AVION", id));
    }

    @DeleteMapping("/avion/{id}")
    String deleteAvion(@PathVariable Long id) {
        if (!avionRepository.existsById(id)) {
            throw new NotFound("AVION", id);
        }
        avionRepository.deleteById(id);
        return "Avion with id " + id + " has been deleted success.";
    }

    @GetMapping("/taux-occupation")
    public ResponseEntity<?> getTauxOccupation(
            @RequestParam String dateDebut,
            @RequestParam String dateFin) {

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date startDate;
        Date endDate;

        try {
            startDate = dateFormat.parse(dateDebut);
            endDate = dateFormat.parse(dateFin);
        } catch (ParseException e) {
            return ResponseEntity.badRequest().body("Format de date invalide. Utilisez YYYY-MM-DD.");
        }

        // Utilise l'instance volRepository pour appeler la méthode
        List<Vol> vols = volRepository.findByDateDepartBetween(startDate, endDate);

        // Vérifier que la liste des vols n'est pas null
        if (vols == null) {
            return ResponseEntity.ok(Collections.emptyList()); // Retourne une liste vide
        }

        // Calculer les taux d'occupation
        List<TauxOccupationResponse> tauxOccupationList = new ArrayList<>();

        for (Vol vol : vols) {
            Avion avion = vol.getAvion();
            if (avion == null) {
                continue; // Ignorer les vols sans avion associé
            }

            int capaciteCA = avion.getCapacite_CA();
            int capaciteCE = avion.getCapacite_CE();
            int capaciteCP = avion.getCapacite_CP();

            int occupeCA = capaciteCA - vol.getCA_dispo();
            int occupeCE = capaciteCE - vol.getCE_dispo();
            int occupeCP = capaciteCP - vol.getCP_dispo();

            double tauxCA = (occupeCA * 100.0) / capaciteCA;
            double tauxCE = (occupeCE * 100.0) / capaciteCE;
            double tauxCP = (occupeCP * 100.0) / capaciteCP;

            tauxOccupationList.add(new TauxOccupationResponse(
                    avion.getNom(),
                    tauxCA,
                    tauxCE,
                    tauxCP));
        }

        return ResponseEntity.ok(tauxOccupationList);
    }

}
