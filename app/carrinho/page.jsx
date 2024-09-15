// CartPage.js
'use client';
import React, { useEffect, useState, useContext } from 'react';
import { ClienteContext } from '@/contexts/client';
import styles from './CartPage.module.css';
import CheckoutSummary from './CheckoutSummary';

const CartPage = () => {
    const { clienteId } = useContext(ClienteContext);
    const [itensCarrinho, setItensCarrinho] = useState([]);
    const [produtosDetalhes, setProdutosDetalhes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Função para buscar o carrinho ativo do cliente
    const buscarCarrinhoAtivo = async (clienteId) => {
        const response = await fetch(`https://veraflor.onrender.com/carrinho/listaAtivos/${clienteId}`);
        const carrinho = await response.json();
        return carrinho.length > 0 ? carrinho[0] : null;
    };

    // Função para buscar os itens do carrinho
    const buscarItensCarrinho = async (carrinhoId) => {
        try {
            const response = await fetch(`https://veraflor.onrender.com/itens/${carrinhoId}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar itens do carrinho');
            }
            const data = await response.json();
            setItensCarrinho(data);
            return data; // Retorna os itens do carrinho para podermos usar os IDs dos produtos
        } catch (error) {
            setError(error.message);
        }
    };

    // Função para buscar os detalhes dos produtos
    const buscarDetalhesProdutos = async (produtosIds) => {
        try {
            const response = await fetch(`https://veraflor.onrender.com/produtos?ids=${produtosIds.join(',')}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar detalhes dos produtos');
            }
            const data = await response.json();
            setProdutosDetalhes(data);
        } catch (error) {
            setError(error.message);
        }
    };

    // Função para combinar os itens do carrinho com os detalhes dos produtos
    const combinarCarrinhoComProdutos = (itens, produtos) => {
        return itens.map(item => {
            const produto = produtos.find(prod => prod.id === item.produto_id);
            return {
                ...item,
                produto: produto || {} // Garantir que o produto seja vazio se não encontrado
            };
        });
    };

    useEffect(() => {
        const fetchCarrinhoEProdutos = async () => {
            if (clienteId) {
                const carrinhoAtivo = await buscarCarrinhoAtivo(clienteId);
                if (carrinhoAtivo) {
                    const itens = await buscarItensCarrinho(carrinhoAtivo.id);
                    const produtosIds = itens.map(item => item.produto_id);
                    await buscarDetalhesProdutos(produtosIds);
                } else {
                    setItensCarrinho([]);
                    setLoading(false);
                }
            }
        };

        fetchCarrinhoEProdutos();
    }, [clienteId]);

    useEffect(() => {
        if (itensCarrinho.length && produtosDetalhes.length) {
            const itensComProdutos = combinarCarrinhoComProdutos(itensCarrinho, produtosDetalhes);
            setItensCarrinho(itensComProdutos);
            setLoading(false);
        }
    }, [itensCarrinho, produtosDetalhes]);

    // Calcula o valor total e a quantidade total de produtos
    const totalValor = itensCarrinho.reduce((acc, item) => {
        return acc + (item.produto && item.produto.preco ? (item.produto.preco * item.quantidade) : 0);
    }, 0);
    
    const totalProdutos = itensCarrinho.reduce((acc, item) => acc + item.quantidade, 0);

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>Erro: {error}</p>;
    if (!itensCarrinho.length) return <p>Seu carrinho está vazio.</p>;

    return (
        <div className={styles.cartContainer}>
            <h2>Meu Carrinho</h2>
            <div className={styles.cartContent}>
                <div className={styles.cartItems}>
                    {itensCarrinho.map((item) => (
                        <div key={item.id} className={styles.cartItem}>
                            <img
                                src={`https://veraflor.onrender.com/public/upload/${item.produto.imagem}`}
                                alt={item.produto.descricao}
                                className={styles.cartItemImage}
                            />
                            <div className={styles.cartItemDetails}>
                                <h3>{item.produto.descricao}</h3>
                                <p>Quantidade: {item.quantidade}</p>
                                <p>Preço: R$ {item.produto.preco}</p>
                                <p>Total: R$ {(item.quantidade * item.produto.preco).toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <CheckoutSummary totalProdutos={totalProdutos} totalValor={totalValor} />
            </div>
        </div>
    );
};

export default CartPage;
