'use client'
import styles from './loginCliente.module.css';
import Login from './login';

export default function LoginPage() {
    return (
        <main>
            <div className={styles.page}>
                <Login />
            </div>
        </main>
    );
}
