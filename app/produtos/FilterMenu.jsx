'use client'
import React from 'react';
import styles from './FilterMenu.module.css';
import { IoClose } from 'react-icons/io5';

const FilterMenu = ({ filters, handleFilterChange, toggleFilters }) => {
    const isChecked = (name, value) => filters[name].includes(value);

    return (
        <div className={styles.filterMenu}>
            <div className={styles.filterHeader}>
                <h3>Filtros</h3>
                <button className={styles.closeButton} onClick={toggleFilters}><IoClose /></button>
            </div>
            <div className={styles.filterGroup}>
                <div className={styles.filterSection}>
                    <h4>Ambiente</h4>
                    <label><input type="checkbox" name="ambiente" value="Interno" onChange={handleFilterChange} checked={isChecked('ambiente', 'Interno')} /> Interno</label>
                    <label><input type="checkbox" name="ambiente" value="Externo" onChange={handleFilterChange} checked={isChecked('ambiente', 'Externo')} /> Externo</label>
                </div>
                <div className={styles.verticalLine}></div>
                <div className={styles.filterSection}>
                    <h4>Tamanho</h4>
                    <label><input type="checkbox" name="tamanho" value="Pequeno" onChange={handleFilterChange} checked={isChecked('tamanho', 'Pequeno')} /> Pequeno</label>
                    <label><input type="checkbox" name="tamanho" value="Médio" onChange={handleFilterChange} checked={isChecked('tamanho', 'Médio')} /> Médio</label>
                    <label><input type="checkbox" name="tamanho" value="Grande" onChange={handleFilterChange} checked={isChecked('tamanho', 'Grande')} /> Grande</label>
                </div>
                <div className={styles.verticalLine}></div>
                <div className={styles.filterSection}>
                    <h4>Tipo</h4>
                    <label><input type="checkbox" name="tipo" value="Flores" onChange={handleFilterChange} checked={isChecked('tipo', 'Flores')} /> Flores</label>
                    <label><input type="checkbox" name="tipo" value="Vasos" onChange={handleFilterChange} checked={isChecked('tipo', 'Vasos')} /> Vasos</label>
                    <label><input type="checkbox" name="tipo" value="Acessórios" onChange={handleFilterChange} checked={isChecked('tipo', 'Acessórios')} /> Acessórios</label>
                    <label><input type="checkbox" name="tipo" value="Jardinagem" onChange={handleFilterChange} checked={isChecked('tipo', 'Jardinagem')} /> Jardinagem</label>
                </div>
                <div className={styles.verticalLine}></div>
                <div className={styles.filterSection}>
                    <h4>Categoria</h4>
                    <label><input type="checkbox" name="categoria" value="Ornamental" onChange={handleFilterChange} checked={isChecked('categoria', 'Ornamental')} /> Ornamental</label>
                    <label><input type="checkbox" name="categoria" value="Trepadeira" onChange={handleFilterChange} checked={isChecked('categoria', 'Trepadeira')} /> Trepadeira</label>
                    <label><input type="checkbox" name="categoria" value="Muda" onChange={handleFilterChange} checked={isChecked('categoria', 'Muda')} /> Muda</label>
                    <label><input type="checkbox" name="categoria" value="Haste" onChange={handleFilterChange} checked={isChecked('categoria', 'Haste')} /> Haste</label>
                    <label><input type="checkbox" name="categoria" value="Frutífera" onChange={handleFilterChange} checked={isChecked('categoria', 'Frutífera')} /> Frutífera</label>
                </div>
            </div>
            <div className={styles.filterSection}>
                <h4>Preço Máximo</h4>
                <input type="range" name="maxPreco" min="0" max="1000" step="10" value={filters.maxPreco} onChange={handleFilterChange} />
                <span>R$ {filters.maxPreco}</span>
            </div>
        </div>
    );
};

export default FilterMenu;
