'use client'
import { signIn } from 'next-auth/react';
import styles from './loginGoogle.module.css';

export default function GoogleLogin() {
    const googleLogin = () => {
        signIn('google'); // Inicia o login com Google
    };

    return (
        <button
            className={styles.googleLoginBtn} // Usando a classe de estilo do CSS
            type="button"
            onClick={googleLogin} 
        >
            <i className="bi bi-google"></i>{"  "}Login com Google
        </button>
    );
}
