import { Hono } from 'hono'
import { htmlHead, productSchema, storeSchema } from '../layout'

type Bindings = { DB: D1Database }

export const pageRoutes = new Hono<{ Bindings: Bindings }>()

// ─── HOME PAGE ───
pageRoutes.get('/', async (c) => {
  const { results: products } = await c.env.DB.prepare(
    'SELECT * FROM products WHERE in_stock = 1 AND featured = 1 ORDER BY sort_order ASC'
  ).all()

  const { results: legalPages } = await c.env.DB.prepare(
    'SELECT slug, title FROM legal_pages WHERE is_active = 1 ORDER BY sort_order ASC'
  ).all()

  const productCards = (products || []).map((p: any) => {
    const imgs = JSON.parse(p.images || '[]')
    const discount = p.compare_price ? Math.round((1 - p.price / p.compare_price) * 100) : 0
    return `
      <div class="product-card" data-slug="${p.slug}">
        <a href="/product/${p.slug}" class="product-link">
          <div class="product-image-wrapper">
            <img src="${imgs[0] || ''}" alt="intru.in ${p.name} - View 1" loading="lazy" width="400" height="500">
            ${imgs[1] ? `<img src="${imgs[1]}" alt="intru.in ${p.name} - View 2" loading="lazy" class="product-hover-img" width="400" height="500">` : ''}
            ${discount > 0 ? `<span class="badge-sale">-${discount}%</span>` : ''}
          </div>
          <div class="product-info">
            <h3>${p.name}</h3>
            <p class="product-short-desc">${p.short_description || ''}</p>
            <div class="product-pricing">
              <span class="price">\u20B9${p.price.toLocaleString('en-IN')}</span>
              ${p.compare_price ? `<span class="compare-price">\u20B9${p.compare_price.toLocaleString('en-IN')}</span>` : ''}
            </div>
          </div>
        </a>
        <button class="btn-add-cart" onclick="event.preventDefault();addToCart('${p.slug}','${p.name.replace(/'/g, "\\'")}',${p.price},'${imgs[0] || ''}')">
          <i class="fas fa-plus"></i> Add to Cart
        </button>
      </div>`
  }).join('')

  const footerLinks = (legalPages || []).map((p: any) =>
    `<a href="/legal/${p.slug}">${p.title}</a>`
  ).join('')

  const html = `${htmlHead(
    'intru.in \u2014 Minimalism & Everyday Style',
    'Premium minimalist streetwear from India. Crafted with organic cotton, built for everyday confidence. Shop oversized tees, hoodies, cargo pants & accessories.',
    `<script type="application/ld+json">${storeSchema()}</script>`
  )}
<body>
  <nav class="navbar" id="navbar">
    <div class="nav-inner">
      <a href="/" class="nav-logo">intru.in</a>
      <div class="nav-links"><a href="/#collection">Shop</a><a href="/#story">Story</a></div>
      <div class="nav-actions">
        <button class="btn-icon" onclick="openCart()" aria-label="Cart">
          <i class="fas fa-shopping-bag"></i><span class="cart-count" id="cartCount">0</span>
        </button>
      </div>
    </div>
  </nav>

  <section class="hero">
    <div class="hero-bg"><div class="hero-overlay"></div></div>
    <div class="hero-content">
      <p class="hero-label">New Collection 2025</p>
      <h1 class="hero-title">Style Redefined,<br><em>Effortlessly Yours</em></h1>
      <p class="hero-subtitle">Built from a shared love for minimalism & everyday style</p>
      <a href="#collection" class="btn-primary">Shop Collection <i class="fas fa-arrow-right"></i></a>
    </div>
  </section>

  <div class="marquee-strip">
    <div class="marquee-track">
      <span>Premium Quality</span><span>\u2022</span><span>Organic Cotton</span><span>\u2022</span><span>Designed in India</span><span>\u2022</span><span>Free Shipping \u20B91,999+</span><span>\u2022</span><span>7-Day Returns</span><span>\u2022</span>
      <span>Premium Quality</span><span>\u2022</span><span>Organic Cotton</span><span>\u2022</span><span>Designed in India</span><span>\u2022</span><span>Free Shipping \u20B91,999+</span><span>\u2022</span><span>7-Day Returns</span><span>\u2022</span>
    </div>
  </div>

  <section class="section story-section" id="story">
    <div class="container">
      <div class="story-grid">
        <div class="story-text">
          <p class="section-label">Our Story</p>
          <h2 class="section-title">Born from a love for<br><em>the essentials</em></h2>
          <p>intru.in began with a simple idea: clothing should feel as good as it looks. We obsess over fabric weight, stitch count, and the way a tee drapes on your shoulders \u2014 so you don't have to.</p>
          <p>Every piece is designed in India, made with organic cotton, and built to last. No logos screaming for attention. Just clean lines, honest materials, and a quiet confidence that speaks louder than any brand name.</p>
        </div>
        <div class="story-visual">
          <div class="story-img-frame">
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80" alt="intru.in brand story - minimalist clothing design studio" loading="lazy" width="600" height="700">
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section" id="collection">
    <div class="container">
      <p class="section-label center">The Collection</p>
      <h2 class="section-title center">Curated for<br><em>everyday confidence</em></h2>
      <div class="product-grid">${productCards}</div>
    </div>
  </section>

  <section class="testimonial-section">
    <div class="container">
      <div class="testimonial-card">
        <i class="fas fa-quote-left testimonial-icon"></i>
        <p class="testimonial-text">"The quality is unreal for the price. The Midnight Tee is the only tee I reach for now. Simple, soft, and it fits like it was made for me."</p>
        <div class="testimonial-author">
          <div class="author-avatar">R</div>
          <div><strong>Rohan K.</strong><span>Verified Buyer</span></div>
        </div>
      </div>
    </div>
  </section>

  <section class="section newsletter-section">
    <div class="container center">
      <p class="section-label">Stay Connected</p>
      <h2 class="section-title">Join the <em>intru.in</em> community</h2>
      <p class="newsletter-desc">First access to new drops, exclusive offers, and style inspiration. No spam \u2014 ever.</p>
      <form class="newsletter-form" onsubmit="event.preventDefault(); this.querySelector('button').textContent='Subscribed \u2713'; this.querySelector('button').disabled=true;">
        <input type="email" placeholder="Your email address" required>
        <button type="submit">Subscribe</button>
      </form>
    </div>
  </section>

  <section class="trust-section">
    <div class="container">
      <div class="trust-grid">
        <div class="trust-item"><i class="fas fa-truck"></i><h4>Free Shipping</h4><p>Orders above \u20B91,999</p></div>
        <div class="trust-item"><i class="fas fa-undo"></i><h4>Easy Returns</h4><p>7-day return window</p></div>
        <div class="trust-item"><i class="fas fa-shield-halved"></i><h4>Secure Payments</h4><p>Razorpay encrypted</p></div>
        <div class="trust-item"><i class="fas fa-leaf"></i><h4>Organic Cotton</h4><p>Sustainably sourced</p></div>
      </div>
    </div>
  </section>

  <section class="section ig-section">
    <div class="container center">
      <p class="section-label">Follow Us</p>
      <h2 class="section-title"><em>@intru.in</em></h2>
      <div class="ig-grid">
        <div class="ig-placeholder"><i class="fab fa-instagram"></i></div>
        <div class="ig-placeholder"><i class="fab fa-instagram"></i></div>
        <div class="ig-placeholder"><i class="fab fa-instagram"></i></div>
        <div class="ig-placeholder"><i class="fab fa-instagram"></i></div>
      </div>
      <a href="https://instagram.com/intru.in" target="_blank" rel="noopener" class="btn-outline" style="margin-top:2rem;">Follow on Instagram <i class="fas fa-external-link-alt"></i></a>
    </div>
  </section>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col"><h3 class="footer-logo">intru.in</h3><p>Minimalism & Everyday Style.<br>Designed in India.</p></div>
        <div class="footer-col"><h4>Shop</h4><a href="/#collection">All Products</a><a href="/#story">Our Story</a></div>
        <div class="footer-col"><h4>Legal</h4>${footerLinks}</div>
        <div class="footer-col"><h4>Connect</h4><a href="mailto:hello@intru.in">hello@intru.in</a><a href="https://instagram.com/intru.in" target="_blank" rel="noopener">Instagram</a></div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} intru.in \u2014 All rights reserved.</p>
        <div class="payment-icons"><i class="fab fa-cc-visa"></i><i class="fab fa-cc-mastercard"></i><i class="fab fa-google-pay"></i><i class="fas fa-money-bill-wave"></i></div>
      </div>
    </div>
  </footer>

  <div class="cart-overlay" id="cartOverlay" onclick="closeCart()"></div>
  <aside class="cart-drawer" id="cartDrawer">
    <div class="cart-header"><h3>Your Bag</h3><button onclick="closeCart()" class="btn-icon"><i class="fas fa-times"></i></button></div>
    <div class="cart-items" id="cartItems"><div class="cart-empty"><i class="fas fa-shopping-bag"></i><p>Your bag is empty</p><a href="#collection" onclick="closeCart()" class="btn-primary">Start Shopping</a></div></div>
    <div class="cart-footer" id="cartFooter" style="display:none;">
      <div class="cart-totals">
        <div class="cart-row"><span>Subtotal</span><span id="cartSubtotal">\u20B90</span></div>
        <div class="cart-row"><span>Shipping</span><span id="cartShipping">Calculated at checkout</span></div>
        <div class="cart-row cart-total-row"><span>Total</span><span id="cartTotal">\u20B90</span></div>
      </div>
      <button class="btn-checkout" onclick="goToCheckout()">Proceed to Checkout <i class="fas fa-arrow-right"></i></button>
    </div>
  </aside>

  <div class="zoom-modal" id="zoomModal" onclick="closeZoom()">
    <button class="zoom-close" onclick="closeZoom()"><i class="fas fa-times"></i></button>
    <img id="zoomImg" src="" alt="Zoomed product image">
  </div>

  <script src="/static/app.js"></script>
</body>
</html>`

  return c.html(html)
})

