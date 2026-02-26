import { Hono } from 'hono'
type Bindings = { DB: D1Database }
export const apiRoutes = new Hono<{ Bindings: Bindings }>()

apiRoutes.get('/products', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM products WHERE in_stock = 1 ORDER BY sort_order ASC').all()
  return c.json({ products: results })
})

apiRoutes.get('/products/:slug', async (c) => {
  const slug = c.req.param('slug')
  const product = await c.env.DB.prepare('SELECT * FROM products WHERE slug = ?').bind(slug).first()
  if (!product) return c.json({ error: 'Product not found' }, 404)
  return c.json({ product })
})

apiRoutes.post('/checkout', async (c) => {
  try {
    const body = await c.req.json()
    const { items, customer } = body
    if (!items || !items.length || !customer) return c.json({ error: 'Missing items or customer info' }, 400)
    const slugs = items.map((i: any) => i.slug)
    const placeholders = slugs.map(() => '?').join(',')
    const { results: products } = await c.env.DB.prepare(`SELECT * FROM products WHERE slug IN (${placeholders}) AND in_stock = 1`).bind(...slugs).all()
    if (!products || products.length !== items.length) return c.json({ error: 'Some products are unavailable' }, 400)
    const productMap = new Map(products.map((p: any) => [p.slug, p]))
    let subtotal = 0
    const verifiedItems: any[] = []
    for (const item of items) {
      const product = productMap.get(item.slug) as any
      if (!product) return c.json({ error: `Product ${item.slug} not found` }, 400)
      subtotal += product.price * item.quantity
      verifiedItems.push({ slug: product.slug, name: product.name, price: product.price, quantity: item.quantity, image: JSON.parse(product.images)[0] || '' })
    }
    const thresholdRow = await c.env.DB.prepare("SELECT value FROM settings WHERE key = 'free_shipping_threshold'").first() as any
    const feeRow = await c.env.DB.prepare("SELECT value FROM settings WHERE key = 'flat_shipping_fee'").first() as any
    const shipping = subtotal >= parseFloat(thresholdRow?.value || '1999') ? 0 : parseFloat(feeRow?.value || '99')
    const total = subtotal + shipping
    const orderId = 'INTRU-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase()
    await c.env.DB.prepare(`INSERT INTO orders (order_id, customer_name, customer_email, customer_phone, shipping_address, items, subtotal, shipping, total, payment_status, order_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'received')`).bind(orderId, customer.name, customer.email, customer.phone || '', customer.address || '', JSON.stringify(verifiedItems), subtotal, shipping, total).run()
    return c.json({ order_id: orderId, items: verifiedItems, subtotal, shipping, total, currency: 'INR' })
  } catch (e: any) { return c.json({ error: e.message || 'Checkout failed' }, 500) }
})

apiRoutes.post('/payment/verify', async (c) => {
  try {
    const { order_id, payment_id } = await c.req.json()
    if (!order_id || !payment_id) return c.json({ error: 'Missing order_id or payment_id' }, 400)
    await c.env.DB.prepare(`UPDATE orders SET payment_id = ?, payment_status = 'paid', order_status = 'confirmed', updated_at = CURRENT_TIMESTAMP WHERE order_id = ?`).bind(payment_id, order_id).run()
    return c.json({ success: true })
  } catch (e: any) { return c.json({ error: e.message }, 500) }
})

apiRoutes.get('/legal', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT slug, title FROM legal_pages WHERE is_active = 1 ORDER BY sort_order ASC').all()
  return c.json({ pages: results })
})

apiRoutes.get('/legal/:slug', async (c) => {
  const page = await c.env.DB.prepare('SELECT * FROM legal_pages WHERE slug = ? AND is_active = 1').bind(c.req.param('slug')).first()
  if (!page) return c.json({ error: 'Page not found' }, 404)
  return c.json({ page })
})

apiRoutes.get('/settings', async (c) => {
  const { results } = await c.env.DB.prepare("SELECT key, value FROM settings WHERE key IN ('brand_name','brand_tagline','free_shipping_threshold','flat_shipping_fee','instagram_url','contact_email','razorpay_key_id')").all()
  const s: Record<string, string> = {}
  results?.forEach((r: any) => { s[r.key] = r.value })
  return c.json({ settings: s })
})

