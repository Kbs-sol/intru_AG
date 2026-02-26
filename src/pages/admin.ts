import { renderShell } from '../components/shell'
import { PRODUCTS, LEGAL_PAGES, STORE_CONFIG } from '../data'

export function renderAdminPage(): string {
  const productsHtml = PRODUCTS.map(p => `
<div style="border:1px solid var(--gray-100);border-radius:12px;padding:24px;margin-bottom:16px">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
    <span style="font-size:16px;font-weight:600">${p.name}</span>
    <span style="font-size:11px;font-weight:600;padding:4px 12px;border-radius:20px;background:${p.inStock?'#f0fdf4':'var(--gray-50)'};color:${p.inStock?'#16a34a':'var(--gray-500)'}">${p.inStock?'In Stock':'Out of Stock'}</span>
  </div>
  <div style="display:grid;grid-template-columns:80px 1fr;gap:16px;align-items:start">
    <img src="${p.images[0]}" alt="${p.name}" style="width:80px;height:100px;object-fit:cover;border-radius:8px">
    <div style="display:grid;gap:8px">
      <div style="display:grid;grid-template-columns:120px 1fr;gap:8px;align-items:center">
        <span style="font-size:12px;font-weight:600;color:var(--gray-400);text-transform:uppercase">Price (₹)</span>
        <input type="number" value="${p.price}" style="width:100%;padding:8px 12px;border:1px solid var(--gray-200);font-size:13px;border-radius:4px;outline:none">
      </div>
      <div style="display:grid;grid-template-columns:120px 1fr;gap:8px;align-items:center">
        <span style="font-size:12px;font-weight:600;color:var(--gray-400);text-transform:uppercase">Compare Price</span>
        <input type="number" value="${p.comparePrice||''}" placeholder="Leave empty if none" style="width:100%;padding:8px 12px;border:1px solid var(--gray-200);font-size:13px;border-radius:4px;outline:none">
      </div>
      ${p.images.map((img,i)=>`
      <div style="display:grid;grid-template-columns:120px 1fr;gap:8px;align-items:center">
        <span style="font-size:12px;font-weight:600;color:var(--gray-400);text-transform:uppercase">Image ${i+1} URL</span>
        <input type="url" value="${img}" style="width:100%;padding:8px 12px;border:1px solid var(--gray-200);font-size:13px;border-radius:4px;outline:none">
      </div>`).join('')}
    </div>
  </div>
  <button onclick="showToast('Saved! Connect Supabase for persistence.')" style="margin-top:12px;padding:10px 20px;background:var(--black);color:var(--white);border:none;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;border-radius:4px;cursor:pointer"><i class="fas fa-save" style="margin-right:6px"></i>Save</button>
</div>`).join('');

  const legalHtml = LEGAL_PAGES.map(p => `
<div style="border:1px solid var(--gray-100);border-radius:12px;padding:24px;margin-bottom:16px">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
    <span style="font-size:16px;font-weight:600">${p.title}</span>
    <span style="font-size:11px;color:var(--gray-400)">Updated: ${p.updatedAt}</span>
  </div>
  <textarea style="width:100%;min-height:200px;padding:16px;border:1px solid var(--gray-200);border-radius:8px;font-size:14px;font-family:inherit;line-height:1.7;resize:vertical;outline:none">${p.content.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</textarea>
  <div style="margin-top:12px">
    <button onclick="showToast('Saved! Connect Supabase for persistence.')" style="padding:10px 20px;background:var(--black);color:var(--white);border:none;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;border-radius:4px;cursor:pointer"><i class="fas fa-save" style="margin-right:6px"></i>Save</button>
    <a href="/legal/${p.slug}" target="_blank" style="font-size:12px;color:var(--gray-400);margin-left:12px;text-decoration:underline">Preview</a>
  </div>
</div>`).join('');

  const body = `
<style>
.admin-gate{max-width:400px;margin:100px auto;padding:0 24px;text-align:center}
.admin-gate h1{font-family:var(--font-serif);font-size:28px;margin-bottom:8px}
.admin-gate p{color:var(--gray-400);font-size:14px;margin-bottom:32px}
.admin-input{width:100%;padding:14px 16px;border:1.5px solid var(--gray-200);font-size:14px;font-family:inherit;margin-bottom:16px;outline:none;text-align:center;letter-spacing:4px}
.admin-input:focus{border-color:var(--black)}
.admin-submit{width:100%;padding:16px;background:var(--black);color:var(--white);border:none;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;cursor:pointer}
.admin-submit:hover{background:var(--gray-600)}
.admin-error{color:#e53e3e;font-size:13px;margin-top:12px;display:none}
.admin-dashboard{display:none;max-width:1280px;margin:0 auto;padding:40px 24px 80px}
.admin-dashboard.visible{display:block}
.admin-tabs{display:flex;gap:0;border-bottom:1px solid var(--gray-200);margin-bottom:32px;overflow-x:auto}
.admin-tab{padding:12px 24px;background:none;border:none;font-size:13px;font-weight:500;color:var(--gray-400);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;white-space:nowrap}
.admin-tab.active{color:var(--black);border-bottom-color:var(--black);font-weight:600}
.admin-tab:hover{color:var(--black)}
.admin-panel{display:none}.admin-panel.active{display:block}
.admin-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px}
.admin-stat{border:1px solid var(--gray-100);border-radius:12px;padding:20px;text-align:center}
.admin-stat-value{font-size:28px;font-weight:700;margin-bottom:4px}
.admin-stat-label{font-size:12px;color:var(--gray-400);text-transform:uppercase;letter-spacing:1px}
@media(max-width:768px){.admin-stats{grid-template-columns:repeat(2,1fr)}}
</style>

<div class="admin-gate" id="adminGate">
  <h1>Admin Access</h1>
  <p>Enter the admin password to continue</p>
  <form onsubmit="event.preventDefault();verifyAdmin()">
    <input class="admin-input" type="password" id="adminPassword" placeholder="Password" autofocus>
    <button class="admin-submit" type="submit">Access Dashboard</button>
  </form>
  <p class="admin-error" id="adminError">Invalid password. Try again.</p>
</div>

<div class="admin-dashboard" id="adminDashboard">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:40px">
    <h1 style="font-family:var(--font-serif);font-size:28px">Dashboard</h1>
    <button onclick="sessionStorage.removeItem('intru_admin');location.reload()" style="padding:10px 20px;border:1px solid var(--gray-200);background:none;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;cursor:pointer">Logout</button>
  </div>
  <div class="admin-stats">
    <div class="admin-stat"><div class="admin-stat-value">6</div><div class="admin-stat-label">Products</div></div>
    <div class="admin-stat"><div class="admin-stat-value">0</div><div class="admin-stat-label">Orders</div></div>
    <div class="admin-stat"><div class="admin-stat-value">${STORE_CONFIG.currencySymbol}0</div><div class="admin-stat-label">Revenue</div></div>
    <div class="admin-stat"><div class="admin-stat-value">4</div><div class="admin-stat-label">Legal Pages</div></div>
  </div>
  <div class="admin-tabs">
    <button class="admin-tab active" onclick="switchTab('orders',this)">Orders</button>
    <button class="admin-tab" onclick="switchTab('products',this)">Products</button>
    <button class="admin-tab" onclick="switchTab('legal',this)">Legal Pages</button>
  </div>
  <div class="admin-panel active" id="panel-orders">
    <div style="text-align:center;padding:60px;color:var(--gray-400);border:1px solid var(--gray-100);border-radius:12px">
      <i class="fas fa-inbox" style="font-size:48px;margin-bottom:16px;display:block"></i>
      <p style="font-size:15px;margin-bottom:8px">No orders yet</p>
      <p style="font-size:13px">Orders will appear here when customers complete checkout via Razorpay.</p>
      <p style="font-size:12px;margin-top:16px;color:var(--gray-300)">Connect Supabase to enable persistent order storage.</p>
    </div>
  </div>
  <div class="admin-panel" id="panel-products">${productsHtml}</div>
  <div class="admin-panel" id="panel-legal">
    ${legalHtml}
    <div style="border:1px dashed var(--gray-200);border-radius:12px;text-align:center;padding:40px">
      <i class="fas fa-plus" style="font-size:24px;color:var(--gray-300);margin-bottom:12px;display:block"></i>
      <p style="font-size:14px;color:var(--gray-400)">Add New Legal Page</p>
      <p style="font-size:12px;color:var(--gray-300)">Connect Supabase to add custom pages dynamically.</p>
    </div>
  </div>
</div>

<script>
function verifyAdmin(){var pw=document.getElementById('adminPassword').value;fetch('/api/admin/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:pw})}).then(function(r){return r.json()}).then(function(d){if(d.success){sessionStorage.setItem('intru_admin','true');showDashboard()}else{document.getElementById('adminError').style.display='block'}}).catch(function(){document.getElementById('adminError').style.display='block'})}
function showDashboard(){document.getElementById('adminGate').style.display='none';document.getElementById('adminDashboard').classList.add('visible')}
if(sessionStorage.getItem('intru_admin')==='true')showDashboard();
function switchTab(tab,btn){document.querySelectorAll('.admin-tab').forEach(function(t){t.classList.remove('active')});document.querySelectorAll('.admin-panel').forEach(function(p){p.classList.remove('active')});btn.classList.add('active');document.getElementById('panel-'+tab).classList.add('active')}
</script>`;

  return renderShell('Admin — intru.in', 'Admin dashboard for intru.in store management.', body, { bodyClass: 'admin-page' });
}
