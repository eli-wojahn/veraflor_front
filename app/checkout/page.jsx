"use client"
import React, { useState, useEffect, useContext } from 'react';
import { ClienteContext } from '@/contexts/client';
import styles from './CheckoutPage.module.css';
import CheckoutSummary from '../carrinho/CheckoutSummary';
import Link from 'next/link';

const CheckoutPage = () => {
    const { clienteId } = useContext(ClienteContext);
    const [paymentData, setPaymentData] = useState({
        numeroCartao: '',
        mesExpiracao: '',
        anoExpiracao: '',
        codigoSeguranca: '',
        nomeTitular: ''
    });
    const [itensCarrinho, setItensCarrinho] = useState([]);
    const [totalValor, setTotalValor] = useState(0);
    const [totalProdutos, setTotalProdutos] = useState(0);
    const [carrinhoId, setCarrinhoId] = useState(null);
    const [enderecos, setEnderecos] = useState([]);

    useEffect(() => {
        // Fetch cart items and calculate totals
        const fetchCarrinho = async () => {
            if (clienteId) {
                try {
                    const response = await fetch(`https://veraflor.onrender.com/carrinho/listaAtivos/${clienteId}`);
                    const carrinho = await response.json();
                    if (carrinho.length > 0) {
                        const carrinhoAtivo = carrinho[0];
                        setCarrinhoId(carrinhoAtivo.id);
                        const itensResponse = await fetch(`https://veraflor.onrender.com/itens/${carrinhoAtivo.id}`);
                        const itens = await itensResponse.json();

                        // Fetch product details
                        const produtosIds = itens.map(item => item.produto_id);
                        const detalhesPromises = produtosIds.map(id =>
                            fetch(`https://veraflor.onrender.com/produtos/lista/${id}`).then(res => res.json())
                        );
                        const produtosDetalhes = await Promise.all(detalhesPromises);
                        const itensComProdutos = itens.map(item => {
                            const produto = produtosDetalhes.find(prod => prod.id === item.produto_id);
                            return {
                                ...item,
                                produto: produto || {}
                            };
                        });
                        setItensCarrinho(itensComProdutos);

                        // Calculate totals
                        const total = itensComProdutos.reduce((acc, item) => {
                            return acc + (item.produto && item.produto.preco ? (item.produto.preco * item.quantidade) : 0);
                        }, 0);
                        setTotalValor(total);
                        const totalQtd = itensComProdutos.reduce((acc, item) => acc + item.quantidade, 0);
                        setTotalProdutos(totalQtd);
                    } else {
                        setItensCarrinho([]);
                    }
                } catch (error) {
                    console.error('Erro ao carregar o carrinho:', error);
                }
            }
        };

        // Fetch customer addresses
        const fetchEnderecos = async () => {
            if (clienteId) {
                try {
                    const response = await fetch(`https://veraflor.onrender.com/endereco/${clienteId}`);
                    if (!response.ok) {
                        throw new Error('Erro ao buscar endereços');
                    }
                    const data = await response.json();
                    setEnderecos(data);
                } catch (error) {
                    console.error('Erro ao carregar endereços:', error);
                }
            }
        };

        fetchCarrinho();
        fetchEnderecos();
    }, [clienteId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPaymentData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dadosParaEnviar = {
            clienteId: clienteId,
            carrinhoId: carrinhoId,
            dadosPagamento: paymentData
        };

        try {
            // Enviar dados para o backend
            const response = await fetch('https://veraflor.onrender.com/pedidos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosParaEnviar)
            });

            if (response.ok) {
                // Sucesso: redirecionar ou mostrar mensagem
                console.log('Pedido realizado com sucesso!');
            } else {
                // Erro: tratar adequadamente
                console.error('Erro ao processar o pedido');
            }
        } catch (error) {
            console.error('Erro ao enviar o pedido:', error);
        }
    };

    return (
        <div className={styles.checkoutContainer}>
            <h2>Finalizar Pedido</h2>
            <div className={styles.checkoutContent}>
                <div className={styles.paymentForm}>
                    <h3>Pagamento</h3>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label>Número do Cartão:</label>
                            <input
                                type="text"
                                name="numeroCartao"
                                value={paymentData.numeroCartao}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroupRow}>
                            <div className={styles.formGroup}>
                                <label>Mês de Expiração:</label>
                                <input
                                    type="text"
                                    name="mesExpiracao"
                                    value={paymentData.mesExpiracao}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Ano de Expiração:</label>
                                <input
                                    type="text"
                                    name="anoExpiracao"
                                    value={paymentData.anoExpiracao}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Código de Segurança:</label>
                            <input
                                type="text"
                                name="codigoSeguranca"
                                value={paymentData.codigoSeguranca}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Nome do Titular:</label>
                            <input
                                type="text"
                                name="nomeTitular"
                                value={paymentData.nomeTitular}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <button type="submit" className={styles.submitButton}>Confirmar Pagamento</button>
                    </form>
                </div>
                <div className={styles.sideContainer}>
                    <div className={styles.addressBox}>
                        <h3>Endereço de Entrega</h3>
                        {enderecos.length > 0 ? (
                            <div className={styles.addressDetails}>
                                <p>{enderecos[0].endereco}, Nº {enderecos[0].numero}</p>
                                {enderecos[0].complemento && <p>Complemento: {enderecos[0].complemento}</p>}
                                <p>Bairro: {enderecos[0].bairro}</p>
                                <p>Cidade: {enderecos[0].cidade} - {enderecos[0].estado}</p>
                                <p>CEP: {enderecos[0].cep}</p>
                            </div>
                        ) : (
                            <p>Carregando endereço...</p>
                        )}
                        <Link href="/cliente-dados" passHref>
                            <button className={styles.changeAddressButton}>Escolher outro endereço</button>
                        </Link>
                    </div>
                    <CheckoutSummary totalProdutos={totalProdutos} totalValor={totalValor} />
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;