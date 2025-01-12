package com.flight.flight_backend.model;

public class TauxOccupationResponse {
    private String nomAvion;
    private double tauxCA;
    private double tauxCE;
    private double tauxCP;

    public TauxOccupationResponse(String nomAvion, double tauxCA, double tauxCE, double tauxCP) {
        this.nomAvion = nomAvion;
        this.tauxCA = tauxCA;
        this.tauxCE = tauxCE;
        this.tauxCP = tauxCP;
    }

    public String getNomAvion() {
        return nomAvion;
    }

    public void setNomAvion(String nomAvion) {
        this.nomAvion = nomAvion;
    }

    public double getTauxCP() {
        return tauxCP;
    }

    public void setTauxCP(double tauxCP) {
        this.tauxCP = tauxCP;
    }

    public double getTauxCE() {
        return tauxCE;
    }

    public void setTauxCE(double tauxCE) {
        this.tauxCE = tauxCE;
    }

    public double getTauxCA() {
        return tauxCA;
    }

    public void setTauxCA(double tauxCA) {
        this.tauxCA = tauxCA;
    }
}