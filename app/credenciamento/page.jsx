'use client';
import React, { useState } from 'react';
import { withAuth } from '@/util/auth';
import styles from './credenciamento.module.css';
import Swal from 'sweetalert2';

const Credenciamento = () => {
    const initialClientState = {
        nome: '',
        email: '',
        cpf: '',
        dataNasc: '',
        senha: ''
    };

    const [cliente, setCliente] = useState(initialClientState);
    const [senhaRepetida, setSenhaRepetida] = useState(''); // Novo estado para a repetição da senha

    const formatarCPF = (cpf) => {
        // Remove tudo o que não for dígito
        cpf = cpf.replace(/\D/g, '');

        // Formata o CPF - XXX.XXX.XXX-XX
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

        // Validação dos campos
        if (!cliente.nome || !cliente.email || !cliente.cpf || !cliente.dataNasc || !cliente.senha || !senhaRepetida) {
            Swal.fire({
                title: 'Erro!',
                text: 'Por favor, preencha todos os campos.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Verificação da senha
        if (cliente.senha !== senhaRepetida) {
            Swal.fire({
                title: 'Erro!',
                text: 'As senhas não coincidem.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        const formData = new FormData();
        formData.append('nome', cliente.nome);
        formData.append('email', cliente.email);
        formData.append('cpf', cliente.cpf);
        formData.append('dataNasc', cliente.dataNasc);
        formData.append('senha', cliente.senha);    

        try {
            const response = await fetch('https://veraflor.onrender.com/clientes/cadastro', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Cadastro efetuado com sucesso!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                // Limpar os campos do formulário
                handleClear();
            } else {
                Swal.fire({
                    title: 'Erro!',
                    text: 'Erro ao efetuar o cadastro.',
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
            <div className={styles.formArea}>
                <h2 className={styles.title}>Cadastro</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formRow}>
                        <div className={styles.formColumn}>
                            <div className={styles.formGroup}>
                                <label htmlFor="nome">Nome completo</label>
                                <input type="text" id="nome" name="nome" className={styles.input} value={cliente.nome} onChange={handleChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">E-mail</label>
                                <input type="text" id="email" name="email" className={styles.input} value={cliente.email} onChange={handleChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="cpf">CPF</label>
                                <input type="text" id="cpf" name="cpf" className={styles.input} value={cliente.cpf} onChange={handleChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="dataNasc">Data de Nascimento</label>
                                <input type="date" id="dataNasc" name="dataNasc" className={styles.input} value={cliente.dataNasc} onChange={handleChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="senha">Senha</label>
                                <input type="password" id="senha" name="senha" className={styles.input} value={cliente.senha} onChange={handleChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="senhaRepetida">Repita a senha</label>
                                <input type="password" id="senhaRepetida" name="senhaRepetida" className={styles.input} value={senhaRepetida} onChange={handleSenhaRepetidaChange} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.submitButton}>Enviar</button>
                        <button type="button" className={styles.clearButton} onClick={handleClear}>Limpar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default withAuth(Credenciamento);