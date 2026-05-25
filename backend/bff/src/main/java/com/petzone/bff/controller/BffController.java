package com.petzone.bff.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class BffController {

    private final RestTemplate restTemplate;

    public BffController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @GetMapping("/api/test")
    public String testBff() {
        return "BFF funcionando";
    }

    @GetMapping("/api/productos")
    public Object obtenerProductos() {

        String url = "http://ms-productos:8082/productos";

        return restTemplate.getForObject(url, Object.class);
    }

    @GetMapping("/api/cuidados")
    public Object obtenerCuidados() {

        String url = "http://ms-productos:8082/cuidados";

        return restTemplate.getForObject(url, Object.class);
    }
}