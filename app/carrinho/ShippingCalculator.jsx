// components/ShippingCalculator.js
import React, { useState } from 'react';
import styles from './ShippingCalculator.module.css';

const ShippingCalculator = ({ calculateShipping }) => {
    const [cep, setCep] = useState("");

    const handleCalculate = () => {
        calculateShipping(cep);
    };

    return (
        <div className={styles.calculator}>
            <h3>Consultar frete e prazo de entrega</h3>
            <div className={styles.inputGroup}>
                <input 
                    type="text" 
                    placeholder="CEP" 
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    className={styles.cepInput}
                />
                <button onClick={handleCalculate} className={styles.consultButton}>Consultar</button>
            </div>
            <a 
                href="https://buscacepinter.correios.com.br/app/localidade_logradouro/index.php" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.cepLink}
            >
                Não sei meu CEP
            </a>
        </div>
    );
};

export default ShippingCalculator;
