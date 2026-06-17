import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Perfil from '../pages/Perfil';
import { UserContext } from '../context/UserContext';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');

    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

function renderPerfil(customUser = null) {
    const user = customUser ?? {
        id: 1,
        nombre: 'Dangelo',
        email: 'dangelo@test.com',
        telefono: '+56912345678',
        direccion: 'Santiago, Chile',
        rol: 'ADMIN',
        fotoPerfil: '',
    };

    const logout = vi.fn();

    render(
        <MemoryRouter>
            <UserContext.Provider value={{ user, logout }}>
                <Perfil />
            </UserContext.Provider>
        </MemoryRouter>
    );

    return { logout };
}

describe('Perfil', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('muestra los datos del usuario', () => {
        renderPerfil();

        expect(screen.getByText('Dangelo')).toBeTruthy();
        expect(screen.getByText('dangelo@test.com')).toBeTruthy();
        expect(screen.getByText('+56912345678')).toBeTruthy();
        expect(screen.getByText('Santiago, Chile')).toBeTruthy();
        expect(screen.getAllByText('ADMIN').length).toBeGreaterThan(0);
    });

    it('permite entrar al modo edición', () => {
        renderPerfil();

        fireEvent.click(screen.getByText(/Editar Perfil/i));

        expect(screen.getByText(/Editar Información/i)).toBeTruthy();
        expect(screen.getByDisplayValue('dangelo@test.com')).toBeTruthy();
        expect(screen.getByDisplayValue('+56912345678')).toBeTruthy();
        expect(screen.getByDisplayValue('Santiago, Chile')).toBeTruthy();
    });

    it('muestra error si las contraseñas no coinciden', () => {
        renderPerfil();

        fireEvent.click(screen.getByText(/Editar Perfil/i));

        fireEvent.change(screen.getByPlaceholderText(/Deja vacío/i), {
            target: { value: '123456' },
        });

        fireEvent.change(screen.getByPlaceholderText(/Confirma tu nueva contraseña/i), {
            target: { value: '654321' },
        });

        fireEvent.click(screen.getByText(/Guardar Cambios/i));

        expect(screen.getByText(/Las contraseñas no coinciden/i)).toBeTruthy();
    });

    it('ejecuta logout al cerrar sesión', () => {
        const { logout } = renderPerfil();

        fireEvent.click(screen.getByText(/Cerrar Sesión/i));

        expect(logout).toHaveBeenCalled();
    });

    it('muestra mensaje si no hay usuario logeado', () => {
        render(
            <MemoryRouter>
                <UserContext.Provider value={{ user: null, logout: vi.fn() }}>
                    <Perfil />
                </UserContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByText(/No estás logeado/i)).toBeTruthy();
        expect(screen.getByText(/Ir a Iniciar Sesión/i)).toBeTruthy();
    });
});