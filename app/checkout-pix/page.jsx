"use client";
import React, { useState, useEffect, useContext } from 'react';
import { ClienteContext } from '@/contexts/client';
import styles from './CheckoutPix.module.css';
import Swal from 'sweetalert2'; 
import 'sweetalert2/dist/sweetalert2.min.css';
import { IoCopyOutline } from "react-icons/io5";

const CheckoutPixPage = () => {
    const { clienteId } = useContext(ClienteContext);
    const [qrCodeData, setQrCodeData] = useState(null);
    const [qrCodeUrl, setQrCodeUrl] = useState(null); 
    const [carrinhoId, setCarrinhoId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erroMensagem, setErroMensagem] = useState('');

    useEffect(() => {
        const fetchCarrinho = async () => {
            if (clienteId) {
                try {
                    const response = await fetch(`https://veraflor.onrender.com/carrinho/listaAtivos/${clienteId}`);
                    const carrinho = await response.json();
                    if (carrinho.length > 0) {
                        const carrinhoAtivo = carrinho[0];
                        setCarrinhoId(carrinhoAtivo.id);
                    } else {
                        setErroMensagem('Nenhum carrinho ativo encontrado.');
                        setLoading(false);
                    }
                } catch (error) {
                    console.error('Erro ao carregar o carrinho:', error);
                    setErroMensagem('Erro ao carregar o carrinho.');
                    setLoading(false);
                }
            }
        };

        fetchCarrinho();
    }, [clienteId]);

    useEffect(() => {
        const criarPedidoPix = async () => {
            if (clienteId && carrinhoId) {
                try {
                    const response = await fetch('https://veraflor.onrender.com/checkoutPix', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ clienteId, carrinhoId })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const qrCodeUrl = data.qr_codes[0].links.find(link => link.media === 'image/png').href;
                        const pixText = data.qr_codes[0].text;
                        setQrCodeData(pixText); 
                        setQrCodeUrl(qrCodeUrl); 
                    } else {
                        const erroData = await response.json();
                        setErroMensagem(`Erro ao criar pedido PIX: ${erroData.message || 'Erro desconhecido'}`);
                    }
                } catch (error) {
                    console.error('Erro ao criar pedido PIX:', error);
                    setErroMensagem('Erro ao criar pedido PIX. Tente novamente.');
                } finally {
                    setLoading(false);
                }
            }
        };

        if (carrinhoId) {
            criarPedidoPix();
        }
    }, [clienteId, carrinhoId]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(qrCodeData)
            .then(() => {
                Swal.fire('Copiado!', 'O código Pix foi copiado para a área de transferência.', 'success');
            })
            .catch(err => {
                console.error('Erro ao copiar para a área de transferência', err);
            });
    };

    const handleFinishPurchase = () => {
        window.location.href = '/checkout-status';
    };

    if (loading) {
        return <div className={styles.loading}>Carregando...</div>;
    }

    if (erroMensagem) {
        return <div className={styles.error}>{erroMensagem}</div>;
    }

    return (
        <div className={styles.checkoutPixContainer}>
            <h2>Pagamento via Pix</h2>
            {qrCodeData && qrCodeUrl ? (
                <div className={styles.qrCodeContainer}>
                    <p>Escaneie o QR Code abaixo para realizar o pagamento:</p>
                    <img src={qrCodeUrl} alt="QR Code Pix" className={styles.qrCodeImage} />
                    <p>Ou copie e cole o código Pix:</p>
                    <div className={styles.copyContainer}>
                        <textarea readOnly value={qrCodeData} className={styles.pixCode}></textarea>
                        <button onClick={copyToClipboard} className={styles.copyButton}>
                            <IoCopyOutline size={24} />
                        </button>
                    </div>
                    <button onClick={handleFinishPurchase} className={styles.finishButton}>
                        Finalizar compra
                    </button>
                </div>
            ) : (
                <p>Erro ao obter o QR Code.</p>
            )}
        </div>
    );
};

export default CheckoutPixPage;
