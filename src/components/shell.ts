import { STORE_CONFIG, type Product, type LegalPage, SEED_LEGAL_PAGES } from '../data'

/**
 * Shell v6: Unified Checkout + Psychological Nudges + Google Auth Fix
 * - Buy Now & Checkout both open Hybrid Payment Selection UI
 * - Prepaid = bright green nudge "⚡ SAVE ₹99 / FREE SHIPPING"
 * - COD = gray nudge "₹99 Convenience Fee added"
 * - Google One-Tap: data-itp_support=true, data-auto_select=false, redirect fallback
 * - Only one toast per order
 * - Footer: Hyderabad, Telangana, India; all emails shop@intru.in
 */
export function shell(
  title: string,
  desc: string,
  body: string,
  opt?: {
    og?: string; url?: string; schema?: string; cls?: string;
    razorpayKeyId?: string; googleClientId?: string;
    products?: Product[];
    legalPages?: LegalPage[];
    useMagicCheckout?: boolean;
  }
): string {
  const og = opt?.og || 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1200&h=630&fit=crop&q=80';
  const url = opt?.url || 'https://intru.in';
  const rpKey = opt?.razorpayKeyId || STORE_CONFIG.razorpayKeyId;
  const gKey = opt?.googleClientId || STORE_CONFIG.googleClientId;
  const products = opt?.products || [];
  const legalPages = opt?.legalPages || SEED_LEGAL_PAGES;
  const useMagic = opt?.useMagicCheckout || false;

  const pm = JSON.stringify(Object.fromEntries(products.map(p => [p.id, { id: p.id, n: p.name, s: p.slug, p: p.price, i: p.images, sz: p.sizes }])));
  const sj = JSON.stringify({ cs: STORE_CONFIG.currencySymbol, ft: STORE_CONFIG.freeShippingThreshold, sc: STORE_CONFIG.shippingCost, rk: rpKey, magic: useMagic });

  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${title}</title><meta name="description" content="${desc}">
<meta name="robots" content="index,follow"><link rel="canonical" href="${url}">
<meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="${desc}"><meta property="og:image" content="${og}"><meta property="og:url" content="${url}"><meta property="og:site_name" content="intru.in">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${desc}"><meta name="twitter:image" content="${og}">
${opt?.schema ? '<script type="application/ld+json">' + opt.schema + '</script>' : ''}
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Archivo+Black&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css">
<script src="https://checkout.razorpay.com/v1/magic-checkout.js"></script>
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{--bk:#0a0a0a;--wh:#fafafa;--g50:#f5f5f5;--g100:#e8e8e8;--g200:#d4d4d4;--g300:#a3a3a3;--g400:#737373;--g500:#525252;--g600:#404040;--red:#e53e3e;--green:#16a34a;--sans:'Space Grotesk',sans-serif;--head:'Archivo Black','Space Grotesk',sans-serif;--ease:cubic-bezier(.25,.46,.45,.94);--eo:cubic-bezier(.16,1,.3,1)}
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
body{font-family:var(--sans);color:var(--bk);background:var(--wh);line-height:1.6;overflow-x:hidden}
a{color:inherit;text-decoration:none}img{display:block;max-width:100%;height:auto}button{cursor:pointer;font-family:inherit}
@keyframes fadeIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
.anim{animation:fadeIn .6s var(--ease) forwards;opacity:0}
.d1{animation-delay:.1s}.d2{animation-delay:.2s}.d3{animation-delay:.3s}.d4{animation-delay:.4s}
.nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(250,250,250,.88);backdrop-filter:blur(20px) saturate(180%);border-bottom:1px solid var(--g100);transition:all .3s}
.nav.scrolled{background:rgba(250,250,250,.96);box-shadow:0 1px 24px rgba(0,0,0,.06)}
.navi{max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:0 24px;height:64px}
.logo{font-family:var(--head);font-size:20px;letter-spacing:-.03em;text-transform:uppercase}.logo span{font-family:var(--sans);font-weight:400;opacity:.4;text-transform:none;font-size:16px}
.nlinks{display:flex;align-items:center;gap:24px}
.nl{font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--g500);transition:color .2s;position:relative}
.nl:hover{color:var(--bk)}.nl::after{content:'';position:absolute;bottom:-4px;left:0;width:0;height:1.5px;background:var(--bk);transition:width .3s var(--ease)}.nl:hover::after{width:100%}
.ncart{position:relative;background:none;border:none;font-size:18px;color:var(--bk);padding:8px}
.cbadge{position:absolute;top:0;right:0;background:var(--bk);color:var(--wh);font-size:9px;font-weight:700;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;transform:scale(0);transition:transform .3s var(--eo)}.cbadge.vis{transform:scale(1)}
.covl{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.5);backdrop-filter:blur(4px);opacity:0;pointer-events:none;transition:opacity .3s}.covl.open{opacity:1;pointer-events:all}
.cdrw{position:fixed;top:0;right:0;bottom:0;z-index:201;width:420px;max-width:92vw;background:var(--wh);transform:translateX(100%);transition:transform .4s var(--eo);display:flex;flex-direction:column;box-shadow:-10px 0 40px rgba(0,0,0,.12)}.cdrw.open{transform:translateX(0)}
.chdr{display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid var(--g100)}
.chdr h3{font-family:var(--head);font-size:14px;letter-spacing:2px;text-transform:uppercase}
.ccls{background:none;border:none;font-size:20px;color:var(--g400);padding:4px}.ccls:hover{color:var(--bk)}
.cbdy{flex:1;overflow-y:auto;padding:16px 24px}
.cemp{text-align:center;padding:60px 0;color:var(--g400)}.cemp i{font-size:40px;margin-bottom:16px;display:block}
.citm{display:flex;gap:16px;padding:16px 0;border-bottom:1px solid var(--g100)}
.cimg{width:76px;height:95px;object-fit:cover;border-radius:6px;background:var(--g50)}
.cinf{flex:1}.cnm{font-size:13px;font-weight:700;margin-bottom:2px;text-transform:uppercase;letter-spacing:.5px}.cmt{font-size:11px;color:var(--g400);margin-bottom:6px}.cpr{font-size:14px;font-weight:700}
.cqty{display:flex;align-items:center;gap:10px;margin-top:6px}
.qb{width:26px;height:26px;border:1px solid var(--g200);background:none;border-radius:3px;font-size:13px;display:flex;align-items:center;justify-content:center;transition:all .2s}.qb:hover{background:var(--bk);color:var(--wh);border-color:var(--bk)}
.crm{background:none;border:none;color:var(--g300);font-size:11px;margin-top:4px;padding:0;transition:color .2s;text-transform:uppercase;letter-spacing:.5px}.crm:hover{color:var(--red)}
.cftr{padding:20px 24px;border-top:1px solid var(--g100);background:var(--g50)}
.cst{display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px}
.csh{display:flex;justify-content:space-between;font-size:11px;color:var(--g400);margin-bottom:12px}
.ctl{display:flex;justify-content:space-between;font-size:18px;font-weight:700;padding-top:12px;border-top:1px solid var(--g200)}
/* Checkout mode selector */
.cmode{display:flex;gap:8px;margin-bottom:14px}
.cmode-opt{flex:1;padding:10px;border:2px solid var(--g200);border-radius:6px;cursor:pointer;text-align:center;transition:all .2s;position:relative}
.cmode-opt.act{border-color:var(--bk)}
.cmode-opt.prepaid.act{border-color:var(--green)}
.cmode-badge{display:inline-block;font-size:9px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;padding:2px 8px;border-radius:3px;margin-bottom:4px}
.cmode-opt.prepaid .cmode-badge{background:#dcfce7;color:#166534}
.cmode-opt.cod .cmode-badge{background:var(--g100);color:var(--g500)}
.cmode-label{font-size:12px;font-weight:700;display:block}
.cmode-price{font-size:11px;color:var(--g400);margin-top:2px}
.ccbtn{width:100%;margin-top:16px;padding:16px;background:var(--bk);color:var(--wh);border:none;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;transition:all .3s}.ccbtn:hover{background:var(--g600);transform:translateY(-1px)}.ccbtn:disabled{background:var(--g300);cursor:not-allowed;transform:none}
.cpolicy{font-size:10px;color:var(--g400);text-align:center;margin-top:12px;line-height:1.5}
.cpolicy a{text-decoration:underline}
/* Silent Identity Overlay */
.id-ovl{position:fixed;inset:0;z-index:500;background:rgba(0,0,0,.7);backdrop-filter:blur(6px);display:none;align-items:center;justify-content:center;padding:24px}
.id-ovl.open{display:flex}
.id-box{background:var(--wh);max-width:440px;width:100%;padding:36px;position:relative;animation:scaleIn .3s var(--eo)}
.id-box h3{font-family:var(--head);font-size:20px;text-transform:uppercase;letter-spacing:-.02em;margin-bottom:6px}
.id-box p{font-size:13px;color:var(--g400);margin-bottom:20px;line-height:1.6}
.id-inp{width:100%;padding:14px 16px;border:1.5px solid var(--g200);font-size:14px;font-family:inherit;outline:none;margin-bottom:10px;transition:border-color .2s}.id-inp:focus{border-color:var(--bk)}
.id-btn{width:100%;padding:16px;background:var(--bk);color:var(--wh);border:none;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;transition:all .2s;margin-top:6px}.id-btn:hover{background:var(--g600)}.id-btn:disabled{background:var(--g300)}
.id-or{text-align:center;font-size:11px;color:var(--g400);margin:14px 0;letter-spacing:1px;text-transform:uppercase}
.id-gcta{width:100%;padding:14px;background:var(--wh);border:1.5px solid var(--g200);font-size:12px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:10px;transition:all .2s;border-radius:0}.id-gcta:hover{border-color:var(--bk)}
.id-gcta img{width:18px;height:18px}
.id-close{position:absolute;top:16px;right:16px;background:none;border:none;font-size:20px;color:var(--g400);padding:4px;cursor:pointer}.id-close:hover{color:var(--bk)}
/* COD Address Form (inline in cart footer) */
.cod-form{display:none;margin-top:12px}
.cod-form.show{display:block}
.cod-form input{width:100%;padding:12px 14px;border:1.5px solid var(--g200);font-size:13px;font-family:inherit;outline:none;margin-bottom:8px;transition:border-color .2s}.cod-form input:focus{border-color:var(--bk)}
.cod-row{display:flex;gap:8px}
.cod-row input{flex:1}
.ftr{background:var(--bk);color:var(--wh);padding:64px 24px 32px}
.ftri{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px}
.ftrb h3{font-family:var(--head);font-size:20px;margin-bottom:12px;letter-spacing:-.02em;text-transform:uppercase}.ftrb p{color:var(--g300);font-size:13px;line-height:1.7;max-width:300px}
.ftrc h4{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2.5px;margin-bottom:16px;color:var(--g300)}
.ftrc a{display:block;color:var(--g400);font-size:13px;padding:4px 0;transition:color .2s}.ftrc a:hover{color:var(--wh)}
.ftrbt{max-width:1280px;margin:48px auto 0;padding-top:24px;border-top:1px solid rgba(255,255,255,.1);display:flex;justify-content:space-between;align-items:center;font-size:11px;color:var(--g400)}
.fsoc{display:flex;gap:16px}.fsoc a{color:var(--g400);font-size:18px;transition:color .2s}.fsoc a:hover{color:var(--wh)}
.tc{position:fixed;bottom:24px;right:24px;z-index:300;display:flex;flex-direction:column;gap:8px}
.toast{padding:12px 20px;border-radius:6px;font-size:12px;font-weight:600;animation:slideUp .3s var(--eo);box-shadow:0 4px 20px rgba(0,0,0,.3);letter-spacing:.5px}
.toast-ok{background:var(--bk);color:var(--wh)}
.toast-err{background:var(--red);color:#fff}
.toast-ok-green{background:#065f46;color:#fff}
.sz-error{animation:shake .3s ease;border-color:var(--red) !important}
@media(max-width:768px){.nlinks .nl:not(.nls){display:none}.ftri{grid-template-columns:1fr 1fr;gap:32px}.ftrbt{flex-direction:column;gap:16px;text-align:center}}
@media(max-width:480px){.ftri{grid-template-columns:1fr}}
</style></head>
<body class="${opt?.cls || ''}">
<nav class="nav" id="nb"><div class="navi">
<a href="/" class="logo"><svg viewBox="0 0 110 32" width="110" height="32" xmlns="http://www.w3.org/2000/svg" aria-label="intru.in"><text x="0" y="25" font-family="'Archivo Black',sans-serif" font-size="28" font-weight="900" fill="#0a0a0a" letter-spacing="-1">INTRU</text><text x="88" y="25" font-family="'Space Grotesk',sans-serif" font-size="16" font-weight="400" fill="#0a0a0a" opacity=".4">.in</text></svg></a>
<div class="nlinks">
<a href="/#products" class="nl nls">Shop</a>
<a href="/collections" class="nl">Collections</a>
<a href="/about" class="nl">About</a>
<button class="ncart" onclick="toggleCart()" aria-label="Cart"><i class="fas fa-shopping-bag"></i><span class="cbadge" id="cb">0</span></button>
</div></div></nav>
<div class="covl" id="co" onclick="toggleCart()"></div>
<div class="cdrw" id="cd">
<div class="chdr"><h3>Your Bag</h3><button class="ccls" onclick="toggleCart()"><i class="fas fa-times"></i></button></div>
<div class="cbdy" id="cby"><div class="cemp"><i class="fas fa-shopping-bag"></i><p>Your bag is empty</p></div></div>
<div class="cftr" id="cf" style="display:none">
<div class="cst"><span>Subtotal</span><span id="csub">${STORE_CONFIG.currencySymbol}0</span></div>
<div class="csh"><span>Shipping</span><span id="cshp">Calculated</span></div>
<div class="ctl"><span>Total</span><span id="ctot">${STORE_CONFIG.currencySymbol}0</span></div>
<!-- Payment Mode Selector (only when NOT magic checkout) -->
<div class="cmode" id="cmode" style="display:none;margin-top:14px">
<div class="cmode-opt prepaid act" onclick="setPayMode('prepaid')" id="cm_prepaid">
<span class="cmode-badge" style="background:#dcfce7;color:#166534">&#9889; SAVE Rs.99 / FREE SHIPPING</span>
<span class="cmode-label">Prepaid</span>
<span class="cmode-price" style="color:var(--green);font-weight:700">FREE Shipping</span>
</div>
<div class="cmode-opt cod" onclick="setPayMode('cod')" id="cm_cod">
<span class="cmode-badge" style="background:var(--g100);color:var(--g500)">Rs.99 Convenience Fee added</span>
<span class="cmode-label">Cash on Delivery</span>
<span class="cmode-price">+Rs.99 COD fee</span>
</div>
</div>
<!-- COD Address Form -->
<div class="cod-form" id="codForm">
<input class="cod-inp" id="cod_name" type="text" placeholder="Full Name *" required>
<input class="cod-inp" id="cod_phone" type="tel" placeholder="Phone Number *" required pattern="[0-9]{10}">
<input class="cod-inp" id="cod_pincode" type="text" placeholder="Pincode *" required pattern="[0-9]{6}">
<input class="cod-inp" id="cod_addr" type="text" placeholder="Full Address (House, Street, Area) *" required>
<div class="cod-row">
<input class="cod-inp" id="cod_city" type="text" placeholder="City">
<input class="cod-inp" id="cod_state" type="text" placeholder="State">
</div>
</div>
<button class="ccbtn" id="checkoutBtn" onclick="checkout()">Checkout</button>
<p class="cpolicy">By placing an order, you agree to the intru.in <a href="/p/terms">Terms of Service</a> and our <a href="/p/returns">Store-Credit-only Refund Policy</a>.</p>
</div></div>

<!-- Silent Identity Overlay -->
<div class="id-ovl" id="idOvl" onclick="if(event.target===this)closeIdentify()">
<div class="id-box">
<button class="id-close" onclick="closeIdentify()"><i class="fas fa-times"></i></button>
<h3>Identify Yourself</h3>
<p>Enter your email to continue checkout. We'll never spam you.</p>
<input class="id-inp" id="id_email" type="email" placeholder="your@email.com" autocomplete="email">
<button class="id-btn" id="idBtn" onclick="submitIdentity()">Continue to Checkout</button>
<div class="id-or">or</div>
<button class="id-gcta" id="idGoogleBtn" onclick="triggerGoogleIdentify()">
<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G">
Continue with Google
</button>
<p style="font-size:10px;color:var(--g400);text-align:center;margin-top:14px;line-height:1.5">No account needed. We just need your email for order updates.<br>Support: <a href="mailto:shop@intru.in" style="text-decoration:underline">shop@intru.in</a></p>
</div>
</div>

<main style="padding-top:64px">${body}</main>
<footer class="ftr" id="contact"><div class="ftri">
<div class="ftrb"><h3>INTRU.IN</h3><p>${STORE_CONFIG.description}</p>
<p style="margin-top:16px;font-size:11px;color:var(--g400);line-height:1.7"><strong style="color:var(--g300)">Registered Office:</strong><br>Hyderabad, Telangana, India</p>
<p style="margin-top:8px;font-size:11px;color:var(--g400);line-height:1.7"><strong style="color:var(--g300)">Grievance Officer:</strong><br><a href="mailto:shop@intru.in" style="color:var(--g300)">shop@intru.in</a><br><span style="font-size:10px">Per Consumer Protection (E-Commerce) Rules, 2020</span></p>
</div>
<div class="ftrc"><h4>Shop</h4><a href="/#products">All Drops</a><a href="/collections">Collections</a><a href="/about">About</a></div>
<div class="ftrc"><h4>Help</h4><a href="/p/shipping">Shipping</a><a href="/p/returns">Returns &amp; Credit</a><a href="mailto:shop@intru.in">Contact</a></div>
<div class="ftrc"><h4>Legal</h4>${legalPages.map(p => '<a href="/p/' + p.slug + '">' + p.title + '</a>').join('')}</div>
</div><div class="ftrbt"><span>&copy; 2026 intru.in &mdash; All sales final. Store credit only.</span>
<div class="fsoc"><a href="https://instagram.com/${STORE_CONFIG.instagram}" target="_blank" rel="noopener"><i class="fab fa-instagram"></i></a></div>
</div></footer>
<div class="tc" id="tc"></div>
${gKey !== 'YOUR_GOOGLE_CLIENT_ID' ? '<script src="https://accounts.google.com/gsi/client" async defer></script><div id="g_id_onload" data-client_id="' + gKey + '" data-context="signin" data-ux_mode="popup" data-callback="handleGoogleAuth" data-itp_support="true" data-auto_select="false" data-auto_prompt="false"></div>' : '<!-- Google One-Tap: Set GOOGLE_CLIENT_ID env var to enable -->'}
<script>
/* ====== CONFIG ====== */
var S=${sj};
var PM=${pm};
var payMode='prepaid';
var identifiedEmail=localStorage.getItem('intru_user_email')||'';
var identifiedName=localStorage.getItem('intru_user_name')||'';
var pendingCheckout=false;
var orderToastFired=false;

/* ====== RESTORE SESSION AFTER GOOGLE REDIRECT ====== */
(function(){
  /* Check if we just came back from a Google redirect auth */
  if(sessionStorage.getItem('intru_auth_success')==='1'){
    sessionStorage.removeItem('intru_auth_success');
    var u=localStorage.getItem('intru_user');
    if(u){try{var user=JSON.parse(u);identifiedEmail=user.email||'';identifiedName=user.name||'';toast('Welcome, '+(user.name||user.email)+'!','ok-green');}catch(e){}}
    /* Restore cart from backup if needed */
    var bk=sessionStorage.getItem('intru_cart_backup');
    if(bk){try{var bc=JSON.parse(bk);if(bc&&bc.length){cart=bc;saveCart()}}catch(e){}sessionStorage.removeItem('intru_cart_backup');}
    /* Resume checkout if it was pending */
    if(sessionStorage.getItem('intru_pending_checkout')==='1'){
      sessionStorage.removeItem('intru_pending_checkout');
      setTimeout(function(){if(identifiedEmail){openCartDrawer();setTimeout(function(){checkout()},500)}},600);
    }
  }
})();

/* ====== GOOGLE AUTH (Silent Identity) ====== */
function handleGoogleAuth(r){
  if(!r.credential)return;
  fetch('/api/auth/google',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({credential:r.credential})})
  .then(function(res){return res.json()})
  .then(function(d){
    if(d.success&&d.user){
      identifiedEmail=d.user.email||'';
      identifiedName=d.user.name||'';
      localStorage.setItem('intru_user',JSON.stringify(d.user));
      localStorage.setItem('intru_user_email',identifiedEmail);
      localStorage.setItem('intru_user_name',identifiedName);
      toast('Welcome, '+(d.user.name||d.user.email)+'!','ok-green');
      closeIdentify();
      if(pendingCheckout){pendingCheckout=false;checkout();}
    }else{toast(d.error||'Auth failed','err')}
  }).catch(function(){toast('Auth failed','err')});
}

/* Process Google auth token (used by redirect callback page) */
function processGoogleToken(idToken){
  fetch('/api/auth/google',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({credential:idToken})})
  .then(function(res){return res.json()})
  .then(function(d){
    if(d.success&&d.user){
      localStorage.setItem('intru_user',JSON.stringify(d.user));
      localStorage.setItem('intru_user_email',d.user.email||'');
      localStorage.setItem('intru_user_name',d.user.name||'');
      /* Signal the homepage to resume after redirect */
      sessionStorage.setItem('intru_auth_success','1');
      window.location.href='/';
    }else{
      document.body.innerHTML='<div style="text-align:center;padding:60px;font-family:sans-serif"><h2 style="color:#e53e3e">Authentication Failed</h2><p>'+(d.error||'Unknown error')+'</p><a href="/" style="color:#0a0a0a;font-weight:700">Back to Store</a></div>';
    }
  }).catch(function(e){
    document.body.innerHTML='<div style="text-align:center;padding:60px;font-family:sans-serif"><h2 style="color:#e53e3e">Auth Error</h2><p>'+e.message+'</p><a href="/" style="color:#0a0a0a;font-weight:700">Back to Store</a></div>';
  });
}

function triggerGoogleIdentify(){
  if(typeof google!=='undefined'&&google.accounts&&google.accounts.id){
    google.accounts.id.prompt(function(n){
      if(n.isNotDisplayed()||n.isSkippedMoment()){
        /* Fallback: redirect-based Google sign-in */
        doGoogleRedirect();
      }
    });
  }else{
    doGoogleRedirect();
  }
}

function doGoogleRedirect(){
  var gcid=document.querySelector('#g_id_onload');
  var clientId=gcid?gcid.getAttribute('data-client_id'):'';
  if(!clientId||clientId==='YOUR_GOOGLE_CLIENT_ID'){toast('Google sign-in not configured. Use email.','err');return}
  /* Save checkout intent so it survives the redirect */
  if(pendingCheckout)sessionStorage.setItem('intru_pending_checkout','1');
  sessionStorage.setItem('intru_cart_backup',JSON.stringify(cart));
  var redirect=encodeURIComponent(window.location.origin+'/auth/google/callback');
  window.location.href='https://accounts.google.com/o/oauth2/v2/auth?client_id='+clientId+'&redirect_uri='+redirect+'&response_type=id_token&scope=openid%20email%20profile&prompt=select_account&nonce='+Date.now();
}

/* ====== SILENT IDENTITY OVERLAY ====== */
function openIdentify(){document.getElementById('idOvl').classList.add('open');document.body.style.overflow='hidden';document.getElementById('id_email').focus()}
function closeIdentify(){document.getElementById('idOvl').classList.remove('open');document.body.style.overflow=''}

function submitIdentity(){
  var email=document.getElementById('id_email').value.trim();
  if(!email||!email.includes('@')){toast('Please enter a valid email','err');return}
  var btn=document.getElementById('idBtn');
  btn.disabled=true;btn.textContent='IDENTIFYING...';
  /* Silently upsert user in backend */
  fetch('/api/auth/identify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email})})
  .then(function(r){return r.json()})
  .then(function(d){
    if(d.success){
      identifiedEmail=email;
      localStorage.setItem('intru_user_email',email);
      if(d.name){identifiedName=d.name;localStorage.setItem('intru_user_name',d.name)}
      toast('Welcome! Continuing checkout...','ok-green');
      closeIdentify();
      if(pendingCheckout){pendingCheckout=false;checkout();}
    }else{toast(d.error||'Failed','err')}
  }).catch(function(e){toast('Error: '+e.message,'err')})
  .finally(function(){btn.disabled=false;btn.textContent='CONTINUE TO CHECKOUT'});
}

/* ====== CART ENGINE ====== */
var cart=JSON.parse(localStorage.getItem('ic')||'[]');

function saveCart(){localStorage.setItem('ic',JSON.stringify(cart));renderCart()}

function addToCart(productId,size,qty){
  if(!productId||!size){toast('Please select a size','err');return false}
  var p=PM[productId];if(!p){toast('Product not found','err');return false}
  if(p.sz&&p.sz.indexOf(size)===-1){toast('Invalid size selected','err');return false}
  qty=qty||1;
  var existing=cart.find(function(i){return i.p===productId&&i.s===size});
  if(existing){if(existing.q+qty>10){toast('Max 10 per item','err');return false}existing.q+=qty}
  else{cart.push({p:productId,s:size,q:qty})}
  saveCart();toast(p.n+' ('+size+') added to bag','ok');openCartDrawer();return true;
}

function removeFromCart(productId,size){cart=cart.filter(function(i){return!(i.p===productId&&i.s===size)});saveCart()}

function updateQty(productId,size,delta){
  var item=cart.find(function(i){return i.p===productId&&i.s===size});if(!item)return;
  item.q+=delta;if(item.q<=0){removeFromCart(productId,size);return}
  if(item.q>10){item.q=10;toast('Max 10 per item','err')}saveCart();
}

function getCartTotals(){
  var sub=0;cart.forEach(function(i){var p=PM[i.p];if(p)sub+=p.p*i.q});
  var codFee=payMode==='cod'?99:0;
  var sh=payMode==='prepaid'?0:(sub>=S.ft?0:S.sc);
  /* Prepaid always free shipping; COD adds Rs.99 convenience fee */
  if(payMode==='prepaid')sh=0;
  return{subtotal:sub,shipping:sh,codFee:codFee,total:sub+sh+codFee};
}

function fmt(n){return S.cs+n.toLocaleString('en-IN')}

function setPayMode(mode){
  payMode=mode;
  document.getElementById('cm_prepaid').classList.toggle('act',mode==='prepaid');
  document.getElementById('cm_cod').classList.toggle('act',mode==='cod');
  document.getElementById('codForm').classList.toggle('show',mode==='cod');
  renderCartTotals();
}

function renderCartTotals(){
  var t=getCartTotals();
  document.getElementById('csub').textContent=fmt(t.subtotal);
  var shText=payMode==='prepaid'?'FREE':'';
  if(payMode==='cod'){shText=t.shipping>0?fmt(t.shipping):'Free';shText+=(' + Rs.99 COD fee')}
  document.getElementById('cshp').textContent=shText||'Free';
  document.getElementById('ctot').textContent=fmt(t.total);
}

function renderCart(){
  var badge=document.getElementById('cb');var body=document.getElementById('cby');var footer=document.getElementById('cf');
  var count=cart.reduce(function(a,i){return a+i.q},0);
  badge.textContent=count;badge.classList.toggle('vis',count>0);
  if(!cart.length){body.innerHTML='<div class="cemp"><i class="fas fa-shopping-bag"></i><p>Your bag is empty</p></div>';footer.style.display='none';return}
  footer.style.display='block';
  /* Show payment mode selector only if NOT magic checkout */
  document.getElementById('cmode').style.display=S.magic?'none':'flex';
  if(S.magic){document.getElementById('codForm').classList.remove('show')}
  var html='';
  cart.forEach(function(item){
    var p=PM[item.p];if(!p)return;
    html+='<div class="citm"><img class="cimg" src="'+p.i[0]+'" alt="'+p.n+'"><div class="cinf"><div class="cnm">'+p.n+'</div><div class="cmt">Size: '+item.s+'</div><div class="cpr">'+fmt(p.p*item.q)+'</div><div class="cqty"><button class="qb" onclick="updateQty(\\x27'+p.id+'\\x27,\\x27'+item.s+'\\x27,-1)">&minus;</button><span>'+item.q+'</span><button class="qb" onclick="updateQty(\\x27'+p.id+'\\x27,\\x27'+item.s+'\\x27,1)">+</button></div><button class="crm" onclick="removeFromCart(\\x27'+p.id+'\\x27,\\x27'+item.s+'\\x27)">Remove</button></div></div>';
  });
  body.innerHTML=html;
  renderCartTotals();
}

/* ====== CART DRAWER ====== */
function toggleCart(){document.getElementById('co').classList.toggle('open');document.getElementById('cd').classList.toggle('open');document.body.style.overflow=document.getElementById('cd').classList.contains('open')?'hidden':''}
function openCartDrawer(){document.getElementById('co').classList.add('open');document.getElementById('cd').classList.add('open');document.body.style.overflow='hidden'}

/* ====== BUY NOW (unified: adds to temp cart + opens drawer with payment selection) ====== */
function buyNow(productId,size){
  if(!size){toast('Please select a size first','err');return}
  var p=PM[productId];if(!p){toast('Product not found','err');return}
  /* Replace cart with single item and open drawer (shows payment selection UI) */
  cart=[{p:productId,s:size,q:1}];saveCart();openCartDrawer();
}

/* ====== CHECKOUT ====== */
function checkout(){
  if(!cart.length){toast('Your bag is empty','err');return}
  /* Silent Identity: if not identified, show overlay */
  if(!identifiedEmail){pendingCheckout=true;openIdentify();return}
  var btn=document.getElementById('checkoutBtn');
  if(btn){btn.disabled=true;btn.textContent='CREATING ORDER...';}
  orderToastFired=false;

  /* If Magic Checkout is ON, always use Razorpay Magic flow */
  if(S.magic){doMagicCheckout();return}

  /* Custom dual-mode checkout */
  if(payMode==='prepaid'){doPrepaidCheckout()}
  else{
    /* Ensure COD form is visible and make sure user fills it */
    if(!document.getElementById('codForm').classList.contains('show')){
      setPayMode('cod');
      toast('Please fill in your delivery address for COD','err');
      resetBtn();
      return;
    }
    doCodCheckout()
  }
}

function doPrepaidCheckout(){
  var t=getCartTotals();
  fetch('/api/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
    items:cart.map(function(i){return{productId:i.p,size:i.s,quantity:i.q}}),
    userEmail:identifiedEmail,userName:identifiedName,
    paymentMethod:'prepaid'
  })})
  .then(function(r){return r.json()})
  .then(function(data){
    if(data.error){throw new Error(data.error)}
    if(!data.razorpayOrderId){toast('Order: '+fmt(data.total)+'. Configure Razorpay.','err');resetBtn();return}
    if(typeof Razorpay==='undefined'){toast('Payment SDK failed. Refresh.','err');resetBtn();return}
    var options={key:S.rk,order_id:data.razorpayOrderId,name:'intru.in',
      prefill:{email:identifiedEmail,contact:localStorage.getItem('intru_user_phone')||''},
      theme:{color:'#0a0a0a',backdrop_color:'rgba(0,0,0,0.6)'},
      modal:{ondismiss:function(){resetBtn();toast('Payment cancelled','err')}},
      handler:function(response){
        var btn=document.getElementById('checkoutBtn');if(btn)btn.textContent='VERIFYING...';
        fetch('/api/payment/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
          razorpay_order_id:response.razorpay_order_id,razorpay_payment_id:response.razorpay_payment_id,razorpay_signature:response.razorpay_signature
        })}).then(function(r){return r.json()}).then(function(vd){
          if(vd.success){cart=[];saveCart();toggleCart();if(!orderToastFired){orderToastFired=true;toast('Drop secured! Order: '+(vd.orderId||'').slice(-8).toUpperCase()+'. Check email.','ok-green')}}
          else{toast('Verification failed: '+(vd.error||''),'err')}
        }).catch(function(e){toast('Error: '+e.message,'err')}).finally(function(){resetBtn()});
      }
    };
    var rzp=new Razorpay(options);
    rzp.on('payment.failed',function(r){toast('Payment failed: '+(r.error&&r.error.description||''),'err');resetBtn()});
    rzp.open();
  }).catch(function(e){toast('Error: '+e.message,'err');resetBtn()});
}

