// EnderecoForm.js
import React from 'react';
import styles from './ClienteArea.module.css';

const EnderecoForm = ({ endereco, onChange, onSubmit }) => {
    return (
        <div className={styles.form}>
            <label className={styles.label}>
                Endereço
                <input
                    type="text"
                    name="endereco"
                    value={endereco.endereco}
                    onChange={onChange}
                    className={styles.input}
                />
            </label>
            <label className={styles.label}>
                Número
                <input
                    type="text"
                    name="numero"
                    value={endereco.numero}
                    onChange={onChange}
                    className={styles.input}
                />
            </label>
            <label className={styles.label}>
                Complemento
                <input
                    type="text"
                    name="complemento"
                    value={endereco.complemento}
                    onChange={onChange}
                    className={styles.input}
                />
            </label>
            <label className={styles.label}>
                Bairro
                <input
                    type="text"
                    name="bairro"
                    value={endereco.bairro}
                    onChange={onChange}
                    className={styles.input}
                />
            </label>
            <label className={styles.label}>
                Cidade
                <input
                    type="text"
                    name="cidade"
                    value={endereco.cidade}
                    onChange={onChange}
                    className={styles.input}
                />
            </label>
            <label className={styles.label}>
                Estado
                <input
                    type="text"
                    name="estado"
                    value={endereco.estado}
                    onChange={onChange}
                    className={styles.input}
                />
            </label>
            <label className={styles.label}>
                CEP
                <input
                    type="text"
                    name="cep"
                    value={endereco.cep}
                    onChange={onChange}
                    className={styles.input}
                />
            </label>
            <button type="button" className={styles.button} onClick={onSubmit}>
                Salvar Alterações
            </button>
        </div>
    );
};

export default EnderecoForm;
