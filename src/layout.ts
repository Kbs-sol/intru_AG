export function htmlHead(title: string, description: string, extra?: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://intru.in">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="intru.in">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#000000">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>&#x25CF;</text></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css" rel="stylesheet">
  <link href="/static/style.css" rel="stylesheet">
  ${extra || ''}
</head>`
}

export function productSchema(product: any) {
  const images = JSON.parse(product.images || '[]')
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": images,
    "brand": { "@type": "Brand", "name": "intru.in" },
    "offers": {
      "@type": "Offer",
      "url": "https://intru.in/product/" + product.slug,
      "priceCurrency": "INR",
      "price": product.price,
      "availability": product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": { "@type": "Organization", "name": "intru.in" }
    }
  })
}

export function storeSchema() {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "intru.in",
    "url": "https://intru.in",
    "description": "Premium minimalist streetwear brand. Built from a shared love for minimalism & everyday style.",
    "contactPoint": { "@type": "ContactPoint", "email": "hello@intru.in", "contactType": "customer service" }
  })
}