// ─── PRODUCT DETAIL PAGE ───
pageRoutes.get('/product/:slug', async (c) => {
  const slug = c.req.param('slug')
  const product = await c.env.DB.prepare('SELECT * FROM products WHERE slug = ?').bind(slug).first() as any

  if (!product) {
    return c.html(`${htmlHead('Not Found \u2014 intru.in', 'Page not found')}<body class="error-page"><div class="container center"><h1>404</h1><p>Product not found</p><a href="/" class="btn-primary">Go Home</a></div></body></html>`, 404)
  }

  const images: string[] = JSON.parse(product.images || '[]')
  const discount = product.compare_price ? Math.round((1 - product.price / product.compare_price) * 100) : 0

  const { results: legalPages } = await c.env.DB.prepare('SELECT slug, title FROM legal_pages WHERE is_active = 1 ORDER BY sort_order ASC').all()
  const footerLinks = (legalPages || []).map((p: any) => `<a href="/legal/${p.slug}">${p.title}</a>`).join('')

  const imageGallery = images.map((img: string, i: number) => `
    <div class="gallery-thumb ${i === 0 ? 'active' : ''}" onclick="setMainImage(${i})">
      <img src="${img}" alt="intru.in ${product.name} - View ${i + 1}" loading="${i === 0 ? 'eager' : 'lazy'}" width="100" height="125">
    </div>
  `).join('')

  const carouselDots = images.map((_: string, i: number) => `
    <button class="carousel-dot ${i === 0 ? 'active' : ''}" onclick="setMainImage(${i})" aria-label="View image ${i + 1}"></button>
  `).join('')

  const html = `${htmlHead(
    `${product.name} \u2014 intru.in`,
    `${product.short_description || product.description.substring(0, 155)}. Shop premium minimalist streetwear at intru.in`,
    `<script type="application/ld+json">${productSchema(product)}</script>`
  )}
<body>
  <nav class="navbar" id="navbar">
    <div class="nav-inner">
      <a href="/" class="nav-logo">intru.in</a>
      <div class="nav-links"><a href="/#collection">Shop</a><a href="/#story">Story</a></div>
      <div class="nav-actions">
        <button class="btn-icon" onclick="openCart()" aria-label="Cart">
          <i class="fas fa-shopping-bag"></i><span class="cart-count" id="cartCount">0</span>
        </button>
      </div>
    </div>
  </nav>

  <main class="pdp-main">
    <div class="container">
      <nav class="breadcrumb">
        <a href="/">Home</a> <span>/</span> <a href="/#collection">Shop</a> <span>/</span> <span>${product.name}</span>
      </nav>

      <div class="pdp-grid">
        <div class="pdp-gallery">
          <div class="pdp-thumbs-col">${imageGallery}</div>
          <div class="pdp-main-image" id="pdpMainImageWrap">
            <img id="pdpMainImage" src="${images[0] || ''}" alt="intru.in ${product.name}" onclick="openZoom(this.src)" width="600" height="750">
            ${discount > 0 ? `<span class="badge-sale badge-sale-pdp">-${discount}%</span>` : ''}
            <div class="carousel-dots-pdp" id="carouselDots">${carouselDots}</div>
          </div>
          <div class="pdp-mobile-carousel" id="mobileCarousel">
            <div class="carousel-track" id="carouselTrack">
              ${images.map((img: string, i: number) => `<div class="carousel-slide"><img src="${img}" alt="intru.in ${product.name} - View ${i + 1}" loading="${i === 0 ? 'eager' : 'lazy'}" onclick="openZoom(this.src)" width="400" height="500"></div>`).join('')}
            </div>
            <div class="carousel-dots" id="mobileCarouselDots">${carouselDots}</div>
          </div>
        </div>

        <div class="pdp-details">
          <h1 class="pdp-name">${product.name}</h1>
          <div class="pdp-pricing">
            <span class="pdp-price">\u20B9${product.price.toLocaleString('en-IN')}</span>
            ${product.compare_price ? `<span class="pdp-compare">\u20B9${product.compare_price.toLocaleString('en-IN')}</span><span class="pdp-discount">Save ${discount}%</span>` : ''}
          </div>
          <p class="pdp-tax-note">Inclusive of all taxes</p>
          <div class="pdp-description"><p>${product.description}</p></div>
          <div class="pdp-quantity">
            <label>Quantity</label>
            <div class="qty-control">
              <button onclick="changeQty(-1)" class="qty-btn">\u2212</button>
              <input type="number" id="pdpQty" value="1" min="1" max="10" readonly>
              <button onclick="changeQty(1)" class="qty-btn">+</button>
            </div>
          </div>
          <button class="btn-add-cart-pdp" onclick="addToCart('${product.slug}','${product.name.replace(/'/g, "\\'")}',${product.price},'${images[0] || ''}',getQty())">
            <i class="fas fa-shopping-bag"></i> Add to Bag \u2014 \u20B9${product.price.toLocaleString('en-IN')}
          </button>
          <div class="pdp-trust">
            <div><i class="fas fa-truck"></i> Free shipping on \u20B91,999+</div>
            <div><i class="fas fa-undo"></i> 7-day easy returns</div>
            <div><i class="fas fa-shield-halved"></i> Secure checkout</div>
          </div>
          <details class="pdp-accordion">
            <summary>Product Details</summary>
            <div class="accordion-content"><ul><li>Premium organic cotton</li><li>Pre-washed for zero shrinkage</li><li>Reinforced stitching</li><li>Machine wash cold</li></ul></div>
          </details>
          <details class="pdp-accordion">
            <summary>Shipping & Returns</summary>
            <div class="accordion-content"><p>Free shipping on orders above \u20B91,999. Standard delivery in 5-7 business days. 7-day hassle-free returns.</p></div>
          </details>
        </div>
      </div>
    </div>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col"><h3 class="footer-logo">intru.in</h3><p>Minimalism & Everyday Style.<br>Designed in India.</p></div>
        <div class="footer-col"><h4>Shop</h4><a href="/#collection">All Products</a><a href="/#story">Our Story</a></div>
        <div class="footer-col"><h4>Legal</h4>${footerLinks}</div>
        <div class="footer-col"><h4>Connect</h4><a href="mailto:hello@intru.in">hello@intru.in</a><a href="https://instagram.com/intru.in" target="_blank" rel="noopener">Instagram</a></div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} intru.in \u2014 All rights reserved.</p>
        <div class="payment-icons"><i class="fab fa-cc-visa"></i><i class="fab fa-cc-mastercard"></i><i class="fab fa-google-pay"></i><i class="fas fa-money-bill-wave"></i></div>
      </div>
    </div>
  </footer>

  <div class="cart-overlay" id="cartOverlay" onclick="closeCart()"></div>
  <aside class="cart-drawer" id="cartDrawer">
    <div class="cart-header"><h3>Your Bag</h3><button onclick="closeCart()" class="btn-icon"><i class="fas fa-times"></i></button></div>
    <div class="cart-items" id="cartItems"><div class="cart-empty"><i class="fas fa-shopping-bag"></i><p>Your bag is empty</p></div></div>
    <div class="cart-footer" id="cartFooter" style="display:none;">
      <div class="cart-totals">
        <div class="cart-row"><span>Subtotal</span><span id="cartSubtotal">\u20B90</span></div>
        <div class="cart-row"><span>Shipping</span><span id="cartShipping">Free</span></div>
        <div class="cart-row cart-total-row"><span>Total</span><span id="cartTotal">\u20B90</span></div>
      </div>
      <button class="btn-checkout" onclick="goToCheckout()">Proceed to Checkout <i class="fas fa-arrow-right"></i></button>
    </div>
  </aside>
  <div class="zoom-modal" id="zoomModal" onclick="closeZoom()"><button class="zoom-close" onclick="closeZoom()"><i class="fas fa-times"></i></button><img id="zoomImg" src="" alt="Zoomed product image"></div>

  <script>
    var PRODUCT_IMAGES = ${JSON.stringify(images)};
    var currentImageIndex = 0;
  </script>
  <script src="/static/app.js"></script>
</body>
</html>`

  return c.html(html)
})

