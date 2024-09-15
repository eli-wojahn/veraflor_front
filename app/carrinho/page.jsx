'use client';
import React, { useEffect, useState, useContext } from 'react';
import { ClienteContext } from '@/contexts/client';
import styles from './CartPage.module.css';
import CheckoutSummary from './CheckoutSummary';
import { BsTrash } from 'react-icons/bs';  // Importando o ícone de lixeira
import { CiCirclePlus, CiCircleMinus } from 'react-icons/ci';  // Ícones para quantidade

const CartPage = () => {
    const { clienteId } = useContext(ClienteContext);
    const [itensCarrinho, setItensCarrinho] = useState([]);
    const [produtosDetalhes, setProdutosDetalhes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingActions, setLoadingActions] = useState([]);

    const adicionarLoading = (itemId) => setLoadingActions(prev => [...prev, itemId]);
    const removerLoading = (itemId) => setLoadingActions(prev => prev.filter(id => id !== itemId));

    const buscarCarrinhoAtivo = async (clienteId) => {
        const response = await fetch(`https://veraflor.onrender.com/carrinho/listaAtivos/${clienteId}`);
        const carrinho = await response.json();
        return carrinho.length > 0 ? carrinho[0] : null;
    };

    const buscarItensCarrinho = async (carrinhoId) => {
        try {
            const response = await fetch(`https://veraflor.onrender.com/itens/${carrinhoId}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar itens do carrinho');
            }
            const data = await response.json();
            setItensCarrinho(data);
            return data;
        } catch (error) {
            setError(error.message);
        }
    };

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

    const combinarCarrinhoComProdutos = (itens, produtos) => {
        return itens.map(item => {
            const produto = produtos.find(prod => prod.id === item.produto_id);
            return {
                ...item,
                produto: produto || {}
            };
        });
    };

    const removerItemDoCarrinho = async (itemId) => {
        try {
            adicionarLoading(itemId);
            setItensCarrinho(prev => prev.filter(item => item.id !== itemId)); 
            await fetch(`https://veraflor.onrender.com/itens/${itemId}`, { method: 'DELETE' });
        } catch (error) {
            console.error('Erro ao remover item do carrinho:', error);
        } finally {
            removerLoading(itemId);
        }
    };

    const atualizarQuantidade = async (produtoId, novaQuantidade) => {
        if (novaQuantidade <= 0) return;
        try {
            adicionarLoading(produtoId);
            setItensCarrinho(prev => prev.map(item => 
                item.produto_id === produtoId ? { ...item, quantidade: novaQuantidade } : item
            ));
            await fetch(`https://veraflor.onrender.com/itens/altera/${clienteId}/${produtoId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantidade: novaQuantidade })
            });
        } catch (error) {
            console.error('Erro ao atualizar quantidade:', error);
        } finally {
            removerLoading(produtoId);
        }
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
                                <BsTrash className={styles.trashIcon} onClick={() => removerItemDoCarrinho(item.id)} />
                                <p>Preço: R$ {item.produto.preco}</p>
                                <div className={styles.quantityTotal}>
                                    <div className={styles.quantityControl}>
                                        <CiCircleMinus 
                                            className={styles.quantityButton} 
                                            onClick={() => atualizarQuantidade(item.produto_id, item.quantidade - 1)} 
                                            disabled={loadingActions.includes(item.produto_id)} 
                                        />
                                        <span>{loadingActions.includes(item.produto_id) ? '...' : item.quantidade}</span>
                                        <CiCirclePlus 
                                            className={styles.quantityButton} 
                                            onClick={() => atualizarQuantidade(item.produto_id, item.quantidade + 1)} 
                                            disabled={loadingActions.includes(item.produto_id)} 
                                        />
                                    </div>
                                    <p className={styles.totalPrice}>Total: R$ {(item.quantidade * item.produto.preco).toFixed(2)}</p>
                                </div>
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
