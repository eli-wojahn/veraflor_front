// components/Header.js

'use client';
import React, { Suspense, useState, useRef, useEffect, useContext } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Header.module.css';
import Image from 'next/image';
import { AdministradorContext } from '@/contexts/administrator';
import { ClienteContext } from '@/contexts/client';
import { CiSearch } from 'react-icons/ci';
import { IoExitOutline, IoCartOutline } from 'react-icons/io5';
import { FaBars, FaRegUser } from 'react-icons/fa';
import HeaderSmall from './HeaderSmall';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Cookies from 'js-cookie';

const MySwal = withReactContent(Swal);

const Header = () => {
    const pathname = usePathname();
    const { adminId, adminNome, mudaId, mudaNome } = useContext(AdministradorContext);
    const { clienteId, clienteNome, cartItemCount, logout: clienteLogout, atualizarCartItemCount } = useContext(ClienteContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [gerenciamentoDropdownOpen, setGerenciamentoDropdownOpen] = useState(false); // Novo state
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();
    const dropdownRef = useRef(null);
    const gerenciamentoDropdownRef = useRef(null); // Novo ref
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
            }
        } catch (error) {
            console.error('Erro ao buscar itens do carrinho:', error);
        }
    };

    useEffect(() => {
        if (clienteId) {
            fetchCartItemCount(clienteId);
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

    const handleClickOutside = (event) => {
        if (
            !event.target.closest(`.${styles.userContainer}`) &&
            tooltipRef.current &&
            !tooltipRef.current.contains(event.target)
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
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isSmallScreen) {
        return <HeaderSmall />;
    }

    return (
        <header>
            <nav className={styles.navbar}>
                <div className={styles.logo}>
                    <Link href="/" passHref>
                        <Image
                            src="/images/logoCOR6.png"
                            alt="Logo"
                            width={170}
                            height={54}
                            layout="responsive"
                        />
                    </Link>
                </div>
                <div className={styles.menuIcon} onClick={() => setMenuOpen(!menuOpen)}>
                    <FaBars />
                </div>
                <div className={`${styles.menu} ${menuOpen ? styles.active : ''}`}>
                    <ul>
                        <li className={pathname === '/produtos' ? styles.active : ''}>
                            <Link href="/produtos" passHref>
                                <div>Produtos</div>
                            </Link>
                        </li>
                        <li className={styles.dropdown} ref={dropdownRef}>
                            <div className={styles.dropdownTitle} onClick={() => setDropdownOpen(!dropdownOpen)}>
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
                                <div className={styles.dropdownTitle} onClick={() => setGerenciamentoDropdownOpen(!gerenciamentoDropdownOpen)}>
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
                <div className={styles.searchBar}>
                    <div className={styles.searchIcon}>
                        <CiSearch />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar"
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                </div>
                <div className={styles.userContainer}>
                    {clienteId ? (
                        <div className={styles.userIconWrapper} ref={tooltipRef} onClick={toggleTooltip}>
                            <FaRegUser className={styles.userIcon} />
                            {tooltipOpen && (
                                <div className={styles.tooltip} ref={tooltipRef}>
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
                        <Link href="/loginCliente" passHref>
                            <FaRegUser className={styles.userIcon} />
                        </Link>
                    )}
                </div>
                <div className={styles.cartContainer}>
                    <Link href="/carrinho" passHref>
                        <div className={styles.cartIconWrapper}>
                            <IoCartOutline className={styles.cartIcon} />
                            {cartItemCount > 0 && (
                                <span className={styles.cartItemCount}>{cartItemCount}</span>
                            )}
                        </div>
                    </Link>
                </div>
                <div className={styles.logoutContainer}>
                    {adminNome && (
                        <div className={styles.logout}>
                            <span>{adminNome}{' '}</span>
                            <IoExitOutline onClick={logoutAdmin} className={styles.logoutIcon} />
                            <span className={styles.logoutTooltip}>Sair</span>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

const SearchPage = () => {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <Header />
        </Suspense>
    );
};

export default SearchPage;
