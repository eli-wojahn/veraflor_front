'use client';

import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import styles from './PedidoDetalhes.module.css';
import { useRouter } from 'next/navigation';

const PedidoDetalhes = ({ params }) => {
    const { id } = params;
    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const fetchPedido = async () => {
            try {
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

        doc.setFontSize(15);
        doc.text(`Pedido N°${pedido.id}`, 10, 10);

        let yPosition = 20;

        doc.setFontSize(13);
        doc.text('Informações do Cliente', 10, yPosition);
        yPosition += 6;

        doc.setFontSize(10);
        doc.text(`Nome: ${pedido.cliente.nome}`, 10, yPosition);
        yPosition += 6;
        doc.text(`CPF: ${pedido.cliente.cpf}`, 10, yPosition);
        yPosition += 6;
        doc.text(`Celular: ${pedido.cliente.celular}`, 10, yPosition);
        yPosition += 10;

        doc.setFontSize(13);
        doc.text('Detalhes do Pedido', 10, yPosition);
        yPosition += 6;

        doc.setFontSize(10);
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
                fillColor: [255, 255, 255], 
                textColor: [51, 51, 51],    
                lineColor: [204, 204, 204], 
            },
            headStyles: {
                fillColor: [255, 255, 255], 
                textColor: [51, 51, 51],    
                fontStyle: 'bold',
            },
        });

        yPosition = doc.lastAutoTable.finalY + 10;

        doc.setFontSize(13);
        doc.text('Endereço de Entrega', 10, yPosition);
        yPosition += 6;

        doc.setFontSize(10);
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


        doc.save(`Pedido_${pedido.id}.pdf`);
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!pedido) {
        return <div>Pedido não encontrado</div>;
    }

    const endereco = pedido.cliente.endereco;

    return (
        <div className={styles.detailsContainer}>
            <h2>Pedido Nº #{pedido.id}</h2>

            <h3>Informações do Cliente</h3>
            <p><strong>Nome:</strong> {pedido.cliente.nome}</p>
            <p><strong>CPF:</strong> {pedido.cliente.cpf}</p>
            <p><strong>Celular:</strong> {pedido.cliente.celular}</p>

            <h3>Detalhes do Pedido</h3>
            <p><strong>Total:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedido.total)}</p>
            <p><strong>Forma de Pagamento:</strong> {pedido.forma_pagamento}</p>
            <p><strong>Forma de Entrega:</strong> {pedido.forma_entrega}</p>
            <p><strong>Data de Criação:</strong> {new Date(pedido.createdAt).toLocaleDateString('pt-BR')}</p>
            <p><strong>Entregue:</strong> {pedido.entregue ? 'Sim' : 'Não'}</p>

            <h3>Itens do Pedido</h3>
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

            <h3>Endereço de Entrega</h3>
            <p><strong>Endereço:</strong> {endereco.endereco}, {endereco.numero}</p>
            <p><strong>Complemento:</strong> {endereco.complemento}</p>
            <p><strong>Bairro:</strong> {endereco.bairro}</p>
            <p><strong>Cidade:</strong> {endereco.cidade} - {endereco.estado}</p>
            <p><strong>CEP:</strong> {endereco.cep}</p>


            <button onClick={generatePDF} className={styles.pdfButton}>
                Salvar em PDF
            </button>

            <button onClick={() => router.push(`/lista-pedidos`)} className={styles.voltarButton}>
                Voltar
            </button>
        </div>
    );
};

export default PedidoDetalhes;
