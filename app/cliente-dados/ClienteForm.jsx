// ClienteForm.js
import React from 'react';
import styles from './ClienteArea.module.css';

const ClienteForm = ({ cliente, setCliente, onSubmit }) => {
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCliente(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className={styles.content}>
            <h1>Meus Dados</h1>
            <form onSubmit={onSubmit} className={styles.form}>
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

export default ClienteForm;