// ─── CHECKOUT PAGE ───
pageRoutes.get('/checkout', async (c) => {
  const html = `${htmlHead('Checkout \u2014 intru.in', 'Secure checkout at intru.in')}
<body>
  <nav class="navbar" id="navbar">
    <div class="nav-inner">
      <a href="/" class="nav-logo">intru.in</a>
      <div class="nav-links"></div>
      <div class="nav-actions"><a href="/" class="btn-text"><i class="fas fa-arrow-left"></i> Continue Shopping</a></div>
    </div>
  </nav>
  <main class="checkout-main">
    <div class="container">
      <h1 class="checkout-title">Checkout</h1>
      <div class="checkout-grid">
        <div class="checkout-form-wrap">
          <h2>Shipping Details</h2>
          <form id="checkoutForm" onsubmit="event.preventDefault(); processCheckout()">
            <div class="form-row">
              <div class="form-group"><label>Full Name *</label><input type="text" id="custName" required placeholder="Your full name"></div>
              <div class="form-group"><label>Phone *</label><input type="tel" id="custPhone" required placeholder="10-digit phone" pattern="[0-9]{10}"></div>
            </div>
            <div class="form-group"><label>Email *</label><input type="email" id="custEmail" required placeholder="your@email.com"></div>
            <div class="form-group"><label>Shipping Address *</label><textarea id="custAddress" required rows="3" placeholder="Full address with city, state, pincode"></textarea></div>
            <div class="form-group"><label>Order Notes (optional)</label><textarea id="custNotes" rows="2" placeholder="Any special instructions"></textarea></div>
            <button type="submit" class="btn-checkout" id="checkoutBtn">Place Order <i class="fas fa-lock"></i></button>
          </form>
        </div>
        <div class="checkout-summary">
          <h2>Order Summary</h2>
          <div id="checkoutItems"></div>
          <div class="cart-totals">
            <div class="cart-row"><span>Subtotal</span><span id="checkSubtotal">\u20B90</span></div>
            <div class="cart-row"><span>Shipping</span><span id="checkShipping">Free</span></div>
            <div class="cart-row cart-total-row"><span>Total</span><span id="checkTotal">\u20B90</span></div>
          </div>
          <div class="checkout-trust"><i class="fas fa-shield-halved"></i><span>Your data is encrypted and secure</span></div>
        </div>
      </div>
    </div>
  </main>
  <script src="/static/app.js"></script>
  <script>renderCheckoutPage();</script>
</body>
</html>`
  return c.html(html)
})