function doCodCheckout(){
  var name=document.getElementById('cod_name').value.trim();
  var phone=document.getElementById('cod_phone').value.trim();
  var pincode=document.getElementById('cod_pincode').value.trim();
  var addr=document.getElementById('cod_addr').value.trim();
  if(!name||!phone||!pincode||!addr){toast('Fill all address fields for COD','err');resetBtn();return}
  if(!/^[0-9]{10}$/.test(phone)){toast('Enter valid 10-digit phone','err');resetBtn();return}
  if(!/^[0-9]{6}$/.test(pincode)){toast('Enter valid 6-digit pincode','err');resetBtn();return}
  var city=document.getElementById('cod_city').value.trim();
  var state=document.getElementById('cod_state').value.trim();

  fetch('/api/checkout/cod',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
    items:cart.map(function(i){return{productId:i.p,size:i.s,quantity:i.q}}),
    userEmail:identifiedEmail,userName:name,userPhone:phone,
    address:{name:name,phone:phone,pincode:pincode,line1:addr,city:city,state:state,country:'India'}
  })})
  .then(function(r){return r.json()})
  .then(function(d){
    if(d.success){cart=[];saveCart();toggleCart();if(!orderToastFired){orderToastFired=true;toast('COD order placed! Order: '+(d.orderId||'').slice(-8).toUpperCase()+'. Check email.','ok-green')}}
    else{toast(d.error||'COD failed','err')}
  }).catch(function(e){toast('Error: '+e.message,'err')})
  .finally(function(){resetBtn()});
}

