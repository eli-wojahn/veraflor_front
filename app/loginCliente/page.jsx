'use client'
import styles from './loginCliente.module.css';
import { useState } from 'react';
import Login from './login';
import GoogleLogin from './loginGoogle';

export default function LoginPage() {
    return (
        <main>
            <div className={styles.page}>
                <Login />
            </div>
        </main>
    );
}
