package com.petzone.productos.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class ServicioCuidado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String animal;
    private String peso;
    private String servicio;
    private Double precio;

    public ServicioCuidado() {
    }

    public ServicioCuidado(Long id, String animal, String peso, String servicio, Double precio) {
        this.id = id;
        this.animal = animal;
        this.peso = peso;
        this.servicio = servicio;
        this.precio = precio;
    }

    public Long getId() {
        return id;
    }

    public String getAnimal() {
        return animal;
    }

    public String getPeso() {
        return peso;
    }

    public String getServicio() {
        return servicio;
    }

    public Double getPrecio() {
        return precio;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setAnimal(String animal) {
        this.animal = animal;
    }

    public void setPeso(String peso) {
        this.peso = peso;
    }

    public void setServicio(String servicio) {
        this.servicio = servicio;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }
}