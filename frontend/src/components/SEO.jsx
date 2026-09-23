// src/components/SEO.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export default function SEO({ 
  title, 
  description, 
  keywords, 
  image = '/og-image.jpg', 
  url = 'https://digit-connect.cm',
  type = 'website' 
}) {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'fr';

  const defaultTitle = 'DIGIT-CONNECT | Agence Digitale & Solutions IT à Douala';
  const defaultDesc = 'Agence informatique et créative à Douala, Cameroun. Développement web, applications SaaS, branding, marketing digital et support IT.';
  const defaultKeywords = 'agence digitale cameroun, developpeur web douala, creation site internet cameroun, branding, devis en ligne IT';

  const pageTitle = title ? `${title} | DIGIT-CONNECT` : defaultTitle;
  const pageDesc = description || defaultDesc;
  const pageKeywords = keywords || defaultKeywords;

  return (
    <Helmet>
      {/* Configuration de base */}
      <html lang={lang} />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      <meta name="keywords" content={pageKeywords} />
      <meta name="author" content="DIGIT-CONNECT" />
      <meta name="robots" content="index, follow" />

      {/* Open Graph / Facebook & WhatsApp */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="DIGIT-CONNECT" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDesc} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}