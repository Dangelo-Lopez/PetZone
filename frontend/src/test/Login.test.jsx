import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../pages/Login";
import { UserContext } from "../context/UserContext";

function renderLogin() {
    const login = vi.fn();
    const register = vi.fn();

    render(
        <MemoryRouter>
            <UserContext.Provider value={{ login, register }}>
                <Login t={{}} />
            </UserContext.Provider>
        </MemoryRouter>
    );

    return { login, register };
}

describe("Login", () => {
    it("renderiza el formulario de inicio de sesión", () => {
        renderLogin();

        expect(screen.getByText(/Bienvenido a PetZone/i)).toBeTruthy();
        expect(screen.getByPlaceholderText(/tu@correo.com/i)).toBeTruthy();
    });

    it("permite cambiar a la pestaña de registro", () => {
        renderLogin();

        fireEvent.click(screen.getByText(/Registrarse/i));

        expect(screen.getByText(/Crea tu cuenta/i)).toBeTruthy();
        expect(screen.getByPlaceholderText(/Ej. Juan Pérez/i)).toBeTruthy();
    });

    it("ejecuta login correctamente", () => {
        const { login } = renderLogin();

        fireEvent.change(screen.getByPlaceholderText(/tu@correo.com/i), {
            target: { value: "admin@test.com" },
        });

        fireEvent.change(screen.getByPlaceholderText("••••••••"), {
            target: { value: "123456" },
        });

        fireEvent.click(screen.getByText("Ingresar"));

        expect(login).toHaveBeenCalled();
    });

    it("ejecuta register correctamente", () => {
        const { register } = renderLogin();

        fireEvent.click(screen.getByText(/Registrarse/i));

        fireEvent.change(screen.getByPlaceholderText(/Ej. Juan Pérez/i), {
            target: { value: "Dangelo" },
        });

        fireEvent.change(screen.getByPlaceholderText(/tu@correo.com/i), {
            target: { value: "dang@test.com" },
        });

        fireEvent.change(screen.getByPlaceholderText(/Ej. \+56 9 1234 5678/i), {
            target: { value: "+56 9 1234 5678" },
        });

        fireEvent.change(screen.getByPlaceholderText(/Ej. Av. Siempre Viva 123/i), {
            target: { value: "Av. Siempre Viva 123" },
        });

        fireEvent.change(screen.getByPlaceholderText("••••••••"), {
            target: { value: "123456" },
        });

        fireEvent.change(screen.getByPlaceholderText(/Confirma tu contraseña/i), {
            target: { value: "123456" },
        });

        fireEvent.click(screen.getByText(/Crear cuenta/i));

        expect(register).toHaveBeenCalled();
    });
});