import React, { useState, useEffect } from 'react';
import styles from './CustomCarousel.module.css';
import Image from 'next/image';

const CustomCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Função para avançar para a próxima imagem
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Função para voltar para a imagem anterior
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Função para alternar automaticamente as imagens a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Intervalo de 5 segundos
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className={styles.carousel}>
      {/* Botão para voltar para a imagem anterior */}
      <button className={styles.prevButton} onClick={prevSlide}>
        &lt;
      </button>
      {/* Imagem atual */}
      <div className={styles.imageContainer}>
        <Image
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          layout="fill"
          objectFit="cover"
          className={styles.image}
        />
      </div>
      {/* Botão para avançar para a próxima imagem */}
      <button className={styles.nextButton} onClick={nextSlide}>
        &gt;
      </button>
    </div>
  );
};

export default CustomCarousel;
