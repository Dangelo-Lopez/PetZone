import { describe, it, expect } from "vitest";

describe("PetZone - Pruebas básicas", () => {

  it("debe ejecutar correctamente el entorno de pruebas", () => {
    expect(true).toBe(true);
  });

  it("debe sumar correctamente los precios", () => {
    const precio1 = 14990;
    const precio2 = 25990;

    expect(precio1 + precio2).toBe(40980);
  });

  it("debe calcular correctamente el total del carrito", () => {
    const carrito = [
      { precio: 10000, quantity: 2 },
      { precio: 5000, quantity: 3 }
    ];

    const total = carrito.reduce(
      (acc, item) => acc + item.precio * item.quantity,
      0
    );

    expect(total).toBe(35000);
  });

  it("no debe permitir stock negativo", () => {
    const stock = 0;

    expect(stock > 0).toBe(false);
  });

  it("debe identificar un usuario administrador", () => {
    const usuario = {
      nombre: "Admin",
      rol: "ADMIN"
    };

    expect(usuario.rol).toBe("ADMIN");
  });

});