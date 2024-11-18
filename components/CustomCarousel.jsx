import React, { useState, useEffect } from 'react';
import styles from './CustomCarousel.module.css';
import Image from 'next/image';

const CustomCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); 
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
