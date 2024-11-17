'use client';
import React from 'react';
import styles from './politicaPrivacidade.module.css';

const PoliticaPrivacidade = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Política de Privacidade</h1>
      <p className={styles.paragraph}>
        Esta Política de Privacidade descreve como a Veraflor coleta, usa e protege suas informações pessoais quando você visita nosso site ou utiliza nossos serviços. Sua privacidade é muito importante para nós, e estamos comprometidos em proteger suas informações pessoais.
      </p>

      <h2 className={styles.subtitle}>1. Informações que Coletamos</h2>
      <p className={styles.paragraph}>
        Coletamos informações pessoais, como nome, endereço de e-mail, número de telefone e outros dados necessários para a prestação de nossos serviços. As informações podem ser coletadas quando você preenche formulários em nosso site, se inscreve em nossa newsletter ou entra em contato conosco.
      </p>

      <h2 className={styles.subtitle}>2. Como Usamos Suas Informações</h2>
      <p className={styles.paragraph}>Utilizamos as informações coletadas para:</p>
      <ul className={styles.list}>
        <li>Prestar nossos serviços e processar pedidos;</li>
        <li>Melhorar a experiência de navegação no nosso site;</li>
        <li>Enviar comunicações de marketing e promoções, caso você tenha consentido em recebê-las;</li>
        <li>Responder às suas perguntas e solicitações;</li>
        <li>Cumprir obrigações legais e regulamentares.</li>
      </ul>

      <h2 className={styles.subtitle}>3. Proteção de Dados Pessoais</h2>
      <p className={styles.paragraph}>
        Tomamos medidas razoáveis para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhuma transmissão de dados pela Internet ou sistema de armazenamento eletrônico é completamente segura, e não podemos garantir a segurança absoluta de suas informações.
      </p>

      <h2 className={styles.subtitle}>4. Compartilhamento de Informações</h2>
      <p className={styles.paragraph}>
        Não compartilhamos suas informações pessoais com terceiros, exceto quando necessário para fornecer nossos serviços, cumprir com obrigações legais ou com seu consentimento explícito.
      </p>

      <h2 className={styles.subtitle}>5. Seus Direitos</h2>
      <p className={styles.paragraph}>
        Você tem o direito de acessar, corrigir ou excluir suas informações pessoais armazenadas conosco. Caso queira exercer esses direitos, entre em contato conosco através dos nossos canais de atendimento.
      </p>

      <h2 className={styles.subtitle}>6. Alterações nesta Política</h2>
      <p className={styles.paragraph}>
        Reservamo-nos o direito de alterar esta Política de Privacidade a qualquer momento. As alterações serão publicadas em nosso site, e a data de revisão será atualizada no final da política.
      </p>

      <h2 className={styles.subtitle}>7. Contato</h2>
      <p className={styles.paragraph}>
        Se você tiver alguma dúvida sobre nossa Política de Privacidade, entre em contato conosco através do e-mail: <strong>contato@veraflor.com</strong>.
      </p>
    </div>
  );
};

export default PoliticaPrivacidade;
