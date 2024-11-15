'use client';
import React, { Suspense, useContext, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './HeaderSmall.module.css';
import Image from 'next/image';
import { AdministradorContext } from '@/contexts/administrator';
import { ClienteContext } from '@/contexts/client';
import { CiSearch } from 'react-icons/ci';
import { IoCartOutline, IoExitOutline } from 'react-icons/io5';
import { FaBars, FaRegUser } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Cookies from 'js-cookie';

const MySwal = withReactContent(Swal);

const HeaderSmall = () => {
    const pathname = usePathname();
    const { adminId, adminNome, mudaId, mudaNome } = useContext(AdministradorContext);
    const { clienteId, clienteNome, cartItemCount, logout: clienteLogout, atualizarCartItemCount } = useContext(ClienteContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [gerenciamentoDropdownOpen, setGerenciamentoDropdownOpen] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();
    const dropdownRef = useRef(null);
    const gerenciamentoDropdownRef = useRef(null);
    const tooltipRef = useRef(null);

    const buscarCarrinhoAtivo = async (clienteId) => {
        try {
            const response = await fetch(`https://veraflor.onrender.com/carrinho/listaAtivos/${clienteId}`);
            const carrinho = await response.json();
            return carrinho.length > 0 ? carrinho[0] : null;
        } catch (error) {
            console.error('Erro ao buscar carrinho ativo:', error);
            return null;
        }
    };

    const buscarItensCarrinho = async (carrinhoId) => {
        try {
            const response = await fetch(`https://veraflor.onrender.com/itens/${carrinhoId}`);
            if (!response.ok) throw new Error('Erro ao buscar itens do carrinho');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao buscar itens do carrinho:', error);
            return [];
        }
    };

    const fetchCartItemCount = async (clienteId) => {
        try {
            const carrinhoAtivo = await buscarCarrinhoAtivo(clienteId);
            if (carrinhoAtivo) {
                const itens = await buscarItensCarrinho(carrinhoAtivo.id);
                atualizarCartItemCount(itens.length);
            } else {
                atualizarCartItemCount(0);
            }
        } catch (error) {
            console.error('Erro ao buscar itens do carrinho:', error);
        }
    };

    useEffect(() => {
        if (clienteId) {
            fetchCartItemCount(clienteId);
        } else {
            atualizarCartItemCount(0);
        }
    }, [clienteId, pathname]);

    function logoutAdmin() {
        MySwal.fire({
            title: 'Confirma saída do sistema?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, sair',
            cancelButtonText: 'Cancelar',
            customClass: {
                confirmButton: styles.confirmButton,
            },
        }).then((result) => {
            if (result.isConfirmed) {
                mudaId(null);
                mudaNome('');
                Cookies.remove('admin_logado');
                router.push('/');
            }
        });
    }

    const handleSearch = (event) => {
        if (event.key === 'Enter') {
            router.push(`/busca?keyword=${searchTerm}`);
        }
    };

    const toggleTooltip = () => {
        setTooltipOpen(!tooltipOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                tooltipRef.current &&
                !tooltipRef.current.contains(event.target) &&
                !event.target.closest(`.${styles.userIconWrapper}`)
            ) {
                setTooltipOpen(false);
            }
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setDropdownOpen(false);
            }
            if (
                gerenciamentoDropdownRef.current &&
                !gerenciamentoDropdownRef.current.contains(event.target)
            ) {
                setGerenciamentoDropdownOpen(false);
            }
            if (!event.target.closest(`.${styles.menu}`) && !event.target.closest(`.${styles.menuIcon}`)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <header>
                <nav className={styles.navbar}>
                    <div className={styles.topBar}>
                        <div className={styles.menuIcon} onClick={() => setMenuOpen(!menuOpen)}>
                            <FaBars />
                        </div>
                        <div className={styles.logo}>
                            <Link href="/" passHref>
                                <Image
                                    src="/images/logoCOR6.png"
                                    alt="Logo"
                                    width={100}
                                    height={46}
                                />
                            </Link>
                        </div>
                        <div className={styles.icons}>
                            {clienteId ? (
                                <div className={styles.userIconWrapper} ref={tooltipRef} onClick={toggleTooltip}>
                                    <FaRegUser className={styles.icon} />
                                    {tooltipOpen && (
                                        <div className={styles.tooltip}>
                                            <p className={styles.userText}>Olá, {clienteNome}</p>
                                            <br />
                                            <Link href="/cliente-dados" passHref>
                                                <div>Meus dados</div>
                                            </Link>
                                            <div className={styles.logoutLink} onClick={clienteLogout}>Sair</div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <FaRegUser className={styles.icon} onClick={() => router.push('/loginCliente')} />
                            )}
                            <div className={styles.cartIconWrapper}>
                                <IoCartOutline className={styles.icon} onClick={() => router.push('/carrinho')} />
                                {cartItemCount > 0 && (
                                    <span className={styles.cartItemCount}>{cartItemCount}</span>
                                )}
                            </div>
                            {adminNome && (
                                <IoExitOutline onClick={logoutAdmin} className={styles.logoutIcon} />
                            )}
                        </div>
                    </div>
                    <div className={styles.searchBarExpanded}>
                        <input
                            type="text"
                            placeholder="Buscar"
                            className={styles.searchInputExpanded}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                        <CiSearch className={styles.searchIcon} />
                    </div>
                </nav>
                <div className={`${styles.menu} ${menuOpen ? styles.active : ''}`}>
                    <ul>
                        <li className={pathname === '/produtos' ? styles.active : ''}>
                            <Link href="/produtos" passHref>
                                <div>Produtos</div>
                            </Link>
                        </li>
                        <li className={styles.dropdown} ref={dropdownRef}>
                            <div onClick={() => setDropdownOpen(!dropdownOpen)}>
                                Lojas
                            </div>
                            {dropdownOpen && (
                                <ul className={styles.dropdownMenu}>
                                    <li className={pathname === '/pelotas' ? styles.active : ''}>
                                        <Link href="/pelotas" passHref>
                                            <div>Pelotas</div>
                                        </Link>
                                    </li>
                                    <li className={pathname === '/camaqua' ? styles.active : ''}>
                                        <Link href="/camaqua" passHref>
                                            <div>Camaquã</div>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li className={pathname === '/destaques' ? styles.active : ''}>
                            <Link href="/destaques" passHref>
                                <div>Destaques</div>
                            </Link>
                        </li>
                        {adminId && (
                            <li className={styles.dropdown} ref={gerenciamentoDropdownRef}>
                                <div onClick={() => setGerenciamentoDropdownOpen(!gerenciamentoDropdownOpen)}>
                                    Gerenciamento
                                </div>
                                {gerenciamentoDropdownOpen && (
                                    <ul className={styles.dropdownMenu}>
                                        <li className={pathname === '/listagem' ? styles.active : ''}>
                                            <Link href="/listagem" passHref>
                                                <div>Produtos</div>
                                            </Link>
                                        </li>
                                        <li className={pathname === '/lista-pedidos' ? styles.active : ''}>
                                            <Link href="/lista-pedidos" passHref>
                                                <div>Pedidos</div>
                                            </Link>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        )}
                    </ul>
                </div>
            </header>
        </Suspense>
    );
};

export default HeaderSmall;
