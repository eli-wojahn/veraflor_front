'use client';
import React, { useState, useEffect } from 'react';

const CartPage = ({ clienteId }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCartItems = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://veraflor.onrender.com/carrinho/${clienteId}`);
                if (!response.ok) {
                    throw new Error('Erro ao obter itens do carrinho');
                }
                const data = await response.json();
                setCartItems(data);
            } catch (error) {
                console.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [clienteId]);

    if (loading) return <p>Carregando...</p>;

    if (cartItems.length === 0) return <p>Carrinho vazio</p>;

    return (
        <div>
            <h1>Seu Carrinho</h1>
            <ul>
                {cartItems.map(item => (
                    <li key={item.id}>
                        {item.produto.descricao} - {item.quantidade} unidades
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CartPage;
