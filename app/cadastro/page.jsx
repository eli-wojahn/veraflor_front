'use client';
import React, { useState } from 'react';
import Cookies from 'js-cookie'; 
import { withAuth } from '@/util/auth';  
import styles from './cadastro.module.css';
import Swal from 'sweetalert2';

const Cadastro = () => {
    const initialProductState = {
        codigo: '',
        descricao: '',
        preco: '',
        categoria: 'Selecione',
        ambiente: 'Selecione',
        destaque: '1',
        tipo: 'Selecione',
        tamanho: 'Selecione',
        loja: 'Selecione',
        imagem: null,
        imagemPreview: null
    };

    const [produto, setProduto] = useState(initialProductState);

    function getAdminId() {
        const adminLogado = Cookies.get('admin_logado');  
        if (adminLogado) {
            const parsedAdmin = JSON.parse(adminLogado);  
            return parsedAdmin.id;  
        }
        return null;  
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduto(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setProduto(prevState => ({
                ...prevState,
                imagem: file,
                imagemPreview: reader.result
            }));
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handlePrecoChange = (e) => {
        const { value } = e.target;
        const precoFormatado = value.replace(',', '.');
        setProduto(prevState => ({
            ...prevState,
            preco: precoFormatado
        }));
    };

    const handleClear = () => {
        setProduto(initialProductState);
        document.getElementById('imagem').value = null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validação dos campos
        if (!produto.codigo || !produto.descricao || !produto.preco ||
            produto.categoria === 'Selecione' || produto.ambiente === 'Selecione' ||
            produto.tipo === 'Selecione' || produto.tamanho === 'Selecione' ||
            produto.loja === 'Selecione' || !produto.imagem) {
            Swal.fire({
                title: 'Erro!',
                text: 'Por favor, preencha todos os campos e selecione uma imagem.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

       
        const adminId = getAdminId(); 

        if (!adminId) {
            Swal.fire({
                title: 'Erro!',
                text: 'Administrador não encontrado ou não logado.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        const formData = new FormData();
        formData.append('codigo', produto.codigo);
        formData.append('descricao', produto.descricao);
        formData.append('preco', produto.preco);
        formData.append('categoria', produto.categoria);
        formData.append('ambiente', produto.ambiente);
        formData.append('destaque', produto.destaque);
        formData.append('tipo', produto.tipo);
        formData.append('tamanho', produto.tamanho);
        formData.append('loja', produto.loja);
        formData.append('imagem', produto.imagem);
        formData.append('adminId', adminId);  

        try {
            const response = await fetch('https://veraflor.onrender.com/produtos', {
                method: 'POST',
                body: formData 
            });


            if (response.ok) {
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Produto cadastrado com sucesso!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                handleClear();
            } else {

                Swal.fire({
                    title: 'Erro!',
                    text: `Erro ao cadastrar produto. Status: ${response.status}`,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                console.error('Erro ao cadastrar produto. Status:', response.status);
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
                <h2 className={styles.title}>Cadastro</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formRow}>
                        <div className={styles.formColumn}>
                            <div className={styles.formGroup}>
                                <label htmlFor="codigo">Código</label>
                                <input type="text" id="codigo" name="codigo" className={styles.input} value={produto.codigo} onChange={handleChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="descricao">Descrição</label>
                                <input type="text" id="descricao" name="descricao" className={styles.input} value={produto.descricao} onChange={handleChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="preco">Preço R$</label>
                                <input type="text" id="preco" name="preco" className={styles.input} value={produto.preco} onChange={handlePrecoChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="categoria">Categoria</label>
                                <select id="categoria" name="categoria" className={styles.select} value={produto.categoria} onChange={handleChange}>
                                    <option value="Selecione">Selecione</option>
                                    <option value="Ornamental">Ornamental</option>
                                    <option value="Trepadeira">Trepadeira</option>
                                    <option value="Muda">Muda</option>
                                    <option value="Haste">Haste</option>
                                    <option value="Frutífera">Frutífera</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="ambiente">Ambiente</label>
                                <select id="ambiente" name="ambiente" className={styles.select} value={produto.ambiente} onChange={handleChange}>
                                    <option value="Selecione">Selecione</option>
                                    <option value="Interno">Interno</option>
                                    <option value="Externo">Externo</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.formColumn}>
                            <div className={styles.formGroup}>
                                <label htmlFor="tipo">Tipo</label>
                                <select id="tipo" name="tipo" className={styles.select} value={produto.tipo} onChange={handleChange}>
                                    <option value="Selecione">Selecione</option>
                                    <option value="Flores">Flores</option>
                                    <option value="Vasos">Vasos</option>
                                    <option value="Acessórios">Acessórios</option>
                                    <option value="Jardinagem">Jardinagem</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="tamanho">Tamanho</label>
                                <select id="tamanho" name="tamanho" className={styles.select} value={produto.tamanho} onChange={handleChange}>
                                    <option value="Selecione">Selecione</option>
                                    <option value="Pequeno">Pequeno</option>
                                    <option value="Médio">Médio</option>
                                    <option value="Grande">Grande</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="loja">Loja</label>
                                <select id="loja" name="loja" className={styles.select} value={produto.loja} onChange={handleChange}>
                                    <option value="Selecione">Selecione</option>
                                    <option value="Pelotas">Pelotas</option>
                                    <option value="Camaquã">Camaquã</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Colocar em destaque</label>
                                <div className={styles.radioGroup}>
                                    <input type="radio" id="destaqueSim" name="destaque" value="1" checked={produto.destaque === '1'} onChange={handleChange} />
                                    <label htmlFor="destaqueSim">Sim&nbsp;&nbsp;&nbsp;</label>
                                    <input type="radio" id="destaqueNao" name="destaque" value="0" checked={produto.destaque === '0'} onChange={handleChange} />
                                    <label htmlFor="destaqueNao">Não</label>
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="imagem">Imagem</label>
                                <input type="file" id="imagem" name="imagem" accept="image/*" onChange={handleFileChange} />
                            </div>
                            {produto.imagemPreview && (
                                <img
                                    src={produto.imagemPreview}
                                    alt="Prévia da Imagem"
                                    className={styles.imagemPreview}
                                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                                />
                            )}
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

export default withAuth(Cadastro); 
