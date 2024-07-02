'use client'
import React from 'react';
import { Slider, Checkbox, FormControl, FormControlLabel, FormGroup, Typography, Button } from '@mui/material';
import styles from './FilterMenu.module.css';

const FilterMenu = ({ filters, handleFilterChange, clearFilters }) => {
    return (
        <div className={styles.filterMenu}>
            <div className={styles.filterRow}>
                <FormControl component="fieldset" className={styles.filterColumn}>
                    <Typography variant="subtitle1" className={styles.filterTitle}>Ambiente</Typography>
                    <FormGroup>
                        {['Interno', 'Externo'].map(option => (
                            <FormControlLabel
                                key={option}
                                control={
                                    <Checkbox
                                        checked={filters.ambiente.includes(option)}
                                        onChange={handleFilterChange}
                                        name="ambiente"
                                        value={option}
                                    />
                                }
                                label={option}
                            />
                        ))}
                    </FormGroup>
                </FormControl>

                <FormControl component="fieldset" className={styles.filterColumn}>
                    <Typography variant="subtitle1" className={styles.filterTitle}>Tamanho</Typography>
                    <FormGroup>
                        {['Pequeno', 'Médio', 'Grande'].map(option => (
                            <FormControlLabel
                                key={option}
                                control={
                                    <Checkbox
                                        checked={filters.tamanho.includes(option)}
                                        onChange={handleFilterChange}
                                        name="tamanho"
                                        value={option}
                                    />
                                }
                                label={option}
                            />
                        ))}
                    </FormGroup>
                </FormControl>

                <FormControl component="fieldset" className={styles.filterColumn}>
                    <Typography variant="subtitle1" className={styles.filterTitle}>Tipo</Typography>
                    <FormGroup>
                        {['Flores', 'Folhagens', 'Suculentas'].map(option => (
                            <FormControlLabel
                                key={option}
                                control={
                                    <Checkbox
                                        checked={filters.tipo.includes(option)}
                                        onChange={handleFilterChange}
                                        name="tipo"
                                        value={option}
                                    />
                                }
                                label={option}
                            />
                        ))}
                    </FormGroup>
                </FormControl>

                <FormControl component="fieldset" className={styles.filterColumn}>
                    <Typography variant="subtitle1" className={styles.filterTitle}>Categoria</Typography>
                    <FormGroup>
                        {['Ornamentais', 'Frutíferas', 'Medicinais'].map(option => (
                            <FormControlLabel
                                key={option}
                                control={
                                    <Checkbox
                                        checked={filters.categoria.includes(option)}
                                        onChange={handleFilterChange}
                                        name="categoria"
                                        value={option}
                                    />
                                }
                                label={option}
                            />
                        ))}
                    </FormGroup>
                </FormControl>
            </div>
            <div className={styles.sliderContainer}>
                <Typography variant="subtitle1" className={styles.filterTitle}>Preço Máximo</Typography>
                <Slider
                    value={filters.maxPreco}
                    onChange={(e, value) => handleFilterChange({ target: { name: 'maxPreco', value } })}
                    name="maxPreco"
                    min={0}
                    max={1000}
                    step={10}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                    color='success'
                />
            </div>
            <Button variant="contained" color="success" onClick={clearFilters} className={styles.clearButton}>
                Limpar Filtros
            </Button>
        </div>
    );
};

export default FilterMenu;