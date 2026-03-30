import { shell } from '../components/shell'
import { STORE_CONFIG, type Product, type LegalPage } from '../data'

export function productPage(product: Product, opts: {
  razorpayKeyId?: string;
  googleClientId?: string;
  products: Product[];
  legalPages: LegalPage[];
  useMagicCheckout?: boolean;
  maintenanceConfig?: { mode?: string; message?: string; eta?: string };
  storeSettings?: Record<string, string>;
}): string {
  const products = opts.products;
  const legalPages = opts.legalPages;
  const storeSettings = opts.storeSettings || {};
  
  const stockCount = product.stockCount !== undefined ? product.stockCount : null;
  
  function getStockCopy(count: number | null): string {
    if (count === null || count > 10) return 'AVAILABLE FOR DISPATCH';
    if (count >= 4) return `ONLY ${count} LEFT IN THIS DROP`;
    if (count >= 1) return `FINAL ${count} UNITS — NEVER RESTOCKED`;
    return 'DROPPED. GONE.';
  }
  
  const stockCopy = getStockCopy(stockCount);
  const isSoldOut = stockCount === 0 || !product.inStock;
  
  const disc = product.comparePrice ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;
  const related = products.filter(p => p.id !== product.id).slice(0, 3);
  const schema = JSON.stringify({ "@context": "https://schema.org", "@type": "Product", "name": product.name, "description": product.description, "image": product.images, "brand": { "@type": "Brand", "name": "intru.in" }, "offers": { "@type": "Offer", "url": "https://intru.in/product/" + product.slug, "priceCurrency": "INR", "price": product.price, "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" } });
  const pj = JSON.stringify({ id: product.id, s: product.slug, n: product.name, p: product.price, i: product.images, sz: product.sizes });

  const body = `
<style>
/* ====== MINIMALIST PDP [AG] v15.1 ====== */
.pdp{max-width:1300px;margin:0 auto;padding:40px 24px 100px}
.pdpl{display:grid;grid-template-columns:1.2fr 0.8fr;gap:64px;align-items:start}
@media(max-width:960px){.pdpl{grid-template-columns:1fr;gap:32px}}

.gal{position:sticky;top:90px;display:flex;flex-direction:column;gap:12px}
.gitem{aspect-ratio:3.5/4.5;background:var(--g50);overflow:hidden;cursor:zoom-in}
.gitem img{width:100%;height:100%;object-fit:cover;transition:transform .6s var(--eo)}
.gitem:hover img{transform:scale(1.02)}
.g-list{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.g-list .gitem:first-child{grid-column:span 2}

.pinfo{padding-top:8px}
.p-nav{font-size:10px;font-weight:900;letter-spacing:2px;text-transform:uppercase;color:var(--g400);margin-bottom:32px;display:block}
.p-nav a:hover{color:var(--bk)}

.p-header{margin-bottom:32px;border-bottom:1px solid var(--g100);padding-bottom:32px}
.pname{font-family:var(--head);font-size:clamp(32px,5vw,56px);line-height:0.9;text-transform:uppercase;letter-spacing:-.04em;margin-bottom:12px}
.p-price-row{display:flex;align-items:baseline;gap:16px}
.p-price{font-size:28px;font-weight:900;letter-spacing:-1px}
.p-cmp{font-size:16px;color:var(--g300);text-decoration:line-through}
.p-save{font-size:11px;font-weight:900;color:var(--wh);background:var(--bk);padding:4px 12px;text-transform:uppercase}

.p-stock{font-size:10px;font-weight:900;letter-spacing:1.5px;color:var(--g500);margin-top:16px;display:block}
.p-stock.low{color:var(--red)}

.p-dna{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:32px 0;padding:24px 0;border-top:1px solid var(--g100);border-bottom:1px solid var(--g100)}
.dna-it{text-align:center}
.dna-it i{font-size:18px;margin-bottom:12px;display:block;color:var(--g400)}
.dna-it span{font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:var(--g500)}

.p-desc{font-size:14px;line-height:1.8;color:var(--g600);margin-bottom:40px}

/* SELECTOR [AG] */
.sz-wrap{margin-bottom:40px}
.sz-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
.sz-label{font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px}
.sz-guide-btn{font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:var(--g400);background:none;border:none;text-decoration:underline;text-underline-offset:3px}

.sz-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
.sz-btn{aspect-ratio:1;border:1.5px solid var(--g200);background:none;font-size:12px;font-weight:900;transition:all .2s;display:flex;align-items:center;justify-content:center}
.sz-btn:hover:not(:disabled){border-color:var(--bk)}
.sz-btn.sel{background:var(--bk);color:var(--wh);border-color:var(--bk)}
.sz-btn:disabled{opacity:0.2;cursor:not-allowed;text-decoration:line-through}

.p-actions{display:flex;gap:12px;margin-bottom:48px}
.btn-p{flex:1;padding:20px;background:var(--bk);color:var(--wh);border:none;font-size:11px;font-weight:900;letter-spacing:2px;text-transform:uppercase;transition:all .4s var(--eo)}
.btn-p:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.1)}
.btn-s{flex:1;padding:20px;background:var(--wh);color:var(--bk);border:2px solid var(--bk);font-size:11px;font-weight:900;letter-spacing:2px;text-transform:uppercase;transition:all .4s var(--eo)}

.p-meta{font-size:11px;color:var(--g400);line-height:2;margin-top:32px}
.p-meta b{color:var(--bk);text-transform:uppercase;letter-spacing:1px;font-size:10px;margin-right:8px}

.lb{position:fixed;inset:0;z-index:500;background:rgba(12,10,9,0.98);display:none;align-items:center;justify-content:center;cursor:zoom-out}.lb.open{display:flex}
.lb img{max-width:90vw;max-height:90vh;object-fit:contain;animation:scaleIn .4s var(--eo)}

/* MOBILE CAROUSEL [AG] */
.g-mobile{display:none}
@media(max-width:768px){
  .g-list{display:none}
  .g-mobile{display:block;position:relative;margin:0 -24px}
  .g-track{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none}
  .g-track::-webkit-scrollbar{display:none}
  .g-slide{min-width:100%;aspect-ratio:3.5/4.5;scroll-snap-align:start}
  .g-slide img{width:100%;height:100%;object-fit:cover}
}
</style>

<div class="pdp">
  <nav class="p-nav"><a href="/">Home</a> / <a href="/#products">Essentials</a> / ${product.name}</nav>

  <div class="pdpl">
    <div class="gal">
      <div class="g-list">
        ${product.images.map((img, i) => `
          <div class="gitem" onclick="openLB(${i})">
            <img src="${img}" alt="${product.name} - ${i + 1}" loading="${i === 0 ? 'eager' : 'lazy'}">
          </div>
        `).join('')}
      </div>
      <div class="g-mobile">
        <div class="g-track">
          ${product.images.map((img, i) => `<div class="g-slide" onclick="openLB(${i})"><img src="${img}" alt="${product.name} - ${i + 1}"></div>`).join('')}
        </div>
      </div>
    </div>

    <div class="pinfo" id="productInfo">
      <div class="p-header">
        <h1 class="pname">${product.name}</h1>
        <div class="p-price-row">
          <span class="p-price">${STORE_CONFIG.currencySymbol}${product.price.toLocaleString('en-IN')}</span>
          ${product.comparePrice ? `<span class="p-cmp">${STORE_CONFIG.currencySymbol}${product.comparePrice.toLocaleString('en-IN')}</span>` : ''}
          ${disc > 0 ? `<span class="p-save">${disc}% OFF</span>` : ''}
        </div>
        <span class="p-stock ${product.stockCount && product.stockCount <= 5 ? 'low' : ''}">${stockCopy}</span>
      </div>

      <div class="p-dna">
        <div class="dna-it"><i class="fas fa-layer-group"></i><span>240 GSM</span></div>
        <div class="dna-it"><i class="fas fa-compress-arrows-alt"></i><span>Boxy Fit</span></div>
        <div class="dna-it"><i class="fas fa-history"></i><span>Pre-Shrunk</span></div>
      </div>

      <p class="p-desc">${product.description}</p>

      <div class="sz-wrap">
        <div class="sz-header">
          <span class="sz-label">Select Size</span>
          <button class="sz-guide-btn" onclick="openSizeGuide()">Size Chart</button>
        </div>
        <div class="sz-grid" id="szopt">
          ${product.sizes.map(s => {
            const isOos = product.sizeStock && product.sizeStock[s] === 0;
            return `<button class="sz-btn" data-sz="${s}" onclick="selSz(this)" ${isOos ? 'disabled' : ''}>${s}</button>`;
          }).join('')}
        </div>
      </div>

      <div class="p-actions">
        ${!isSoldOut ? `
          <button class="btn-p" onclick="handleATC()">Add to Bag</button>
          <button class="btn-s" onclick="handleBuyNow()">Buy Now</button>
        ` : `
          <button class="btn-p" style="opacity:0.5" disabled>Sold Out</button>
        `}
      </div>

      <div class="p-meta">
        <div><b>Fabric</b> Heavyweight 100% Premium Cotton</div>
        <div><b>Shipping</b> Dispatched within 24–48 hours</div>
        <div><b>Everyday</b> Designed for maximum rotation and longevity.</div>
      </div>
    </div>
  </div>
</div>

<div class="lb" id="lb" onclick="closeLB()">
  <img id="lbi" src="" alt="">
</div>

<script>
var P = ${pj};
var selectedSize = null;

/* Set up Sticky ATC Data [AG] */
window.onload = function() {
  var sn = document.getElementById('sa_name');
  var sp = document.getElementById('sa_price');
  if(sn) sn.textContent = P.n;
  if(sp) sp.textContent = '${STORE_CONFIG.currencySymbol}' + P.p.toLocaleString('en-IN');
};

function selSz(btn){
  document.querySelectorAll('.sz-btn').forEach(function(b){b.classList.remove('sel')});
  btn.classList.add('sel');
  selectedSize = btn.dataset.sz;
}

function handleATC(){
  if(!selectedSize){ toast('Please select a size','err'); return; }
  addToCart(P.id, selectedSize, 1);
}

function handleBuyNow(){
  if(!selectedSize){ toast('Please select a size','err'); return; }
  buyNow(P.id, selectedSize);
}

function openLB(i){
  document.getElementById('lbi').src = P.i[i];
  document.getElementById('lb').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLB(){
  document.getElementById('lb').classList.remove('open');
  document.body.style.overflow = '';
}

function openSizeGuide(){
  // Re-using the same modal logic from shell/home if needed, or simply alert for now
  // In a real app, this would trigger the sgModal in shell.ts
  if(window.openSizeGuideModal) window.openSizeGuideModal(P.c);
  else toast('Size Chart available in footer','ok');
}
</script>
`;

  return shell(
    product.name + ' — INTRU.IN | Everyday Style',
    product.description.substring(0, 160),
    body,
    { og: product.images[0], url: 'https://intru.in/product/' + product.slug, schema, razorpayKeyId: opts.razorpayKeyId, googleClientId: opts.googleClientId, products, legalPages, useMagicCheckout: !!opts.useMagicCheckout, maintenanceConfig: opts.maintenanceConfig, storeSettings: opts.storeSettings }
  );
}
