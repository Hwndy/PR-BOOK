import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  siteName?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'The Science of Public Relations',
  description = 'Expert insights on PR measurement, analytics, and evaluation. Learn data-driven communication strategies from Philip Odiakose.',
  image = 'https://www.thescienceofpublicrelations.com/logo.png',
  url = 'https://www.thescienceofpublicrelations.com',
  type = 'website',
  author = 'Philip Odiakose',
  publishedTime,
  modifiedTime,
  tags = [],
  siteName = 'The Science of Public Relations'
}) => {
  // Ensure image URL is absolute
  const absoluteImageUrl = image?.startsWith('http') 
    ? image 
    : `https://www.thescienceofpublicrelations.com${image}`;

  // Ensure URL is absolute
  const absoluteUrl = url?.startsWith('http') 
    ? url 
    : `https://www.thescienceofpublicrelations.com${url}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="author" content={author} />
      <link rel="canonical" href={absoluteUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:url" content={absoluteUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImageUrl} />
      <meta name="twitter:creator" content="@philipodiakose" />
      <meta name="twitter:site" content="@philipodiakose" />

      {/* Article specific meta tags */}
      {type === 'article' && (
        <>
          <meta property="article:author" content={author} />
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      
      {/* Schema.org structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === 'article' ? 'Article' : 'WebPage',
          "headline": title,
          "description": description,
          "image": absoluteImageUrl,
          "url": absoluteUrl,
          "author": {
            "@type": "Person",
            "name": author,
            "url": "https://www.linkedin.com/in/philipodiakose/"
          },
          "publisher": {
            "@type": "Organization",
            "name": siteName,
            "logo": {
              "@type": "ImageObject",
              "url": "https://www.thescienceofpublicrelations.com/logo.png"
            }
          },
          ...(publishedTime && { "datePublished": publishedTime }),
          ...(modifiedTime && { "dateModified": modifiedTime }),
          ...(tags.length > 0 && { "keywords": tags.join(', ') })
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;
