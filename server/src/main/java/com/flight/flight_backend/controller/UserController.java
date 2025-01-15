package com.flight.flight_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.flight.flight_backend.exeption.UserNotFoundException;
import com.flight.flight_backend.model.Utilisateur;
import com.flight.flight_backend.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/countuser")
    public long getNombreUtilisateurs() {
        return userRepository.count();
    }

    @PostMapping("/user")
    Utilisateur newUser(@RequestBody Utilisateur newUser) {
        return userRepository.save(newUser);
    }

    @GetMapping("/users")
    List<Utilisateur> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/user/{id}")
    Utilisateur getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    @PutMapping("/user/{id}")
    Utilisateur updateUser(@RequestBody Utilisateur newUser, @PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setUsername(newUser.getUsername());
                    user.setLastname(newUser.getLastname());
                    user.setFirstname(newUser.getFirstname());
                    user.setPhone(newUser.getPhone());
                    user.setSexe(newUser.getSexe());
                    user.setEmail(newUser.getEmail());
                    return userRepository.save(user);
                }).orElseThrow(() -> new UserNotFoundException(id));
    }

    @DeleteMapping("/user/{id}")
    String deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException(id);
        }
        userRepository.deleteById(id);
        return "User with id " + id + " has been deleted success.";
    }

    @PostMapping("/login")
    public ResponseEntity<Utilisateur> login(@RequestBody Utilisateur loginRequest) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        Optional<Utilisateur> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            Utilisateur user = userOpt.get();
            if (user.getPassword().equals(password)) {
                return ResponseEntity.ok(user); // Connexion réussie
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED) // 401 Unauthorized
                        .body(null); // Mot de passe incorrect
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND) // 404 Not Found
                    .body(null); // Utilisateur non trouvé
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Utilisateur newUser) {
        // Vérifier si l'email existe déjà
        Optional<Utilisateur> existingUser = userRepository.findByEmail(newUser.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email already exists. Please use a different email.");
        }

        // Enregistrement du nouvel utilisateur
        userRepository.save(newUser);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("User registered successfully.");
    }

}
