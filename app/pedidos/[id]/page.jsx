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

        // Título do documento
        doc.setFontSize(16);
        doc.text(`Detalhes do Pedido #${pedido.id}`, 10, 10);

        let yPosition = 20;

        // Informações do Cliente
        doc.setFontSize(14);
        doc.text('Informações do Cliente', 10, yPosition);
        yPosition += 6;

        doc.setFontSize(12);
        doc.text(`Nome: ${pedido.cliente.nome}`, 10, yPosition);
        yPosition += 6;
        doc.text(`CPF: ${pedido.cliente.cpf}`, 10, yPosition);
        yPosition += 6;
        doc.text(`Celular: ${pedido.cliente.celular}`, 10, yPosition);
        yPosition += 10;

        // Detalhes do Pedido
        doc.setFontSize(14);
        doc.text('Detalhes do Pedido', 10, yPosition);
        yPosition += 6;

        doc.setFontSize(12);
        doc.text(`Total: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedido.total)}`, 10, yPosition);
        yPosition += 6;
        doc.text(`Forma de Pagamento: ${pedido.forma_pagamento}`, 10, yPosition);
        yPosition += 6;
        doc.text(`Forma de Entrega: ${pedido.forma_entrega}`, 10, yPosition);
        yPosition += 6;
        doc.text(`Data de Criação: ${new Date(pedido.createdAt).toLocaleDateString('pt-BR')}`, 10, yPosition);
        yPosition += 6;
        doc.text(`Entregue: ${pedido.entregue ? 'Sim' : 'Não'}`, 10, yPosition);
        yPosition += 10;

        // Itens do Pedido
        doc.setFontSize(14);
        doc.text('Itens do Pedido', 10, yPosition);
        yPosition += 6;

        // Tabela de itens
        const itemColumns = ['Produto', 'Quantidade', 'Preço Unitário', 'Total'];
        const itemRows = pedido.carrinho.carrinhoItens.map(item => [
            item.produto.descricao,
            item.quantidade.toString(),
            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.produto.preco),
            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.quantidade * item.produto.preco),
        ]);

        autoTable(doc, {
            startY: yPosition,
            head: [itemColumns],
            body: itemRows,
            styles: {
                fillColor: [255, 255, 255], // Fundo branco
                textColor: [51, 51, 51],    // Texto cinza escuro
                lineColor: [204, 204, 204], // Bordas cinza claro
            },
            headStyles: {
                fillColor: [255, 255, 255], // Remove o fundo do cabeçalho
                textColor: [51, 51, 51],    // Texto cinza escuro
                fontStyle: 'bold',
            },
        });

        yPosition = doc.lastAutoTable.finalY + 10;

        // Endereço de Entrega
        doc.setFontSize(14);
        doc.text('Endereço de Entrega', 10, yPosition);
        yPosition += 6;

        doc.setFontSize(12);
        const endereco = pedido.cliente.endereco;
        doc.text(`Endereço: ${endereco.endereco}, ${endereco.numero}`, 10, yPosition);
        yPosition += 6;
        doc.text(`Complemento: ${endereco.complemento}`, 10, yPosition);
        yPosition += 6;
        doc.text(`Bairro: ${endereco.bairro}`, 10, yPosition);
        yPosition += 6;
        doc.text(`Cidade: ${endereco.cidade} - ${endereco.estado}`, 10, yPosition);
        yPosition += 6;
        doc.text(`CEP: ${endereco.cep}`, 10, yPosition);

        // Salvar o PDF
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

            {/* Informações do Cliente */}
            <h2>Informações do Cliente</h2>
            <p><strong>Nome:</strong> {pedido.cliente.nome}</p>
            <p><strong>CPF:</strong> {pedido.cliente.cpf}</p>
            <p><strong>Celular:</strong> {pedido.cliente.celular}</p>

            {/* Detalhes do Pedido */}
            <h2>Detalhes do Pedido</h2>
            <p><strong>Total:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedido.total)}</p>
            <p><strong>Forma de Pagamento:</strong> {pedido.forma_pagamento}</p>
            <p><strong>Forma de Entrega:</strong> {pedido.forma_entrega}</p>
            <p><strong>Data de Criação:</strong> {new Date(pedido.createdAt).toLocaleDateString('pt-BR')}</p>
            <p><strong>Entregue:</strong> {pedido.entregue ? 'Sim' : 'Não'}</p>

            {/* Itens do Pedido */}
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

            {/* Endereço de Entrega */}
            <h2>Endereço de Entrega</h2>
            <p><strong>Endereço:</strong> {endereco.endereco}, {endereco.numero}</p>
            <p><strong>Complemento:</strong> {endereco.complemento}</p>
            <p><strong>Bairro:</strong> {endereco.bairro}</p>
            <p><strong>Cidade:</strong> {endereco.cidade} - {endereco.estado}</p>
            <p><strong>CEP:</strong> {endereco.cep}</p>

            {/* Botão para gerar PDF */}
            <button onClick={generatePDF} className={styles.pdfButton}>
                Salvar em PDF
            </button>
        </div>
    );
};

export default PedidoDetalhes;
