'use client';
import React, { useEffect, useState, useContext } from 'react';
import Swal from 'sweetalert2'; 
import { ClienteContext } from '@/contexts/client';
import styles from './ClienteArea.module.css';
import { IoHomeOutline } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import { RxAvatar } from "react-icons/rx";
import ClienteForm from './ClienteForm';
import EnderecoForm from './EnderecoForm';

const ClienteArea = () => {
    const { clienteId } = useContext(ClienteContext);
    const [cliente, setCliente] = useState({
        nome: '',
        email: '',
        cpf: '',
        dataNasc: '',
        senha: '',
        ddd: '',
        celular: '',
    });
    const [enderecos, setEnderecos] = useState([{}]); // Inicializa com um objeto vazio
    const [activeSection, setActiveSection] = useState('meus-dados');

    // Função para buscar dados do cliente
    const buscarCliente = async () => {
        try {
            const response = await fetch(`https://veraflor.onrender.com/clientes`);
            if (!response.ok) {
                throw new Error('Erro ao buscar dados dos clientes');
            }
            const data = await response.json();
            const clienteAtual = data.find(cliente => cliente.id === clienteId);
            if (clienteAtual) {
                const formattedDataNasc = formatDateForInput(clienteAtual.dataNasc);
                setCliente({
                    ...clienteAtual,
                    ddd: clienteAtual.area,
                    dataNasc: formattedDataNasc,
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

    // Função para buscar endereços
    const buscarEnderecos = async () => {
        try {
            const response = await fetch(`https://veraflor.onrender.com/endereco/${clienteId}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar endereços');
            }
            const data = await response.json();
            setEnderecos(data.length ? data : [{}]); // Se não houver endereços, inicializa com um objeto vazio
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Erro ao carregar endereços.',
            });
        }
    };

    useEffect(() => {
        if (clienteId) {
            buscarCliente();
            buscarEnderecos();
        }
    }, [clienteId]);

    function formatDateForInput(dateStr) {
        if (!dateStr) return '';
        const dateParts = dateStr.split('/');
        if (dateParts.length === 3) {
            const [day, month, year] = dateParts;
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        } else {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            } else {
                return '';
            }
        }
    }

    function formatDateForBackend(dateStr) {
        if (!dateStr) return '';
        const dateParts = dateStr.split('-');
        if (dateParts.length === 3) {
            const [year, month, day] = dateParts;
            return `${day}/${month}/${year}`;
        }
        return dateStr;
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCliente(prev => ({ ...prev, [name]: value }));
    };

    const handleEnderecoChange = (index, event) => {
        const { name, value } = event.target;
        setEnderecos(prev => {
            const updatedEnderecos = [...prev];
            updatedEnderecos[index] = { ...updatedEnderecos[index], [name]: value };
            return updatedEnderecos;
        });
    };

    const handleSubmitCliente = async (event) => {
        event.preventDefault();
        try {
            const clienteData = {
                ...cliente,
                area: cliente.ddd,
                dataNasc: formatDateForBackend(cliente.dataNasc),
            };
            delete clienteData.ddd;

            const response = await fetch(`https://veraflor.onrender.com/clientes/altera/${clienteId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clienteData)
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

    const handleSubmitEndereco = async (index) => {
        const endereco = enderecos[index];
        const method = endereco.id ? 'PUT' : 'POST';
        const url = endereco.id 
            ? `https://veraflor.onrender.com/endereco/altera/${endereco.id}` 
            : 'https://veraflor.onrender.com/endereco/cadastro';
    
        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...endereco,
                    cliente_id: clienteId
                })
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Erro do servidor:', errorData);
                throw new Error(errorData.msg || 'Erro ao salvar endereço');
            }
    
            const data = await response.json();
            console.log('Endereço salvo:', data);
            Swal.fire({
                icon: 'success',
                title: 'Sucesso',
                text: 'Endereço salvo com sucesso!',
            });
    
            // Recarregar endereços após a operação
            buscarEnderecos();
        } catch (error) {
            console.error('Erro ao salvar endereço:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Erro ao salvar endereço. Tente novamente.',
            });
        }
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'meus-dados':
                return (
                    <ClienteForm 
                        cliente={cliente} 
                        setCliente={setCliente}
                        onSubmit={handleSubmitCliente}
                        handleInputChange={handleInputChange}
                    />
                );
            case 'enderecos':
                return (
                    <div className={styles.content}>
                        <h1>Endereços</h1>
                        {enderecos.map((endereco, index) => (
                            <EnderecoForm 
                                key={endereco.id || index}
                                endereco={endereco}
                                onChange={(e) => handleEnderecoChange(index, e)}
                                onSubmit={(e) => { e.preventDefault(); handleSubmitEndereco(index); }}
                            />
                        ))}
                    </div>
                );
            case 'pedidos':
                return <div>Pedidos</div>;
            default:
                return null;
        }
    };

    return (
        <div className={styles.wrapper}>
            <aside className={styles.sidebar}>
                <ul>
                    <li onClick={() => setActiveSection('meus-dados')} className={activeSection === 'meus-dados' ? styles.active : ''}>
                        <RxAvatar /> Meus dados
                    </li>
                    <li onClick={() => setActiveSection('pedidos')} className={activeSection === 'pedidos' ? styles.active : ''}>
                        <TbTruckDelivery /> Pedidos
                    </li>
                    <li onClick={() => setActiveSection('enderecos')} className={activeSection === 'enderecos' ? styles.active : ''}>
                        <IoHomeOutline /> Endereços
                    </li>
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
