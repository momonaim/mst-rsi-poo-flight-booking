package com.flight.flight_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.flight.flight_backend.exeption.NotFound;
import com.flight.flight_backend.exeption.VolNotFoundException;
import com.flight.flight_backend.model.Avion;
import com.flight.flight_backend.model.Trajet;
import com.flight.flight_backend.model.Vol;
import com.flight.flight_backend.repository.AvionRepository;
import com.flight.flight_backend.repository.TrajetRepository;
import com.flight.flight_backend.repository.VolRepository;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
public class VolController {

    @Autowired
    private VolRepository volRepository;

    @Autowired
    private TrajetRepository trajetRepository;

    @Autowired
    private AvionRepository avionRepository;

    @GetMapping("/countvol")
    public long getNombreVols() {
        return volRepository.count();
    }

    @GetMapping("/vols/search")
    public List<Vol> searchVols(
            @RequestParam("villeDepart") String villeDepart,
            @RequestParam("villeArrivee") String villeArrivee) {
        return volRepository.searchVols(villeDepart, villeArrivee);
    }

    @GetMapping("/find")
    public List<Vol> findByVilleDepartAndVilleArriveeAndDateDepartAfter(
            @RequestParam("dateDepart") String dateDepart,
            @RequestParam("villeDepart") String villeDepart,
            @RequestParam("villeArrivee") String villeArrivee) throws ParseException {

        return volRepository.findByVilleDepartAndVilleArriveeAndDateDepartAfter(villeDepart, villeArrivee,
                new SimpleDateFormat("yyyy-MM-dd").parse(dateDepart));
    }

    @GetMapping("/findbydatedep")
    public List<Vol> findByDateDepartAndVilleDepartAndVilleArrivee(
            @RequestParam("dateDepart") String dateDepart, @RequestParam("villeDepart") String villeDepart,
            @RequestParam("villeArrivee") String villeArrivee) throws ParseException {
        return volRepository.findByDateDepartAndVilleDepartAndVilleArrivee(
                new SimpleDateFormat("yyyy-MM-dd").parse(dateDepart), villeDepart, villeArrivee);
    }

    @PostMapping("/vol")
    Vol newVol(@RequestBody Vol newVol) {
        return volRepository.save(newVol);
    }

    @GetMapping("/vols")
    List<Vol> getAllVols() {
        return volRepository.findAll();
    }

    @GetMapping("/vol/{id}")
    Vol getVolById(@PathVariable Long id) {
        return volRepository.findById(id)
                .orElseThrow(() -> new NotFound("VOL", id));
    }

    @PostMapping("vols/ajoutsi")
    public ResponseEntity<?> createVol(@RequestBody Vol vol) {
        try {

            if (vol.getDateDepart() == null) {
                return ResponseEntity.badRequest().body("Erreur : Les dates de départ est obligatoire.");
            }

            // Valider le trajet
            Trajet trajet = trajetRepository.findById(vol.getTrajet().getId_trajet())
                    .orElseThrow(() -> new NotFound("Trajet non trouvé avec l'ID : " + vol.getTrajet().getId_trajet()));

            // Valider l'avion
            Avion avion = avionRepository.findById(vol.getAvion().getId())
                    .orElseThrow(() -> new NotFound("Avion non trouvé avec l'ID : " + vol.getAvion().getId()));

            // Associer le trajet et l'avion au vol
            vol.setTrajet(trajet);
            vol.setCA_dispo(avion.getCapacite_CA());
            vol.setCE_dispo(avion.getCapacite_CE());
            vol.setCP_dispo(avion.getCapacite_CP());
            vol.setVilleDepart(trajet.getVilleDepart());
            vol.setVilleArrivee(trajet.getVilleArrivee());
            vol.setAvion(avion);

            // Enregistrer le vol dans la base de données
            Vol savedVol = volRepository.save(vol);
            System.out.println("Vol enregistré avec succès : " + savedVol);

            // Retourner une réponse HTTP 200 OK avec le vol créé
            return ResponseEntity.ok(savedVol);
        } catch (Exception e) {
            System.err.println("Erreur lors de la création du vol : " + e.getMessage());
            return ResponseEntity.internalServerError().body("Erreur interne du serveur : " + e.getMessage());
        }
    }

    @PutMapping("/vol/{id}")
    public ResponseEntity<?> updateVol(@RequestBody Vol updatedVol, @PathVariable Long id) {
        try {
            return volRepository.findById(id)
                    .map(vol -> {
                        // Valider les dates
                        if (updatedVol.getDateDepart().after(updatedVol.getDateArrivee())) {
                            return ResponseEntity.badRequest()
                                    .body("Erreur : La date de départ doit être antérieure à la date d'arrivée.");
                        }

                        // Mettre à jour les champs du vol
                        vol.setDateDepart(updatedVol.getDateDepart());
                        vol.setDateArrivee(updatedVol.getDateArrivee());
                        vol.setCanceled(updatedVol.isCanceled());
                        vol.setCA_dispo(updatedVol.getCA_dispo());
                        vol.setCE_dispo(updatedVol.getCE_dispo());
                        vol.setCP_dispo(updatedVol.getCP_dispo());

                        // Valider le trajet
                        Trajet trajet = trajetRepository.findById(updatedVol.getTrajet().getId_trajet())
                                .orElseThrow(() -> new NotFound(
                                        "Trajet non trouvé avec l'ID : " + updatedVol.getTrajet().getId_trajet()));

                        // Valider l'avion
                        Avion avion = avionRepository.findById(updatedVol.getAvion().getId())
                                .orElseThrow(() -> new NotFound(
                                        "Avion non trouvé avec l'ID : " + updatedVol.getAvion().getId()));

                        // Associer le trajet et l'avion au vol
                        vol.setTrajet(trajet);
                        vol.setAvion(avion);

                        // Enregistrer les modifications dans la base de données
                        Vol savedVol = volRepository.save(vol);
                        System.out.println("Vol mis à jour avec succès : " + savedVol);

                        // Retourner une réponse HTTP 200 OK avec le vol mis à jour
                        return ResponseEntity.ok(savedVol);
                    })
                    .orElseThrow(() -> new NotFound("Vol non trouvé avec l'ID : " + id));
        } catch (Exception e) {
            System.err.println("Erreur lors de la mise à jour du vol : " + e.getMessage());
            return ResponseEntity.internalServerError().body("Erreur interne du serveur : " + e.getMessage());
        }
    }

    // Vol updateVol(@RequestBody Vol newVol, @PathVariable Long id) {
    // return volRepository.findById(id)
    // .map(vol -> {
    // vol.setDateDepart(newVol.getDateDepart());
    // vol.setDateArrivee(newVol.getDateArrivee());
    // vol.setCanceled(newVol.isCanceled());
    // vol.setCA_dispo(newVol.getCA_dispo());
    // vol.setCE_dispo(newVol.getCE_dispo());
    // vol.setCP_dispo(newVol.getCP_dispo());
    // return volRepository.save(vol);
    // }).orElseThrow(() -> new VolNotFoundException(id));
    // }

    @DeleteMapping("/vol/{id}")
    String deleteVol(@PathVariable Long id) {
        if (!volRepository.existsById(id)) {
            throw new VolNotFoundException(id);
        }
        volRepository.deleteById(id);
        return "Vol with id " + id + " has been deleted success.";
    }

}
