package com.flight.flight_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.flight.flight_backend.model.Categorie; // Import du modèle Categorie
import com.flight.flight_backend.repository.CategorieRepository; // Import du repository Categorie

import java.util.List;
import java.util.Optional;

@RestController // Annotations indiquant que c'est un contrôleur REST
@CrossOrigin("http://localhost:3000") // Permet les requêtes cross-origin depuis l'URL du frontend (si tu utilises
                                      // React par exemple)
public class CategorieController {

    @Autowired
    private CategorieRepository categorieRepository; // Injection de dépendance pour accéder au repository Categorie

    /**
     * Endpoint pour ajouter une nouvelle catégorie.
     *
     * @param newCategorie Objet de type Categorie reçu en JSON dans la requête.
     * @return La catégorie ajoutée avec le code de statut 201 Created.
     */
    @PostMapping("/categorie") // L'endpoint pour ajouter une catégorie
    public ResponseEntity<Categorie> newCategorie(@RequestBody Categorie newCategorie) {
        Categorie savedCategorie = categorieRepository.save(newCategorie);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCategorie);
    }

    @GetMapping("/categories") // L'endpoint pour obtenir toutes les catégories
    public List<Categorie> getAllCategories() {
        return categorieRepository.findAll(); // Récupère toutes les catégories dans la base de données
    }

    @GetMapping("/categorie/{id}") // L'endpoint pour obtenir une catégorie par ID
    public ResponseEntity<Categorie> getCategorieById(@PathVariable Long id) {
        Optional<Categorie> categorie = categorieRepository.findById(id); // Recherche de la catégorie par ID
        if (categorie.isPresent()) {
            return ResponseEntity.ok(categorie.get()); // Retourne la catégorie si trouvée
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/categorie/{id}") // L'endpoint pour mettre à jour une catégorie
    public ResponseEntity<Categorie> updateCategorie(@RequestBody Categorie newCategorie, @PathVariable Long id) {
        Optional<Categorie> existingCategorie = categorieRepository.findById(id); // Recherche la catégorie à mettre à
                                                                                  // jour par son ID
        if (existingCategorie.isPresent()) {
            Categorie categorie = existingCategorie.get(); // Récupère l'ancienne catégorie
            // Met à jour les propriétés de la catégorie existante avec les nouvelles
            // données
            categorie.setNom(newCategorie.getNom());
            categorie.setReduction(newCategorie.getReduction());
            categorie.setDescription(newCategorie.getDescription());
            return ResponseEntity.ok(categorieRepository.save(categorie)); // Sauvegarde la catégorie mise à jour et
                                                                           // retourne la réponse
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Retourne 404 si la catégorie n'est pas
                                                                           // trouvée
        }
    }

    /**
     * Endpoint pour supprimer une catégorie par son ID.
     *
     * @param id L'identifiant de la catégorie à supprimer.
     * @return Un message de succès ou d'erreur selon le résultat.
     */
    @DeleteMapping("/categorie/{id}") // L'endpoint pour supprimer une catégorie
    public ResponseEntity<String> deleteCategorie(@PathVariable Long id) {
        if (categorieRepository.existsById(id)) {
            categorieRepository.deleteById(id); // Supprime la catégorie par son ID
            return ResponseEntity.ok("Categorie with id " + id + " has been deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Categorie with id " + id + " not found.");
        }
    }
}
