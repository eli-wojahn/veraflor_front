'use client';

import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import styles from './PedidoDetalhes.module.css';

const PedidoDetalhes = ({ params }) => {
    const { id } = params;
    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPedido = async () => {
            try {
                // Buscar o pedido completo
                const response = await fetch(`https://veraflor.onrender.com/pedidos/completo/${id}`);
                if (!response.ok) {
                    throw new Error('Erro ao buscar pedido completo');
                }
                const data = await response.json();
                setPedido(data);
                setLoading(false);
            } catch (error) {
                console.error('Erro ao buscar detalhes do pedido:', error);
                setLoading(false);
            }
        };

        if (id) {
            fetchPedido();
        }
    }, [id]);

    const generatePDF = () => {
        if (!pedido) return;

        const doc = new jsPDF();

        // Informações do pedido
        doc.setFontSize(16);
        doc.text(`Detalhes do Pedido #${pedido.id}`, 10, 10);

        doc.setFontSize(12);
        doc.text(`Cliente: ${pedido.cliente.nome}`, 10, 20);
        doc.text(`CPF: ${pedido.cliente.cpf}`, 10, 26);
        doc.text(`Celular: ${pedido.cliente.celular}`, 10, 32);

        const endereco = pedido.cliente.endereco;
        doc.text(`Endereço: ${endereco.endereco}, ${endereco.numero}`, 10, 38);
        doc.text(`Complemento: ${endereco.complemento}`, 10, 44);
        doc.text(`Bairro: ${endereco.bairro}`, 10, 50);
        doc.text(`Cidade: ${endereco.cidade} - ${endereco.estado}`, 10, 56);
        doc.text(`CEP: ${endereco.cep}`, 10, 62);

        doc.text(`Total: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedido.total)}`, 10, 68);
        doc.text(`Forma de Pagamento: ${pedido.forma_pagamento}`, 10, 74);
        doc.text(`Forma de Entrega: ${pedido.forma_entrega}`, 10, 80);
        doc.text(`Data de Criação: ${new Date(pedido.createdAt).toLocaleDateString('pt-BR')}`, 10, 86);
        doc.text(`Entregue: ${pedido.entregue ? 'Sim' : 'Não'}`, 10, 92);

        // Itens do pedido
        const itemColumns = ['Produto', 'Quantidade', 'Preço Unitário', 'Total'];
        const itemRows = pedido.carrinho.carrinhoItens.map(item => [
            item.produto.descricao,
            item.quantidade.toString(),
            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.produto.preco),
            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.quantidade * item.produto.preco),
        ]);

        autoTable(doc, {
            startY: 100,
            head: [itemColumns],
            body: itemRows,
        });

        doc.save(`Pedido_${pedido.id}.pdf`);
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!pedido) {
        return <div>Pedido não encontrado</div>;
    }

    // Renderizar os detalhes
    const endereco = pedido.cliente.endereco;

    return (
        <div className={styles.detailsContainer}>
            <h1>Detalhes do Pedido #{pedido.id}</h1>
            <h2>Informações do Cliente</h2>
            <p><strong>Nome:</strong> {pedido.cliente.nome}</p>
            <p><strong>CPF:</strong> {pedido.cliente.cpf}</p>
            <p><strong>Celular:</strong> {pedido.cliente.celular}</p>

            <h2>Endereço de Entrega</h2>
            <p><strong>Endereço:</strong> {endereco.endereco}, {endereco.numero}</p>
            <p><strong>Complemento:</strong> {endereco.complemento}</p>
            <p><strong>Bairro:</strong> {endereco.bairro}</p>
            <p><strong>Cidade:</strong> {endereco.cidade} - {endereco.estado}</p>
            <p><strong>CEP:</strong> {endereco.cep}</p>

            <h2>Detalhes do Pedido</h2>
            <p><strong>Total:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedido.total)}</p>
            <p><strong>Forma de Pagamento:</strong> {pedido.forma_pagamento}</p>
            <p><strong>Forma de Entrega:</strong> {pedido.forma_entrega}</p>
            <p><strong>Data de Criação:</strong> {new Date(pedido.createdAt).toLocaleDateString('pt-BR')}</p>
            <p><strong>Entregue:</strong> {pedido.entregue ? 'Sim' : 'Não'}</p>

            <h2>Itens do Pedido</h2>
            <table className={styles.itemsTable}>
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Quantidade</th>
                        <th>Preço Unitário</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {pedido.carrinho.carrinhoItens.map((item, index) => (
                        <tr key={index}>
                            <td>{item.produto.descricao}</td>
                            <td>{item.quantidade}</td>
                            <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.produto.preco)}</td>
                            <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.quantidade * item.produto.preco)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button onClick={generatePDF} className={styles.pdfButton}>
                Salvar em PDF
            </button>
        </div>
    );
};

export default PedidoDetalhes;
