package com.petzone.auth.controller;

import com.petzone.auth.model.Usuario;
import com.petzone.auth.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/test")
    public String testAuth() {
        return "Microservicio auth funcionando";
    }

    private Map<String, Object> usuarioSeguro(Usuario usuario) {
        Map<String, Object> user = new HashMap<>();

        user.put("id", usuario.getId());
        user.put("nombre", usuario.getNombre());
        user.put("email", usuario.getEmail());
        user.put("rol", usuario.getRol());
        user.put("telefono", usuario.getTelefono());
        user.put("direccion", usuario.getDireccion());
        user.put("fotoPerfil", usuario.getFotoPerfil());

        return user;
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Usuario usuario) {
        Map<String, Object> response = new HashMap<>();

        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            response.put("success", false);
            response.put("message", "El correo ya está registrado");
            return response;
        }

        if (usuario.getRol() == null || usuario.getRol().isEmpty()) {
            usuario.setRol("USER");
        }

        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        response.put("success", true);
        response.put("message", "Usuario registrado correctamente");
        response.put("user", usuarioSeguro(usuarioGuardado));

        return response;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Usuario usuario) {
        Map<String, Object> response = new HashMap<>();

        return usuarioRepository.findByEmail(usuario.getEmail())
                .map(usuarioEncontrado -> {
                    if (passwordEncoder.matches(usuario.getPassword(), usuarioEncontrado.getPassword())) {
                        response.put("success", true);
                        response.put("message", "Login correcto");
                        response.put("user", usuarioSeguro(usuarioEncontrado));
                    } else {
                        response.put("success", false);
                        response.put("message", "Contraseña incorrecta");
                    }

                    return response;
                })
                .orElseGet(() -> {
                    response.put("success", false);
                    response.put("message", "Usuario no encontrado");
                    return response;
                });
    }

    @GetMapping("/usuarios")
    public List<Map<String, Object>> listarUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::usuarioSeguro)
                .toList();
    }

    @PutMapping("/usuarios/{id}")
    public Map<String, Object> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario datos) {
        Map<String, Object> response = new HashMap<>();

        Optional<Usuario> usuarioOptional = usuarioRepository.findById(id);

        if (usuarioOptional.isEmpty()) {
            response.put("success", false);
            response.put("message", "Usuario no encontrado");
            return response;
        }

        Usuario usuario = usuarioOptional.get();

        if (datos.getEmail() != null && !datos.getEmail().equals(usuario.getEmail())) {
            Optional<Usuario> emailExistente = usuarioRepository.findByEmail(datos.getEmail());

            if (emailExistente.isPresent() && !emailExistente.get().getId().equals(id)) {
                response.put("success", false);
                response.put("message", "El correo ya está en uso");
                return response;
            }

            usuario.setEmail(datos.getEmail());
        }

        if (datos.getNombre() != null && !datos.getNombre().isBlank()) {
            usuario.setNombre(datos.getNombre());
        }

        if (datos.getTelefono() != null) {
            usuario.setTelefono(datos.getTelefono());
        }

        if (datos.getDireccion() != null) {
            usuario.setDireccion(datos.getDireccion());
        }

        if (datos.getFotoPerfil() != null) {
            usuario.setFotoPerfil(datos.getFotoPerfil());
        }

        if (datos.getPassword() != null && !datos.getPassword().isBlank()) {
            usuario.setPassword(passwordEncoder.encode(datos.getPassword()));
        }

        Usuario actualizado = usuarioRepository.save(usuario);

        response.put("success", true);
        response.put("message", "Usuario actualizado correctamente");
        response.put("user", usuarioSeguro(actualizado));

        return response;
    }

    @PatchMapping("/usuarios/{id}/rol")
    public Map<String, Object> cambiarRol(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Map<String, Object> response = new HashMap<>();

        Optional<Usuario> usuarioOptional = usuarioRepository.findById(id);

        if (usuarioOptional.isEmpty()) {
            response.put("success", false);
            response.put("message", "Usuario no encontrado");
            return response;
        }

        Usuario usuario = usuarioOptional.get();
        usuario.setRol(body.getOrDefault("rol", "USER"));

        Usuario actualizado = usuarioRepository.save(usuario);

        response.put("success", true);
        response.put("message", "Rol actualizado correctamente");
        response.put("user", usuarioSeguro(actualizado));

        return response;
    }

    @DeleteMapping("/usuarios/{id}")
    public Map<String, Object> eliminarUsuario(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();

        if (!usuarioRepository.existsById(id)) {
            response.put("success", false);
            response.put("message", "Usuario no encontrado");
            return response;
        }

        usuarioRepository.deleteById(id);

        response.put("success", true);
        response.put("message", "Usuario eliminado correctamente");

        return response;
    }

    @PostMapping("/usuarios/{id}/foto")
    public Map<String, Object> subirFotoPerfil(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        Map<String, Object> response = new HashMap<>();

        Optional<Usuario> usuarioOptional = usuarioRepository.findById(id);

        if (usuarioOptional.isEmpty()) {
            response.put("success", false);
            response.put("message", "Usuario no encontrado");
            return response;
        }

        if (file.isEmpty()) {
            response.put("success", false);
            response.put("message", "Archivo vacío");
            return response;
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String fileName = "usuario_" + id + "_" + System.currentTimeMillis() + extension;

        String uploadPath = System.getProperty("user.dir") + File.separator + "uploads";

        File uploadDir = new File(uploadPath);

        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        File destino = new File(uploadDir, fileName);

        file.transferTo(destino);

        Usuario usuario = usuarioOptional.get();

        String fotoUrl = "http://localhost:8081/uploads/" + fileName;

        usuario.setFotoPerfil(fotoUrl);

        Usuario actualizado = usuarioRepository.save(usuario);

        response.put("success", true);
        response.put("message", "Foto de perfil actualizada correctamente");
        response.put("user", usuarioSeguro(actualizado));

        return response;
    }
}