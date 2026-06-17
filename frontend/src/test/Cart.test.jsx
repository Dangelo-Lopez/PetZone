import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Cart from '../pages/Cart';
import { CartContext } from '../context/CartContext';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');

    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

function renderCart(customValue) {
    const defaultValue = {
        cart: [
            {
                id: 1,
                nombre: 'Alimento Premium',
                precio: 10000,
                quantity: 2,
                stock: 5,
                imagen: '',
            },
        ],
        removeFromCart: vi.fn(),
        getCartTotal: vi.fn(() => 20000),
        clearCart: vi.fn(),
        addToCart: vi.fn(),
        decreaseQuantity: vi.fn(),
        cartMessage: '',
        setCartMessage: vi.fn(),
    };

    const value = {
        ...defaultValue,
        ...customValue,
    };

    return {
        ...render(
            <MemoryRouter>
                <CartContext.Provider value={value}>
                    <Cart currency={{ code: 'CLP' }} />
                </CartContext.Provider>
            </MemoryRouter>
        ),
        value,
    };
}

describe('Cart', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        global.fetch = vi.fn(() =>
            Promise.resolve({
                json: () =>
                    Promise.resolve({
                        success: true,
                    }),
            })
        );
    });

    it('muestra los productos del carrito', () => {
        renderCart();

        expect(screen.getByText('Alimento Premium')).toBeTruthy();
        expect(screen.getByText('2')).toBeTruthy();
        expect(screen.getByText(/Stock disponible:/i)).toBeTruthy();
        expect(screen.getByText(/5/)).toBeTruthy();
    });

    it('muestra el total a pagar', () => {
        renderCart();

        expect(screen.getAllByText('CLP 20000.00').length).toBeGreaterThan(0);
    });

    it('permite eliminar un producto', () => {
        const removeFromCart = vi.fn();

        renderCart({ removeFromCart });

        fireEvent.click(screen.getByText('Eliminar'));

        expect(removeFromCart).toHaveBeenCalledWith(1);
    });

    it('aumenta cantidad si hay stock disponible', () => {
        const addToCart = vi.fn();

        renderCart({ addToCart });

        fireEvent.click(screen.getByText('+'));

        expect(addToCart).toHaveBeenCalled();
    });

    it('disminuye cantidad si es mayor a 1', () => {
        const decreaseQuantity = vi.fn();

        renderCart({ decreaseQuantity });

        fireEvent.click(screen.getByText('-'));

        expect(decreaseQuantity).toHaveBeenCalledWith(1);
    });

    it('muestra mensaje de carrito vacío', () => {
        renderCart({
            cart: [],
            getCartTotal: vi.fn(() => 0),
        });

        expect(screen.getByText('Tu carrito está vacío')).toBeTruthy();
    });

    it('descuenta stock al pagar correctamente', async () => {
        const clearCart = vi.fn();

        renderCart({ clearCart });

        fireEvent.change(screen.getByPlaceholderText('0000 0000 0000 0000'), {
            target: { value: '1234567890123456' },
        });

        fireEvent.change(screen.getByPlaceholderText('Ej. Juan Pérez'), {
            target: { value: 'Dangelo Lopez' },
        });

        fireEvent.change(screen.getByPlaceholderText('MM/AA'), {
            target: { value: '12/30' },
        });

        fireEvent.change(screen.getByPlaceholderText('123'), {
            target: { value: '123' },
        });

        fireEvent.click(screen.getByText('Pagar CLP 20000.00'));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                'http://localhost:8082/productos/1/descontar-stock',
                expect.objectContaining({
                    method: 'PATCH',
                })
            );
        });
    });

    it('muestra error si no hay stock suficiente al pagar', async () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                json: () =>
                    Promise.resolve({
                        success: false,
                        message: 'Stock insuficiente',
                    }),
            })
        );

        renderCart();

        fireEvent.change(screen.getByPlaceholderText('0000 0000 0000 0000'), {
            target: { value: '1234567890123456' },
        });

        fireEvent.change(screen.getByPlaceholderText('Ej. Juan Pérez'), {
            target: { value: 'Dangelo Lopez' },
        });

        fireEvent.change(screen.getByPlaceholderText('MM/AA'), {
            target: { value: '12/30' },
        });

        fireEvent.change(screen.getByPlaceholderText('123'), {
            target: { value: '123' },
        });

        fireEvent.click(screen.getByText('Pagar CLP 20000.00'));

        await waitFor(() => {
            expect(screen.getByText(/Stock insuficiente/i)).toBeTruthy();
        });
    });
});