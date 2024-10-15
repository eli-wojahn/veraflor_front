"use client";
import React, { useState, useEffect, useContext } from 'react';
import { ClienteContext } from '@/contexts/client';
import styles from './CheckoutPage.module.css';
import SummaryCheckout from './SummaryCheckout';
import Link from 'next/link';
import Swal from 'sweetalert2'; 
import 'sweetalert2/dist/sweetalert2.min.css';

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
    const [erroMensagem, setErroMensagem] = useState('');
    const [deliveryOption, setDeliveryOption] = useState('entrega'); // Estado para a opção de entrega

    useEffect(() => {
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
        setErroMensagem('');

        if (!paymentData.numeroCartao || paymentData.numeroCartao.length < 16) {
            Swal.fire({
                icon: 'error',
                title: 'Número do cartão inválido',
                text: 'Esse número não é de um cartão válido.',
                confirmButtonText: 'OK'
            });
            return;
        }
        if (!paymentData.mesExpiracao || !paymentData.anoExpiracao) {
            Swal.fire({
                icon: 'error',
                title: 'Data de expiração inválida',
                text: 'Essa não é uma data de expiração válida.',
                confirmButtonText: 'OK'
            });
            return;
        }
        if (!paymentData.codigoSeguranca || paymentData.codigoSeguranca.length < 3) {
            Swal.fire({
                icon: 'error',
                title: 'Código de segurança inválido',
                text: 'Esse não é um código de segurança válido.',
                confirmButtonText: 'OK'
            });
            return;
        }
        if (!paymentData.nomeTitular) {
            Swal.fire({
                icon: 'error',
                title: 'Nome do titular do cartão é obrigatório',
                text: 'É obrigatório preencher nome do titular.',
                confirmButtonText: 'OK'
            });
            return;
        }

        const dadosParaEnviar = {
            clienteId: clienteId,
            carrinhoId: carrinhoId,
            dadosPagamento: paymentData,
            deliveryOption: deliveryOption // Adiciona a opção de entrega
        };

        try {
            const response = await fetch('https://veraflor.onrender.com/criarPedido', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosParaEnviar)
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Pedido efetuado com sucesso!',
                    text: 'Seu pedido foi processado com sucesso.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    window.location.href = '/checkout-status'; 
                });
            } else {
                const erroData = await response.json();
                setErroMensagem(`Erro ao processar o pedido: ${erroData.message || 'Erro desconhecido'}`);

                Swal.fire({
                    icon: 'error',
                    title: 'Erro ao processar o pagamento',
                    text: erroData.message || 'Ocorreu um erro desconhecido. Tente novamente.',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            setErroMensagem('Erro ao enviar o pedido. Tente novamente.');
            console.error('Erro ao enviar o pedido:', error);

            Swal.fire({
                icon: 'error',
                title: 'Erro de Conexão',
                text: 'Houve um erro ao tentar enviar o pedido. Tente novamente.',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <div className={styles.checkoutContainer}>
            <h2>Finalizar Pedido</h2>
            {erroMensagem && <div className={styles.error}>{erroMensagem}</div>}
            <div className={styles.checkoutContent}>
                <div className={styles.paymentFormsContainer}>
                    <div className={styles.paymentForm}>
                        <h3>Pagar com Cartão de Crédito</h3>
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
                            <button type="submit" className={styles.submitButton}>Pagar com cartão</button>
                        </form>
                    </div>

                    <div className={styles.paymentForm}>
                        <h3>Pagar com Pix</h3>
                        <div className={styles.pixInfo}>
                            <p>Aprovação em minutos</p>
                            <ol className={styles.pixInstructions}>
                                <li>Após a finalização do pedido, abra o app ou banco de sua preferência. Escolha a opção pagar com código Pix “copia e cola”, ou código QR.</li>
                                <li>Copie e cole o código, ou escaneie o código QR com a câmera do seu celular. Confira todas as informações e autorize o pagamento.</li>
                                <li>Você vai receber a confirmação de pagamento no seu e-mail e através dos nossos canais.</li>
                            </ol>
                            <Link href="/checkout-pix" passHref>
                                <button className={styles.submitButton}>Pagar com Pix</button>
                            </Link>
                        </div>
                    </div>
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
                    </div>

                    <SummaryCheckout totalProdutos={totalProdutos} totalValor={totalValor} />
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
