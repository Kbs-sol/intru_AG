import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { PRODUCTS, LEGAL_PAGES, STORE_CONFIG } from './data'
import { homePage } from './pages/home'
import { productPage } from './pages/product'
import { legalPage } from './pages/legal'
import { adminPage } from './pages/admin'

const app = new Hono()

// CORS for API routes
app.use('/api/*', cors())

// ============ PAGE ROUTES ============

// Homepage
app.get('/', (c) => {
  return c.html(homePage())
})

// Product page
app.get('/product/:slug', (c) => {
  const slug = c.req.param('slug')
  const product = PRODUCTS.find(p => p.slug === slug)
  if (!product) {
    return c.html(`<html><head><meta http-equiv="refresh" content="0;url=/"></head></html>`, 404)
  }
  return c.html(productPage(product))
})

// Legal pages
app.get('/p/:slug', (c) => {
  const slug = c.req.param('slug')
  const page = LEGAL_PAGES.find(p => p.slug === slug)
  if (!page) {
    return c.html(`<html><head><meta http-equiv="refresh" content="0;url=/"></head></html>`, 404)
  }
  return c.html(legalPage(page))
})

// Admin panel
app.get('/admin', (c) => {
  return c.html(adminPage())
})

// ============ API ROUTES ============

// Get all products (for admin/frontend)
app.get('/api/products', (c) => {
  return c.json({
    products: PRODUCTS.map(p => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.price,
      comparePrice: p.comparePrice,
      images: p.images,
      sizes: p.sizes,
      category: p.category,
      inStock: p.inStock,
    }))
  })
})

// Get single product
app.get('/api/products/:id', (c) => {
  const id = c.req.param('id')
  const product = PRODUCTS.find(p => p.id === id || p.slug === id)
  if (!product) {
    return c.json({ error: 'Product not found' }, 404)
  }
  return c.json({ product })
})

// Checkout endpoint - validates prices server-side
app.post('/api/checkout', async (c) => {
  try {
    const body = await c.req.json()
    const items = body.items

    if (!items || !Array.isArray(items) || items.length === 0) {
      return c.json({ error: 'No items in cart' }, 400)
    }

    let subtotal = 0
    const validatedItems: any[] = []

    for (const item of items) {
      const product = PRODUCTS.find(p => p.id === item.productId)
      if (!product) {
        return c.json({ error: `Product ${item.productId} not found` }, 400)
      }
      if (!product.inStock) {
        return c.json({ error: `${product.name} is out of stock` }, 400)
      }
      if (!product.sizes.includes(item.size)) {
        return c.json({ error: `Size ${item.size} not available for ${product.name}` }, 400)
      }

      const qty = Math.max(1, Math.min(10, parseInt(item.quantity) || 1))
      const lineTotal = product.price * qty
      subtotal += lineTotal

      validatedItems.push({
        productId: product.id,
        name: product.name,
        size: item.size,
        quantity: qty,
        unitPrice: product.price,
        lineTotal,
      })
    }

    const shipping = subtotal >= STORE_CONFIG.freeShippingThreshold ? 0 : STORE_CONFIG.shippingCost
    const total = subtotal + shipping

    // In production: create Razorpay order here
    // const razorpay = new Razorpay({ key_id: env.RAZORPAY_KEY_ID, key_secret: env.RAZORPAY_KEY_SECRET })
    // const order = await razorpay.orders.create({ amount: total * 100, currency: 'INR' })

    return c.json({
      success: true,
      items: validatedItems,
      subtotal,
      shipping,
      total,
      currency: 'INR',
      storeCredit: 0,
      message: 'Connect Razorpay in production to complete payment.',
      // razorpayOrderId: order.id // in production
    })
  } catch (e: any) {
    return c.json({ error: e.message || 'Checkout failed' }, 500)
  }
})

// Auth endpoint (Google One-Tap callback)
app.post('/api/auth/google', async (c) => {
  try {
    const body = await c.req.json()
    const { credential } = body

    if (!credential) {
      return c.json({ error: 'No credential provided' }, 400)
    }

    // In production: verify Google JWT token with Google's API
    // const ticket = await client.verifyIdToken({ idToken: credential, audience: GOOGLE_CLIENT_ID })
    // const payload = ticket.getPayload()
    // Then upsert user in Supabase

    return c.json({
      success: true,
      message: 'Google auth received. Connect Supabase for user management in production.',
    })
  } catch (e: any) {
    return c.json({ error: e.message || 'Auth failed' }, 500)
  }
})

// Magic link auth
app.post('/api/auth/magic-link', async (c) => {
  try {
    const body = await c.req.json()
    const { email } = body

    if (!email || !email.includes('@')) {
      return c.json({ error: 'Valid email required' }, 400)
    }

    // In production: use Supabase Auth magic link
    // await supabase.auth.signInWithOtp({ email })

    return c.json({
      success: true,
      message: 'Magic link would be sent to ' + email + '. Connect Supabase Auth in production.',
    })
  } catch (e: any) {
    return c.json({ error: e.message || 'Failed to send magic link' }, 500)
  }
})

// Admin auth
app.post('/api/admin/auth', async (c) => {
  try {
    const body = await c.req.json()
    if (body.password === STORE_CONFIG.adminPassword) {
      return c.json({ success: true })
    }
    return c.json({ error: 'Invalid password' }, 401)
  } catch (e: any) {
    return c.json({ error: 'Auth failed' }, 500)
  }
})

// Store credit check
app.post('/api/store-credit', async (c) => {
  try {
    const body = await c.req.json()
    const { email } = body

    if (!email) {
      return c.json({ error: 'Email required' }, 400)
    }

    // In production: check Supabase store_credits table
    return c.json({
      email,
      balance: 0,
      message: 'Connect Supabase for store credit management in production.',
    })
  } catch (e: any) {
    return c.json({ error: e.message || 'Failed to check store credit' }, 500)
  }
})

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', store: STORE_CONFIG.name, timestamp: new Date().toISOString() })
})

// 404 catch-all
app.all('*', (c) => {
  return c.html(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>404 — INTRU.IN</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Space Grotesk',sans-serif;background:#fafafa;color:#0a0a0a;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:24px}h1{font-family:'Archivo Black',sans-serif;font-size:clamp(60px,12vw,120px);text-transform:uppercase;letter-spacing:-.05em;margin-bottom:8px}p{color:#737373;font-size:14px;margin-bottom:28px}a{display:inline-block;padding:14px 36px;background:#0a0a0a;color:#fafafa;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;text-decoration:none;transition:all .2s}a:hover{background:#404040;transform:translateY(-2px)}</style></head>
<body><div><h1>404</h1><p>This page doesn't exist. Maybe it sold out.</p><a href="/">Back to Drop</a></div></body></html>`, 404)
})

export default app
