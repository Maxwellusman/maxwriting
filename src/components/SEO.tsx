import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  article?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Your Blog Name - Default Title',
  description = 'Default description for your blog',
  keywords = ['blog', 'default', 'keywords'],
  image = '/default-image.jpg',
  article = false,
  publishedTime,
  modifiedTime,
  author,
}) => {
  const router = useRouter();
  const baseUrl = 'https://yourblogdomain.com';
  const currentUrl = `${baseUrl}${router.asPath}`;
  const siteName = 'Your Blog Name';

  // Default meta title should be under 60 chars
  const metaTitle = title.length > 60 ? `${title.substring(0, 57)}...` : title;
  
  // Default meta description should be under 160 chars
  const metaDescription = description.length > 160 
    ? `${description.substring(0, 157)}...` 
    : description;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="title" content={metaTitle} />
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content={author || 'Your Name'} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={metaTitle} />
      <meta property="twitter:description" content={metaDescription} />
      <meta property="twitter:image" content={image} />

      {/* Article-specific tags */}
      {article && (
        <>
          <meta property="article:published_time" content={publishedTime} />
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          <meta property="article:author" content={author || 'Your Name'} />
          <meta property="article:section" content="Technology" />
          <meta property="article:tag" content={keywords.join(', ')} />
        </>
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": article ? "BlogPosting" : "WebSite",
          "headline": metaTitle,
          "description": metaDescription,
          "url": currentUrl,
          "name": siteName,
          "image": image,
          "publisher": {
            "@type": "Organization",
            "name": siteName,
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/logo.png`
            }
          },
          ...(article && {
            "datePublished": publishedTime,
            "dateModified": modifiedTime || publishedTime,
            "author": {
              "@type": "Person",
              "name": author || "Your Name"
            }
          })
        })}
      </script>
    </Head>
  );
};

export default SEO;