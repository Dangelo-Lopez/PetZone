package com.petzone.productos.controller;

import com.petzone.productos.model.ServicioCuidado;
import com.petzone.productos.repository.ServicioCuidadoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cuidados")
public class ServicioCuidadoController {

    private final ServicioCuidadoRepository servicioCuidadoRepository;

    public ServicioCuidadoController(ServicioCuidadoRepository servicioCuidadoRepository) {
        this.servicioCuidadoRepository = servicioCuidadoRepository;
    }

    @GetMapping
    public List<ServicioCuidado> listarServicios() {
        return servicioCuidadoRepository.findAll();
    }

    @PostMapping
    public ServicioCuidado guardarServicio(@RequestBody ServicioCuidado servicioCuidado) {
        return servicioCuidadoRepository.save(servicioCuidado);
    }
}