apiRoutes.post('/admin/login', async (c) => {
  const { password } = await c.req.json()
  const row = await c.env.DB.prepare("SELECT value FROM settings WHERE key = 'admin_password'").first() as any
  if (row && row.value === password) return c.json({ success: true, token: btoa(password + ':' + Date.now()) })
  return c.json({ error: 'Invalid password' }, 401)
})

const adminAuth = (c: any) => { if (!c.req.header('Authorization')) return false; return true; }

apiRoutes.get('/admin/orders', async (c) => {
  if (!adminAuth(c)) return c.json({ error: 'Unauthorized' }, 401)
  const { results } = await c.env.DB.prepare('SELECT * FROM orders ORDER BY created_at DESC').all()
  return c.json({ orders: results })
})

apiRoutes.put('/admin/orders/:id', async (c) => {
  if (!adminAuth(c)) return c.json({ error: 'Unauthorized' }, 401)
  const { order_status } = await c.req.json()
  await c.env.DB.prepare('UPDATE orders SET order_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(order_status, c.req.param('id')).run()
  return c.json({ success: true })
})

apiRoutes.get('/admin/products', async (c) => {
  if (!adminAuth(c)) return c.json({ error: 'Unauthorized' }, 401)
  const { results } = await c.env.DB.prepare('SELECT * FROM products ORDER BY sort_order ASC').all()
  return c.json({ products: results })
})

apiRoutes.put('/admin/products/:id', async (c) => {
  if (!adminAuth(c)) return c.json({ error: 'Unauthorized' }, 401)
  const { name, price, compare_price, images, description, short_description, in_stock } = await c.req.json()
  await c.env.DB.prepare('UPDATE products SET name=?, price=?, compare_price=?, images=?, description=?, short_description=?, in_stock=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(name, price, compare_price || null, JSON.stringify(images), description, short_description || '', in_stock ? 1 : 0, c.req.param('id')).run()
  return c.json({ success: true })
})

apiRoutes.get('/admin/legal', async (c) => {
  if (!adminAuth(c)) return c.json({ error: 'Unauthorized' }, 401)
  const { results } = await c.env.DB.prepare('SELECT * FROM legal_pages ORDER BY sort_order ASC').all()
  return c.json({ pages: results })
})

apiRoutes.put('/admin/legal/:id', async (c) => {
  if (!adminAuth(c)) return c.json({ error: 'Unauthorized' }, 401)
  const { title, content, is_active } = await c.req.json()
  await c.env.DB.prepare('UPDATE legal_pages SET title=?, content=?, is_active=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(title, content, is_active ? 1 : 0, c.req.param('id')).run()
  return c.json({ success: true })
})

apiRoutes.post('/admin/legal', async (c) => {
  if (!adminAuth(c)) return c.json({ error: 'Unauthorized' }, 401)
  const { slug, title, content } = await c.req.json()
  if (!slug || !title || !content) return c.json({ error: 'Missing fields' }, 400)
  const maxOrder = await c.env.DB.prepare('SELECT MAX(sort_order) as m FROM legal_pages').first() as any
  await c.env.DB.prepare('INSERT INTO legal_pages (slug, title, content, is_active, sort_order) VALUES (?, ?, ?, 1, ?)').bind(slug, title, content, (maxOrder?.m || 0) + 1).run()
  return c.json({ success: true })
})

apiRoutes.delete('/admin/legal/:id', async (c) => {
  if (!adminAuth(c)) return c.json({ error: 'Unauthorized' }, 401)
  await c.env.DB.prepare('DELETE FROM legal_pages WHERE id = ?').bind(c.req.param('id')).run()
  return c.json({ success: true })
})

apiRoutes.put('/admin/settings', async (c) => {
  if (!adminAuth(c)) return c.json({ error: 'Unauthorized' }, 401)
  const { settings } = await c.req.json()
  for (const [key, value] of Object.entries(settings)) {
    await c.env.DB.prepare('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)').bind(key, value as string).run()
  }
  return c.json({ success: true })
})

apiRoutes.get('/admin/settings', async (c) => {
  if (!adminAuth(c)) return c.json({ error: 'Unauthorized' }, 401)
  const { results } = await c.env.DB.prepare('SELECT * FROM settings').all()
  const s: Record<string, string> = {}
  results?.forEach((r: any) => { s[r.key] = r.value })
  return c.json({ settings: s })
})
