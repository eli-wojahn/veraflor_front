'use client';
import React, { useEffect, useState, useContext } from 'react';
import { ClienteContext } from '@/contexts/client';
import styles from './ClienteArea.module.css';

const ClienteArea = () => {
    const { clienteId } = useContext(ClienteContext);
    const [cliente, setCliente] = useState({
        nome: '',
        email: '',
        cpf: '',
        dataNasc: '',
        senha: ''
    });
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        if (clienteId) {
            const buscarCliente = async () => {
                try {
                    const response = await fetch(`https://veraflor.onrender.com/clientes`);
                    if (!response.ok) {
                        throw new Error('Erro ao buscar dados dos clientes');
                    }
                    const data = await response.json();
                    // Filtra o cliente pelo ID
                    const clienteAtual = data.find(cliente => cliente.id === clienteId);
                    if (clienteAtual) {
                        setCliente({
                            nome: clienteAtual.nome,
                            email: clienteAtual.email,
                            cpf: clienteAtual.cpf,
                            dataNasc: clienteAtual.dataNasc,
                            senha: clienteAtual.senha
                        });
                    } else {
                        throw new Error('Cliente não encontrado');
                    }
                } catch (error) {
                    console.error(error);
                    setStatusMessage('Erro ao carregar dados do cliente.');
                }
            };
            buscarCliente();
        }
    }, [clienteId]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCliente(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`https://veraflor.onrender.com/clientes/altera/${clienteId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cliente)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Erro do servidor:', errorData);
                throw new Error(errorData.msg || 'Erro ao salvar dados');
            }

            const data = await response.json();
            console.log('Dados atualizados:', data);
            setStatusMessage('Dados salvos com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            setStatusMessage('Erro ao salvar dados. Tente novamente.');
        }
    };

    return (
        <div className={styles.container}>
            <h1>Seus Dados</h1>
            {statusMessage && <p className={styles.statusMessage}>{statusMessage}</p>}
            <form onSubmit={handleSubmit} className={styles.form}>
                <label className={styles.label}>
                    Nome completo
                    <input 
                        type="text" 
                        name="nome" 
                        value={cliente.nome} 
                        onChange={handleInputChange} 
                        className={styles.input} 
                    />
                </label>
                <label className={styles.label}>
                    Data de nascimento
                    <input 
                        type="date" 
                        name="dataNasc" 
                        value={cliente.dataNasc} 
                        onChange={handleInputChange} 
                        className={styles.input} 
                    />
                </label>
                <label className={styles.label}>
                    CPF
                    <input 
                        type="text" 
                        name="cpf" 
                        value={cliente.cpf} 
                        onChange={handleInputChange} 
                        className={styles.input} 
                    />
                </label>
                <label className={styles.label}>
                    E-mail
                    <input 
                        type="email" 
                        name="email" 
                        value={cliente.email} 
                        onChange={handleInputChange} 
                        className={styles.input} 
                    />
                </label>
                <button type="submit" className={styles.button}>Salvar Alterações</button>
            </form>
        </div>
    );
};

export default ClienteArea;
