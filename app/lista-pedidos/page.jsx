// app/lista-pedidos/ListaPedidos.jsx

'use client';

import React, { useEffect, useState } from 'react';
import styles from './listaPedidos.module.css';
import { withAuth } from '@/util/auth';
import Pagination from '@mui/material/Pagination';

const ListaPedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [clientesMap, setClientesMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const itemsPerPage = 20;

    // Estados para ordenação
    const [sortColumn, setSortColumn] = useState('id');
    const [sortDirection, setSortDirection] = useState('asc');

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await fetch('https://veraflor.onrender.com/pedidos/listar');
                if (!response.ok) {
                    throw new Error('Erro ao buscar pedidos');
                }
                const data = await response.json();
                setPedidos(data);
            } catch (error) {
                console.error('Erro ao buscar pedidos:', error);
            }
        };

        const fetchClientes = async () => {
            try {
                const response = await fetch('https://veraflor.onrender.com/clientes');
                if (!response.ok) {
                    throw new Error('Erro ao buscar clientes');
                }
                const data = await response.json();
                const map = {};
                data.forEach(cliente => {
                    map[cliente.id] = cliente.nome;
                });
                setClientesMap(map);
            } catch (error) {
                console.error('Erro ao buscar clientes:', error);
            }
        };

        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchPedidos(), fetchClientes()]);
            setLoading(false);
        };

        fetchData();
    }, []);

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const handleEntregueChange = async (pedidoId) => {
        try {
            const response = await fetch(`https://veraflor.onrender.com/pedidos/entregue/${pedidoId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar status de entrega');
            }

            // Atualiza o estado localmente
            setPedidos(prevPedidos =>
                prevPedidos.map(pedido =>
                    pedido.id === pedidoId ? { ...pedido, entregue: !pedido.entregue } : pedido
                )
            );
        } catch (error) {
            console.error('Erro ao atualizar status de entrega:', error);
        }
    };

    // Função para lidar com a ordenação
    const handleSort = (column) => {
        if (sortColumn === column) {
            // Alterna a direção da ordenação
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // Define a nova coluna de ordenação
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    // Função para ordenar os dados
    const sortData = (data) => {
        return data.sort((a, b) => {
            let aValue, bValue;

            switch (sortColumn) {
                case 'cliente':
                    aValue = clientesMap[a.cliente_id] || '';
                    bValue = clientesMap[b.cliente_id] || '';
                    break;
                case 'total':
                    aValue = parseFloat(a.total);
                    bValue = parseFloat(b.total);
                    break;
                case 'forma_pagamento':
                    aValue = a.forma_pagamento;
                    bValue = b.forma_pagamento;
                    break;
                case 'forma_entrega':
                    aValue = a.forma_entrega;
                    bValue = b.forma_entrega;
                    break;
                case 'createdAt':
                    aValue = new Date(a.createdAt);
                    bValue = new Date(b.createdAt);
                    break;
                default:
                    // Por padrão, ordena por ID
                    aValue = a.id;
                    bValue = b.id;
            }

            if (aValue < bValue) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    const sortedData = sortData([...pedidos]); // Cria uma cópia dos pedidos para não mutar o estado original
    const currentPageItems = sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>Lista de Pedidos</div>
            </div>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('id')} className={styles.clickableHeader}>
                                N° Pedido {sortColumn === 'id' && (sortDirection === 'asc' ? '▲' : '▼')}
                            </th>
                            <th onClick={() => handleSort('cliente')} className={styles.clickableHeader}>
                                Cliente {sortColumn === 'cliente' && (sortDirection === 'asc' ? '▲' : '▼')}
                            </th>
                            <th onClick={() => handleSort('total')} className={styles.clickableHeader}>
                                Total {sortColumn === 'total' && (sortDirection === 'asc' ? '▲' : '▼')}
                            </th>
                            <th onClick={() => handleSort('forma_pagamento')} className={styles.clickableHeader}>
                                Forma de Pagamento {sortColumn === 'forma_pagamento' && (sortDirection === 'asc' ? '▲' : '▼')}
                            </th>
                            <th onClick={() => handleSort('forma_entrega')} className={styles.clickableHeader}>
                                Forma de Entrega {sortColumn === 'forma_entrega' && (sortDirection === 'asc' ? '▲' : '▼')}
                            </th>
                            <th onClick={() => handleSort('createdAt')} className={styles.clickableHeader}>
                                Data de Criação {sortColumn === 'createdAt' && (sortDirection === 'asc' ? '▲' : '▼')}
                            </th>
                            <th>Entregue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPageItems.map((pedido) => (
                            <tr key={pedido.id} className={styles.tableRow}>
                                <td>{pedido.id}</td>
                                <td>{clientesMap[pedido.cliente_id] || 'N/A'}</td>
                                <td>
                                    {new Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    }).format(pedido.total)}
                                </td>
                                <td>{pedido.forma_pagamento}</td>
                                <td>{pedido.forma_entrega}</td>
                                <td>{new Date(pedido.createdAt).toLocaleDateString('pt-BR')}</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={pedido.entregue}
                                        onChange={() => handleEntregueChange(pedido.id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className={styles.paginationContainer}>
                <Pagination
                    count={Math.ceil(pedidos.length / itemsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                />
            </div>
        </div>
    );
};

export default withAuth(ListaPedidos);
