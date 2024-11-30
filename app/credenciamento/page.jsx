'use client';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { VscEye, VscEyeClosed } from 'react-icons/vsc'; // Importando os ícones
import styles from './credenciamento.module.css';

const Credenciamento = () => {
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
    const [senhaVisivel, setSenhaVisivel] = useState(false);  // Novo estado para controlar a visibilidade da senha
    const [senhaRepetidaVisivel, setSenhaRepetidaVisivel] = useState(false); // Controle da visibilidade da senha repetida

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
                <label className={styles.label}>
                    CPF
                    <input
                        type="text"
                        name="cpf"
                        value={cliente.cpf}
                        onChange={handleChange}
                        className={styles.input}
                        maxLength="14"
                    />
                </label>

                <div className={styles.phoneGroup}>
                    <label className={`${styles.label} ${styles.dddLabel}`}>
                        DDD
                        <input
                            type="text"
                            name="ddd"
                            value={cliente.ddd}
                            onChange={handleChange}
                            className={`${styles.input} ${styles.dddInput}`}
                            maxLength="2"
                            inputMode="numeric"
                            pattern="[0-9]*"
                        />
                    </label>
                    <label className={`${styles.label} ${styles.celularLabel}`}>
                        Telefone celular
                        <input
                            type="text"
                            name="celular"
                            value={cliente.celular}
                            onChange={handleChange}
                            className={`${styles.input} ${styles.celularInput}`}
                            maxLength="9"
                            inputMode="numeric"
                            pattern="[0-9]*"
                        />
                    </label>
                </div>

                <label className={styles.label}>
                    Data de nascimento
                    <input
                        type="date"
                        name="dataNasc"
                        value={cliente.dataNasc}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </label>

                {/* Campo de senha com ícone dentro */}
                <label className={styles.label}>
                    Senha
                    <div className={styles.inputContainer}>
                        <input
                            type={senhaVisivel ? "text" : "password"}
                            name="senha"
                            value={cliente.senha}
                            onChange={handleChange}
                            className={styles.input}
                        />
                        <div 
                            className={styles.icon} 
                            onClick={() => setSenhaVisivel(!senhaVisivel)}
                        >
                            {senhaVisivel ? <VscEye /> : <VscEyeClosed />}
                        </div>
                    </div>
                </label>

                {/* Campo de repetição de senha com ícone dentro */}
                <label className={styles.label}>
                    Repita a senha
                    <div className={styles.inputContainer}>
                        <input
                            type={senhaRepetidaVisivel ? "text" : "password"}
                            name="senhaRepetida"
                            value={senhaRepetida}
                            onChange={handleSenhaRepetidaChange}
                            className={styles.input}
                        />
                        <div 
                            className={styles.icon} 
                            onClick={() => setSenhaRepetidaVisivel(!senhaRepetidaVisivel)}
                        >
                            {senhaRepetidaVisivel ? <VscEye /> : <VscEyeClosed />}
                        </div>
                    </div>
                </label>

                <div className={styles.buttonGroup}>
                    <button type="submit" className={styles.button}>Enviar</button>
                    <button type="button" className={styles.buttonRosa} onClick={handleClear}>Limpar</button>
                </div>
            </form>
        </div>
    );
};

export default Credenciamento;

