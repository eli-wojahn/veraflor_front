'use client';
import React, { useState } from 'react';
import { withAuth } from '@/util/auth';
import styles from './cadastroAdmin.module.css';
import Swal from 'sweetalert2';

const CadastraAdminPage = () => {
    const initialAdminState = {
        nome: '',
        email: '',
        senha: ''
    };

    const [administrador, setAdministrador] = useState(initialAdminState);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdministrador(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleClear = () => {
        setAdministrador(initialAdminState);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validação dos campos
        if (!administrador.nome || !administrador.email || !administrador.senha) {
            Swal.fire({
                title: 'Erro!',
                text: 'Por favor, preencha todos os campos.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        const formData = new FormData();
        formData.append('nome', administrador.nome);
        formData.append('email', administrador.email);
        formData.append('senha', administrador.senha);

        try {
            const response = await fetch('http://localhost:3004/administradores/cadastro', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Administrador cadastrado com sucesso!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                handleClear();
            } else {
                Swal.fire({
                    title: 'Erro!',
                    text: 'Erro ao cadastrar Administrador.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                console.error('Erro ao cadastrar administrador. Status:', response.status);
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
                <h2 className={styles.title}>Cadastro de Administrador</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formRow}>
                        <div className={styles.formColumn}>
                            <div className={styles.formGroup}>
                                <label htmlFor="nome">Informe o nome completo</label>
                                <input type="text" id="nome" name="nome" className={styles.input} value={administrador.nome} onChange={handleChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">E-mail</label>
                                <input type="text" id="email" name="email" className={styles.input} value={administrador.email} onChange={handleChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="senha">Digite a senha</label>
                                <input type="password" id="senha" name="senha" className={styles.input} value={administrador.senha} onChange={handleChange} />
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

export default withAuth(CadastraAdminPage)