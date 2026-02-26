import { Hono } from 'hono'
import { htmlHead } from '../layout'

type Bindings = { DB: D1Database }

export const adminRoutes = new Hono<{ Bindings: Bindings }>()

adminRoutes.get('/', (c) => {
  const html = `${htmlHead('Admin \u2014 intru.in', 'Admin panel for intru.in')}
<body class="admin-body">
  <div id="adminLoginScreen" class="admin-login-screen">
    <div class="admin-login-card">
      <h1>intru.in</h1>
      <p>Admin Panel</p>
      <form onsubmit="event.preventDefault(); adminLogin()">
        <input type="password" id="adminPassword" placeholder="Enter admin password" required autocomplete="current-password">
        <button type="submit" class="btn-primary">Sign In</button>
      </form>
      <p id="loginError" class="error-text" style="display:none;"></p>
    </div>
  </div>

  <div id="adminDashboard" class="admin-dashboard" style="display:none;">
    <aside class="admin-sidebar">
      <div class="admin-sidebar-header"><h2>intru.in</h2><span>Admin</span></div>
      <nav class="admin-nav">
        <a href="#" class="admin-nav-item active" onclick="showTab('orders')"><i class="fas fa-shopping-cart"></i> Orders</a>
        <a href="#" class="admin-nav-item" onclick="showTab('products')"><i class="fas fa-box"></i> Products</a>
        <a href="#" class="admin-nav-item" onclick="showTab('legal')"><i class="fas fa-file-alt"></i> Legal Pages</a>
        <a href="#" class="admin-nav-item" onclick="showTab('settings')"><i class="fas fa-cog"></i> Settings</a>
      </nav>
      <div class="admin-sidebar-footer">
        <a href="/" target="_blank"><i class="fas fa-external-link-alt"></i> View Store</a>
        <button onclick="adminLogout()"><i class="fas fa-sign-out-alt"></i> Logout</button>
      </div>
    </aside>

    <main class="admin-main">
      <div class="admin-tab active" id="tab-orders">
        <div class="admin-tab-header"><h2>Orders</h2><span class="admin-badge" id="ordersCount">0</span></div>
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody id="ordersBody"></tbody>
          </table>
        </div>
        <p id="ordersEmpty" class="admin-empty" style="display:none;">No orders yet.</p>
      </div>

      <div class="admin-tab" id="tab-products" style="display:none;">
        <div class="admin-tab-header"><h2>Products</h2></div>
        <div id="productsList"></div>
      </div>

      <div class="admin-tab" id="tab-legal" style="display:none;">
        <div class="admin-tab-header"><h2>Legal Pages</h2><button class="btn-primary btn-sm" onclick="showNewLegalForm()"><i class="fas fa-plus"></i> Add Page</button></div>
        <div id="newLegalForm" style="display:none;" class="admin-form-card">
          <h3>New Legal Page</h3>
          <div class="form-group"><label>Slug</label><input type="text" id="newLegalSlug" placeholder="e.g., cookie-policy"></div>
          <div class="form-group"><label>Title</label><input type="text" id="newLegalTitle" placeholder="e.g., Cookie Policy"></div>
          <div class="form-group"><label>Content (HTML)</label><textarea id="newLegalContent" rows="8" placeholder="<h2>Section</h2><p>Content...</p>"></textarea></div>
          <div class="form-actions">
            <button class="btn-primary btn-sm" onclick="createLegalPage()">Create Page</button>
            <button class="btn-outline btn-sm" onclick="document.getElementById('newLegalForm').style.display='none'">Cancel</button>
          </div>
        </div>
        <div id="legalList"></div>
      </div>

      <div class="admin-tab" id="tab-settings" style="display:none;">
        <div class="admin-tab-header"><h2>Settings</h2></div>
        <div class="admin-form-card">
          <div class="form-group"><label>Admin Password</label><input type="text" id="settAdminPassword"></div>
          <div class="form-group"><label>Razorpay Key ID</label><input type="text" id="settRazorpayKeyId" placeholder="rzp_live_xxxxx"></div>
          <div class="form-group"><label>Razorpay Key Secret</label><input type="password" id="settRazorpayKeySecret" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"></div>
          <div class="form-group"><label>Brand Name</label><input type="text" id="settBrandName"></div>
          <div class="form-group"><label>Brand Tagline</label><input type="text" id="settBrandTagline"></div>
          <div class="form-group"><label>Free Shipping Threshold (\u20B9)</label><input type="number" id="settFreeShipping"></div>
          <div class="form-group"><label>Flat Shipping Fee (\u20B9)</label><input type="number" id="settShippingFee"></div>
          <div class="form-group"><label>Instagram URL</label><input type="url" id="settInstagram"></div>
          <div class="form-group"><label>Contact Email</label><input type="email" id="settContactEmail"></div>
          <button class="btn-primary" onclick="saveSettings()"><i class="fas fa-save"></i> Save Settings</button>
        </div>
      </div>
    </main>
  </div>

  <div class="admin-toast" id="adminToast"></div>
  <script src="/static/admin.js"></script>
</body>
</html>`
  return c.html(html)
})
