import React, { useContext } from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider, CartContext } from '../context/CartContext';

function TestComponent() {
    const {
        cart,
        cartMessage,
        addToCart,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
    } = useContext(CartContext);

    const producto = {
        id: 1,
        nombre: 'Alimento Premium',
        precio: 10000,
        stock: 2,
    };

    const productoAgotado = {
        id: 2,
        nombre: 'Producto Agotado',
        precio: 5000,
        stock: 0,
    };

    return (
        <div>
            <p data-testid="count">{getCartCount()}</p>
            <p data-testid="total">{getCartTotal()}</p>
            <p data-testid="items">{cart.length}</p>
            <p data-testid="message">{cartMessage}</p>

            <button onClick={() => addToCart(producto)}>Agregar</button>
            <button onClick={() => addToCart(productoAgotado)}>Agregar agotado</button>
            <button onClick={() => decreaseQuantity(1)}>Disminuir</button>
            <button onClick={() => removeFromCart(1)}>Eliminar</button>
            <button onClick={clearCart}>Vaciar</button>
        </div>
    );
}

describe('CartContext', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('agrega un producto al carrito', () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        fireEvent.click(screen.getByText('Agregar'));

        expect(screen.getByTestId('items').textContent).toBe('1');
        expect(screen.getByTestId('count').textContent).toBe('1');
    });

    it('calcula correctamente el total del carrito', () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        fireEvent.click(screen.getByText('Agregar'));
        fireEvent.click(screen.getByText('Agregar'));

        expect(screen.getByTestId('total').textContent).toBe('20000');
    });

    it('no permite agregar productos agotados', () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        fireEvent.click(screen.getByText('Agregar agotado'));

        expect(screen.getByTestId('items').textContent).toBe('0');
        expect(screen.getByTestId('message').textContent).toBe('Producto agotado');
    });

    it('no permite superar el stock disponible', () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        fireEvent.click(screen.getByText('Agregar'));
        fireEvent.click(screen.getByText('Agregar'));
        fireEvent.click(screen.getByText('Agregar'));

        expect(screen.getByTestId('count').textContent).toBe('2');
        expect(screen.getByTestId('message').textContent).toBe('No hay suficiente stock disponible.');
    });

    it('elimina un producto del carrito', () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        fireEvent.click(screen.getByText('Agregar'));
        fireEvent.click(screen.getByText('Eliminar'));

        expect(screen.getByTestId('items').textContent).toBe('0');
    });

    it('vacía el carrito correctamente', () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        fireEvent.click(screen.getByText('Agregar'));
        fireEvent.click(screen.getByText('Vaciar'));

        expect(screen.getByTestId('items').textContent).toBe('0');
        expect(screen.getByTestId('count').textContent).toBe('0');
    });
});