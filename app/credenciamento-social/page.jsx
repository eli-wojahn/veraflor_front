'use client';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import styles from './credenciamento-social.module.css';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';  // Usando NextAuth para o login social

const CredenciamentoSocial = () => {
    // Estado inicial do cliente
    const initialClientState = {
        nome: '',
        email: '',
        cpf: '',
        dataNasc: '',
        senha: '',
        ddd: '',
        celular: ''
    };

    const [cliente, setCliente] = useState(initialClientState);
    const [senhaRepetida, setSenhaRepetida] = useState('');
    const { data: session } = useSession();  // Dados do usuário logado pelo Google (do login social)
    const router = useRouter();

    // Preenche automaticamente os dados do cliente quando o login social é realizado
    useEffect(() => {
        if (session) {
            setCliente({
                ...cliente,
                nome: session.user.name || '',
                email: session.user.email || ''
            });
        }
    }, [session]);

    const formatarCPF = (cpf) => {
        cpf = cpf.replace(/\D/g, '');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        return cpf;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'cpf') {
            const formattedCPF = formatarCPF(value);
            setCliente(prevState => ({
                ...prevState,
                [name]: formattedCPF
            }));
        } else {
            setCliente(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSenhaRepetidaChange = (e) => {
        setSenhaRepetida(e.target.value);
    };

    const handleClear = () => {
        setCliente(initialClientState);
        setSenhaRepetida('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!cliente.nome || !cliente.email || !cliente.cpf || !cliente.dataNasc || !cliente.ddd || !cliente.celular || !cliente.senha || !senhaRepetida) {
            Swal.fire({
                title: 'Erro!',
                text: 'Por favor, preencha todos os campos.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        if (cliente.senha !== senhaRepetida) {
            Swal.fire({
                title: 'Erro!',
                text: 'As senhas não coincidem.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        const requestBody = {
            nome: cliente.nome,
            email: cliente.email,
            cpf: cliente.cpf,
            dataNasc: cliente.dataNasc,
            area: cliente.ddd,
            celular: cliente.celular,
            senha: cliente.senha
        };

        try {
            const response = await fetch('https://veraflor.onrender.com/clientes/cadastro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Cadastro efetuado com sucesso!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                handleClear();
            } else {
                const errorData = await response.json();
                Swal.fire({
                    title: 'Erro!',
                    text: errorData.msg || 'Erro ao efetuar o cadastro.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                console.error('Erro ao cadastrar cliente. Status:', response.status);
            }
        } catch (error) {
            Swal.fire({
                title: 'Erro!',
                text: 'Erro ao fazer requisição.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            console.error('Erro ao fazer requisição:', error);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Cadastro</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <label className={styles.label}>
                    Nome completo
                    <input
                        type="text"
                        name="nome"
                        value={cliente.nome}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </label>
                <label className={styles.label}>
                    E-mail
                    <input
                        type="email"
                        name="email"
                        value={cliente.email}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </label>

                <div className={styles.buttonGroup}>
                    <button type="submit" className={styles.button}>Enviar</button>
                    <button type="button" className={styles.buttonRosa} onClick={handleClear}>Limpar</button>
                </div>
            </form>
        </div>
    );
};

export default CredenciamentoSocial;