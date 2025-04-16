// next-sitemap.config.js
module.exports = {
  siteUrl: 'https://maxwritings.com',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ['/admin/*', '/server-sitemap.xml'],
  
  // Remove the additionalPaths function for now to get it working
  // We'll handle dynamic routes through server-sitemap.xml instead
  
  transform: async (config, path) => {
    const isBlog = path.startsWith('/blogs/');
    
    return {
      loc: path,
      changefreq: isBlog ? 'weekly' : 'daily',
      priority: isBlog ? 0.8 : 0.7,
      lastmod: new Date().toISOString(),
    };
  },
  
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin'],
      },
    ],
    additionalSitemaps: [
      'https://maxwritings.com/server-sitemap.xml',
    ],
  },
};