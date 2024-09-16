'use client';
import React, { useEffect, useState, useContext } from 'react';
import Swal from 'sweetalert2'; 
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
    const [activeSection, setActiveSection] = useState('meus-dados');

    useEffect(() => {
        if (clienteId) {
            const buscarCliente = async () => {
                try {
                    const response = await fetch(`https://veraflor.onrender.com/clientes`);
                    if (!response.ok) {
                        throw new Error('Erro ao buscar dados dos clientes');
                    }
                    const data = await response.json();

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
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro',
                        text: 'Erro ao carregar dados do cliente.',
                    });
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
            Swal.fire({
                icon: 'success',
                title: 'Sucesso',
                text: 'Dados salvos com sucesso!',
            });
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Erro ao salvar dados. Tente novamente.',
            });
        }
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'meus-dados':
                return (
                    <div className={styles.content}>
                        <h1>Meus Dados</h1>
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
            // Outros casos para 'pedidos' e 'endereços' podem ser adicionados aqui
            default:
                return null;
        }
    };

    return (
        <div className={styles.wrapper}>
            <aside className={styles.sidebar}>
                <ul>
                    <li onClick={() => setActiveSection('meus-dados')} className={activeSection === 'meus-dados' ? styles.active : ''}>Meus dados</li>
                    <li onClick={() => setActiveSection('pedidos')} className={activeSection === 'pedidos' ? styles.active : ''}>Pedidos</li>
                    <li onClick={() => setActiveSection('enderecos')} className={activeSection === 'enderecos' ? styles.active : ''}>Endereços</li>
                </ul>
            </aside>
            <div className={styles.contentContainer}>
                <main className={styles.mainContent}>
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default ClienteArea;
