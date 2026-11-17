import fs from 'node:fs';
import path from 'node:path';
const dist=path.resolve('dist');
const base=process.env.SITE_URL?.trim();
if(!base){console.warn('SITE_URL unset; using existing canonical and sitemap');process.exit(0);}
let url;
try{url=new URL(base);if(!['http:','https:'].includes(url.protocol))throw Error('protocol');}
catch{throw Error('SITE_URL must be an absolute http(s) URL');}
const site=url.toString().replace(/\/?$/, '/');
let html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
const canonical='<link rel="canonical" href="'+site+'">';
const ogurl='<meta property="og:url" content="'+site+'">';
const ogimage='<meta property="og:image" content="'+new URL('assets/social-preview.svg',site)+'">';
html=html.replace(/\s*<link rel="canonical"[^>]*>/,'').replace(/\s*<meta property="og:url"[^>]*>/,'').replace(/\s*<meta property="og:image"[^>]*>/,'');
html=html.replace('</head>', '  '+canonical+'\n  '+ogurl+'\n  '+ogimage+'\n</head>');
html=html.replace(/"url":"https?:[^"]+",\s*/,'');
html=html.replace('"name":"Thai Distributed Studio",','"name":"Thai Distributed Studio",\n    "url":"'+site+'",');
fs.writeFileSync(path.join(dist,'index.html'),html);
fs.writeFileSync(path.join(dist,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>'+site+'</loc></url>\n</urlset>\n');
fs.writeFileSync(path.join(dist,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: '+new URL('sitemap.xml',site)+'\n');
console.log('SEO prepared for '+site);