// ─── ORDER CONFIRMATION ───
pageRoutes.get('/order/:orderId', async (c) => {
  const orderId = c.req.param('orderId')
  const order = await c.env.DB.prepare('SELECT * FROM orders WHERE order_id = ?').bind(orderId).first() as any

  if (!order) {
    return c.html(`${htmlHead('Order Not Found \u2014 intru.in', 'Order not found')}<body class="error-page"><div class="container center"><h1>Order Not Found</h1><p>We couldn't find that order.</p><a href="/" class="btn-primary">Go Home</a></div></body></html>`, 404)
  }

  const items = JSON.parse(order.items || '[]')
  const statusSteps = ['received', 'confirmed', 'shipped', 'delivered']
  const currentStep = statusSteps.indexOf(order.order_status)

  const html = `${htmlHead('Order ' + order.order_id + ' \u2014 intru.in', 'Your order details at intru.in')}
<body>
  <nav class="navbar"><div class="nav-inner"><a href="/" class="nav-logo">intru.in</a><div class="nav-links"></div><div class="nav-actions"><a href="/" class="btn-text">Continue Shopping</a></div></div></nav>
  <main class="order-main">
    <div class="container">
      <div class="order-success">
        <i class="fas fa-check-circle"></i>
        <h1>Thank You!</h1>
        <p>Your order <strong>${order.order_id}</strong> has been placed.</p>
      </div>
      <div class="order-progress">
        ${statusSteps.map((s, i) => `<div class="progress-step ${i <= currentStep ? 'active' : ''}"><div class="step-dot"></div><span>${s.charAt(0).toUpperCase() + s.slice(1)}</span></div>`).join('')}
      </div>
      <div class="order-details-grid">
        <div class="order-items-list">
          <h3>Items Ordered</h3>
          ${items.map((item: any) => `<div class="order-item"><img src="${item.image}" alt="${item.name}" width="80" height="100"><div><h4>${item.name}</h4><p>Qty: ${item.quantity} \u00D7 \u20B9${item.price.toLocaleString('en-IN')}</p></div><span class="order-item-total">\u20B9${(item.price * item.quantity).toLocaleString('en-IN')}</span></div>`).join('')}
        </div>
        <div class="order-summary-card">
          <h3>Order Summary</h3>
          <div class="cart-row"><span>Subtotal</span><span>\u20B9${order.subtotal.toLocaleString('en-IN')}</span></div>
          <div class="cart-row"><span>Shipping</span><span>${order.shipping === 0 ? 'Free' : '\u20B9' + order.shipping.toLocaleString('en-IN')}</span></div>
          <div class="cart-row cart-total-row"><span>Total</span><span>\u20B9${order.total.toLocaleString('en-IN')}</span></div>
          <div class="order-meta">
            <p><strong>Payment:</strong> ${order.payment_status === 'paid' ? '\u2705 Paid' : '\u23F3 Pending'}</p>
            <p><strong>Shipping to:</strong><br>${order.shipping_address || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</body>
</html>`
  return c.html(html)
})

