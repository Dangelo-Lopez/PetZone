package com.petzone.productos.controller;

import com.petzone.productos.model.Producto;
import com.petzone.productos.repository.ProductoRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/productos")
public class ProductoController {

    private final ProductoRepository productoRepository;

    public ProductoController(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @GetMapping
    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }

    @GetMapping("/{id}")
    public Object obtenerProducto(@PathVariable Long id) {
        Optional<Producto> producto = productoRepository.findById(id);

        if (producto.isPresent()) {
            return producto.get();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "Producto no encontrado");
        return response;
    }

    @PostMapping
    public Producto guardarProducto(@RequestBody Producto producto) {
        return productoRepository.save(producto);
    }

    @PutMapping("/{id}")
    public Map<String, Object> actualizarProducto(@PathVariable Long id, @RequestBody Producto datos) {
        Map<String, Object> response = new HashMap<>();

        Optional<Producto> productoOptional = productoRepository.findById(id);

        if (productoOptional.isEmpty()) {
            response.put("success", false);
            response.put("message", "Producto no encontrado");
            return response;
        }

        Producto producto = productoOptional.get();

        producto.setNombre(datos.getNombre());
        producto.setPrecio(datos.getPrecio());
        producto.setCategoria(datos.getCategoria());
        producto.setImagen(datos.getImagen());
        producto.setStock(datos.getStock());

        Producto actualizado = productoRepository.save(producto);

        response.put("success", true);
        response.put("message", "Producto actualizado correctamente");
        response.put("producto", actualizado);

        return response;
    }

    @PostMapping("/{id}/imagen")
    public Map<String, Object> subirImagenProducto(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        Map<String, Object> response = new HashMap<>();

        Optional<Producto> productoOptional = productoRepository.findById(id);

        if (productoOptional.isEmpty()) {
            response.put("success", false);
            response.put("message", "Producto no encontrado");
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
            extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
        }

        if (!extension.equals(".jpg") && !extension.equals(".jpeg") && !extension.equals(".png") && !extension.equals(".webp")) {
            response.put("success", false);
            response.put("message", "Formato no permitido. Usa JPG, JPEG, PNG o WEBP");
            return response;
        }

        String fileName = "producto_" + id + "_" + System.currentTimeMillis() + extension;

        String uploadPath = System.getProperty("user.dir")
                + File.separator + "uploads"
                + File.separator + "productos";

        File uploadDir = new File(uploadPath);

        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        File destino = new File(uploadDir, fileName);

        file.transferTo(destino);

        Producto producto = productoOptional.get();

        String imagenUrl = "http://localhost:8082/uploads/productos/" + fileName;

        producto.setImagen(imagenUrl);

        Producto actualizado = productoRepository.save(producto);

        response.put("success", true);
        response.put("message", "Imagen del producto actualizada correctamente");
        response.put("producto", actualizado);

        return response;
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> eliminarProducto(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();

        if (!productoRepository.existsById(id)) {
            response.put("success", false);
            response.put("message", "Producto no encontrado");
            return response;
        }

        productoRepository.deleteById(id);

        response.put("success", true);
        response.put("message", "Producto eliminado correctamente");

        return response;
    }

    @GetMapping("/test")
    public String testProductos() {
        return "Microservicio productos funcionando";
    }

@PatchMapping("/{id}/descontar-stock")
public Map<String, Object> descontarStock(
        @PathVariable Long id,
        @RequestBody Map<String, Integer> body
) {
    Map<String, Object> response = new HashMap<>();

    Optional<Producto> productoOptional = productoRepository.findById(id);

    if (productoOptional.isEmpty()) {
        response.put("success", false);
        response.put("message", "Producto no encontrado");
        return response;
    }

    Producto producto = productoOptional.get();

    Integer cantidad = body.getOrDefault("cantidad", 1);

    if (producto.getStock() == null) {
        producto.setStock(0);
    }

    if (producto.getStock() <= 0) {
        response.put("success", false);
        response.put("message", "Producto agotado");
        return response;
    }

    if (producto.getStock() < cantidad) {
        response.put("success", false);
        response.put("message", "Stock insuficiente");
        return response;
    }

    producto.setStock(producto.getStock() - cantidad);

    Producto actualizado = productoRepository.save(producto);

    response.put("success", true);
    response.put("message", "Stock actualizado correctamente");
    response.put("producto", actualizado);

    return response;
}
}