function doMagicCheckout(){
  fetch('/api/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
    items:cart.map(function(i){return{productId:i.p,size:i.s,quantity:i.q}}),
    userEmail:identifiedEmail,userName:identifiedName,paymentMethod:'magic'
  })})
  .then(function(r){return r.json()})
  .then(function(data){
    if(data.error){throw new Error(data.error)}
    if(!data.razorpayOrderId){toast('Configure Razorpay keys','err');resetBtn();return}
    if(typeof Razorpay==='undefined'){toast('Payment SDK failed. Refresh.','err');resetBtn();return}
    var options={key:S.rk,one_click_checkout:true,order_id:data.razorpayOrderId,name:'intru.in',show_coupons:false,
      prefill:{email:identifiedEmail,contact:localStorage.getItem('intru_user_phone')||''},
      theme:{color:'#0a0a0a',backdrop_color:'rgba(0,0,0,0.6)'},
      modal:{ondismiss:function(){resetBtn();toast('Checkout cancelled','err')}},
      handler:function(response){
        var btn=document.getElementById('checkoutBtn');if(btn)btn.textContent='VERIFYING...';
        fetch('/api/payment/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
          razorpay_order_id:response.razorpay_order_id,razorpay_payment_id:response.razorpay_payment_id,razorpay_signature:response.razorpay_signature
        })}).then(function(r){return r.json()}).then(function(vd){
          if(vd.success){cart=[];saveCart();toggleCart();if(!orderToastFired){orderToastFired=true;toast('Drop secured!','ok-green')}}
          else{toast('Verification failed','err')}
        }).catch(function(e){toast('Error: '+e.message,'err')}).finally(function(){resetBtn()});
      }
    };
    var rzp=new Razorpay(options);
    rzp.on('payment.failed',function(r){toast('Payment failed','err');resetBtn()});
    rzp.open();
  }).catch(function(e){toast('Error: '+e.message,'err');resetBtn()});
}