// ─── LEGAL PAGES ───
pageRoutes.get('/legal/:slug', async (c) => {
  const slug = c.req.param('slug')
  const page = await c.env.DB.prepare('SELECT * FROM legal_pages WHERE slug = ? AND is_active = 1').bind(slug).first() as any

  if (!page) {
    return c.html(`${htmlHead('Not Found \u2014 intru.in', 'Page not found')}<body class="error-page"><div class="container center"><h1>404</h1><p>Page not found</p><a href="/" class="btn-primary">Go Home</a></div></body></html>`, 404)
  }

  const { results: legalPages } = await c.env.DB.prepare('SELECT slug, title FROM legal_pages WHERE is_active = 1 ORDER BY sort_order ASC').all()
  const sideLinks = (legalPages || []).map((p: any) => `<a href="/legal/${p.slug}" class="${p.slug === slug ? 'active' : ''}">${p.title}</a>`).join('')

  const html = `${htmlHead(page.title + ' \u2014 intru.in', page.title + ' for intru.in - Read our policies and legal information.')}
<body>
  <nav class="navbar"><div class="nav-inner"><a href="/" class="nav-logo">intru.in</a><div class="nav-links"><a href="/#collection">Shop</a><a href="/#story">Story</a></div><div class="nav-actions"><button class="btn-icon" onclick="openCart()" aria-label="Cart"><i class="fas fa-shopping-bag"></i><span class="cart-count" id="cartCount">0</span></button></div></div></nav>
  <main class="legal-main">
    <div class="container">
      <div class="legal-grid">
        <aside class="legal-sidebar"><h3>Policies</h3>${sideLinks}</aside>
        <article class="legal-content">
          <h1>${page.title}</h1>
          <div class="legal-body">${page.content}</div>
          <p class="legal-updated">Last updated: ${new Date(page.updated_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </article>
      </div>
    </div>
  </main>
  <div class="cart-overlay" id="cartOverlay" onclick="closeCart()"></div>
  <aside class="cart-drawer" id="cartDrawer">
    <div class="cart-header"><h3>Your Bag</h3><button onclick="closeCart()" class="btn-icon"><i class="fas fa-times"></i></button></div>
    <div class="cart-items" id="cartItems"><div class="cart-empty"><i class="fas fa-shopping-bag"></i><p>Your bag is empty</p></div></div>
    <div class="cart-footer" id="cartFooter" style="display:none;"><div class="cart-totals"><div class="cart-row"><span>Subtotal</span><span id="cartSubtotal">\u20B90</span></div><div class="cart-row"><span>Shipping</span><span id="cartShipping">Free</span></div><div class="cart-row cart-total-row"><span>Total</span><span id="cartTotal">\u20B90</span></div></div><button class="btn-checkout" onclick="goToCheckout()">Checkout <i class="fas fa-arrow-right"></i></button></div>
  </aside>
  <div class="zoom-modal" id="zoomModal" onclick="closeZoom()"><button class="zoom-close" onclick="closeZoom()"><i class="fas fa-times"></i></button><img id="zoomImg" src="" alt="Zoomed image"></div>
  <script src="/static/app.js"></script>
</body>
</html>`
  return c.html(html)
})
