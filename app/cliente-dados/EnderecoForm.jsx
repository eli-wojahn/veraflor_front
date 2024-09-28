import React from 'react';
import styles from './EnderecoForm.module.css';

const estadosBrasileiros = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
    'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
    'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const EnderecoForm = ({ endereco, onChange, onSubmit }) => {
    return (
        <div className={styles.form}>
            <div className={styles.addressGroup}>
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
                <label className={`${styles.label} ${styles.numeroLabel}`}>
                    Número
                    <input
                        type="text"
                        name="numero"
                        value={endereco.numero}
                        onChange={onChange}
                        className={`${styles.input} ${styles.numeroInput}`}
                        maxLength="5"
                        inputMode="numeric"
                        pattern="[0-9]*"
                    />
                </label>
            </div>
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
            <div className={styles.cityStateGroup}>
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
                <label className={`${styles.label} ${styles.estadoLabel}`}>
                    Estado
                    <select
                        name="estado"
                        value={endereco.estado}
                        onChange={onChange}
                        className={`${styles.input} ${styles.estadoInput}`}
                    >
                        <option value="">Selecione</option>
                        {estadosBrasileiros.map((estado) => (
                            <option key={estado} value={estado}>
                                {estado}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
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
