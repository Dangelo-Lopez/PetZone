import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Admin from '../pages/Admin';
import { UserContext } from '../context/UserContext';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');

    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const adminUser = {
    id: 1,
    nombre: 'Dangelo',
    email: 'admin@test.com',
    rol: 'ADMIN',
};

function renderAdmin(user = adminUser) {
    render(
        <MemoryRouter>
            <UserContext.Provider value={{ user }}>
                <Admin />
            </UserContext.Provider>
        </MemoryRouter>
    );
}

describe('Admin', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        global.fetch = vi.fn((url) => {
            if (url.includes('/productos')) {
                return Promise.resolve({
                    ok: true,
                    json: () =>
                        Promise.resolve([
                            {
                                id: 1,
                                nombre: 'Alimento Premium',
                                precio: 10000,
                                stock: 5,
                                categoria: 'Alimentos',
                                imagen: '',
                            },
                        ]),
                });
            }

            if (url.includes('/auth/usuarios')) {
                return Promise.resolve({
                    ok: true,
                    json: () =>
                        Promise.resolve([
                            {
                                id: 1,
                                nombre: 'Dangelo',
                                email: 'admin@test.com',
                                rol: 'ADMIN',
                            },
                            {
                                id: 2,
                                nombre: 'Cliente',
                                email: 'cliente@test.com',
                                rol: 'USER',
                            },
                        ]),
                });
            }

            if (url.includes('/auth/register')) {
                return Promise.resolve({
                    ok: true,
                    json: () =>
                        Promise.resolve({
                            success: true,
                            user: {
                                id: 3,
                                nombre: 'Nuevo Usuario',
                                email: 'nuevo@test.com',
                                rol: 'USER',
                            },
                        }),
                });
            }

            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ success: true }),
            });
        });
    });

    it('muestra acceso denegado si no hay usuario', () => {
        renderAdmin(null);

        expect(screen.getByText(/Acceso Denegado/i)).toBeTruthy();
    });

    it('muestra error si el usuario no es admin', () => {
        renderAdmin({
            id: 2,
            nombre: 'Cliente',
            email: 'cliente@test.com',
            rol: 'USER',
        });

        expect(screen.getByText(/No tienes permisos/i)).toBeTruthy();
    });

    it('renderiza el panel administrativo para ADMIN', () => {
        renderAdmin();

        expect(screen.getByText(/Panel Administrativo/i)).toBeTruthy();
        expect(screen.getByText(/Bienvenido, Dangelo/i)).toBeTruthy();
    });

    it('carga productos en la pestaña productos', async () => {
        renderAdmin();

        expect(await screen.findByText('Alimento Premium')).toBeTruthy();

        // Hay más de un elemento con "Alimentos"(screen.getAllByText('Alimentos').length).toBeGreaterThan(0);

        // Verifica que exista el stock 5
        expect(screen.getByText('5')).toBeTruthy();
    });

    it('permite cambiar a la pestaña usuarios', async () => {
        renderAdmin();

        fireEvent.click(screen.getByText('Usuarios'));

        expect(await screen.findByText(/Gestión de Usuarios/i)).toBeTruthy();
        expect(await screen.findByText('Cliente')).toBeTruthy();
    });

    it('muestra contadores de usuarios', async () => {
        renderAdmin();

        fireEvent.click(screen.getByText('Usuarios'));

        expect(await screen.findByText(/Total usuarios/i)).toBeTruthy();
        expect(await screen.findByText(/Administradores/i)).toBeTruthy();
        expect(await screen.findByText(/Clientes/i)).toBeTruthy();
    });

    it('abre formulario para crear usuario', async () => {
        renderAdmin();

        fireEvent.click(screen.getByText('Usuarios'));

        const botonCrear = await screen.findByText(/Crear nuevo usuario/i);
        fireEvent.click(botonCrear);

        expect(screen.getByPlaceholderText(/Nombre completo/i)).toBeTruthy();
        expect(screen.getByPlaceholderText(/correo@petzone.com/i)).toBeTruthy();
    });

    it('crea un usuario desde admin', async () => {
        renderAdmin();

        fireEvent.click(screen.getByText('Usuarios'));

        fireEvent.click(await screen.findByText(/Crear nuevo usuario/i));

        fireEvent.change(screen.getByPlaceholderText(/Nombre completo/i), {
            target: { value: 'Nuevo Usuario' },
        });

        fireEvent.change(screen.getByPlaceholderText(/correo@petzone.com/i), {
            target: { value: 'nuevo@test.com' },
        });

        fireEvent.change(screen.getByPlaceholderText(/Contraseña inicial/i), {
            target: { value: '123456' },
        });

        fireEvent.click(screen.getByText(/Guardar usuario/i));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                'http://localhost:8081/auth/register',
                expect.objectContaining({
                    method: 'POST',
                })
            );
        });
    });
});