function resetBtn(){var btn=document.getElementById('checkoutBtn');if(btn){btn.disabled=false;btn.textContent='CHECKOUT'}}

/* ====== TOAST ====== */
function toast(msg,type){
  type=type||'ok';var c=document.getElementById('tc');var t=document.createElement('div');
  t.className='toast toast-'+(type==='err'?'err':type==='ok-green'?'ok-green':'ok');t.textContent=msg;c.appendChild(t);
  setTimeout(function(){t.style.opacity='0';t.style.transform='translateY(10px)';t.style.transition='all .3s';setTimeout(function(){t.remove()},300)},3500);
}

/* ====== NAV SCROLL ====== */
window.addEventListener('scroll',function(){document.getElementById('nb').classList.toggle('scrolled',window.scrollY>20)});

/* ====== INIT ====== */
renderCart();
/* If user is identified, update UI to reflect it */
if(identifiedEmail){
  var idBtn=document.getElementById('idBtn');
  if(idBtn)idBtn.textContent='CONTINUE AS '+identifiedEmail.split('@')[0].toUpperCase();
}

/* ====== KONAMI CODE -> /admin ====== */
var _kseq=[38,38,40,40,37,39,37,39,66,65],_kidx=0;
document.addEventListener('keydown',function(e){if(e.keyCode===_kseq[_kidx]){_kidx++;if(_kidx===_kseq.length){_kidx=0;window.location.href='/admin'}}else{_kidx=0}});
</script></body></html>`;
}
