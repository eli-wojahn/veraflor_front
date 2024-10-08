'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { withAuth } from '@/util/auth';
import Swal from 'sweetalert2';
import styles from './editDica.module.css';

const EditDicaPage = () => {
    const router = useRouter();
    const { id } = useParams(); 
    const [dica, setDica] = useState({
        descricao: '',
        nr_regas: '',
        exposicao_sol: '',
        adubagem: '',
        produto_id: id 
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isNewDica, setIsNewDica] = useState(false); 

    useEffect(() => {
        if (id) {
            const fetchDica = async () => {
                try {
                    const response = await fetch(`https://veraflor.onrender.com/dicas/produto/${id}`);
                    if (!response.ok) {
                        throw new Error('Erro ao obter dica');
                    }
                    const data = await response.json();
                    if (data.length > 0) {
                        setDica(data[0]);
                        setIsNewDica(false); 
                    } else {
                        setDica({
                            descricao: '',
                            nr_regas: '',
                            exposicao_sol: '',
                            adubagem: '',
                            produto_id: id 
                        });
                        setIsNewDica(true);
                    }
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchDica();
        }
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDica(prevDica => ({ ...prevDica, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (isNewDica) {
                // Criar nova dica
                response = await fetch(`https://veraflor.onrender.com/dicas`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dica)
                });
            } else {
                // Atualizar dica existente
                response = await fetch(`https://veraflor.onrender.com/dicas/altera/${dica.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dica)
                });
            }
    
            if (response.ok) {
                Swal.fire({
                    title: 'Sucesso!',
                    text: isNewDica ? 'Dica criada com sucesso!' : 'Dica atualizada com sucesso!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    router.push('/listagem');
                });
            } else {
                throw new Error(isNewDica ? 'Erro ao criar dica' : 'Erro ao atualizar dica');
            }
        } catch (error) {
            setError(error.message);
            Swal.fire({
                title: 'Erro!',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={styles.container}>
            <div className={styles.formArea}>
                <h2 className={styles.title}>{isNewDica ? 'Criar Dica' : 'Editar Dica'}</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formRow}>
                        <div className={styles.formColumn}>
                            <div className={styles.formGroup}>
                                <label htmlFor="descricao">Descrição</label>
                                <textarea
                                    id="descricao"
                                    name="descricao"
                                    className={styles.textarea}
                                    value={dica.descricao}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="nr_regas">Número de Rega</label>
                                <input
                                    type="text"
                                    id="nr_regas"
                                    name="nr_regas"
                                    className={styles.input}
                                    value={dica.nr_regas}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className={styles.formColumn}>
                            <div className={styles.formGroup}>
                                <label htmlFor="exposicao_sol">Exposição ao Sol</label>
                                <input
                                    type="text"
                                    id="exposicao_sol"
                                    name="exposicao_sol"
                                    className={styles.input}
                                    value={dica.exposicao_sol}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="adubagem">Adubagem</label>
                                <input
                                    type="text"
                                    id="adubagem"
                                    name="adubagem"
                                    className={styles.input}
                                    value={dica.adubagem}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.submitButton}>Salvar</button>
                        <button type="button" className={styles.clearButton} onClick={() => router.push('/listagem')}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default withAuth(EditDicaPage);
