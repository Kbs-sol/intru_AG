import { shell } from '../components/shell'
import { STORE_CONFIG, type Product, type LegalPage } from '../data'

export function homePage(opts: {
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

  const schema = JSON.stringify({ "@context": "https://schema.org", "@type": "ItemList", "itemListElement": products.map((p, i) => ({ "@type": "ListItem", "position": i + 1, "item": { "@type": "Product", "name": p.name, "url": "https://intru.in/product/" + p.slug, "image": p.images, "offers": { "@type": "Offer", "price": p.price, "priceCurrency": "INR", "availability": "https://schema.org/InStock" } } })) });

  const body = `
<svg style="display:none"><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope="0.1"/><feFuncG type="linear" slope="0.1"/><feFuncB type="linear" slope="0.1"/></feComponentTransfer><feComposite operator="in" in2="SourceGraphic"/></filter></svg>

<style>
/* ====== MINIMALISM & EVERYDAY STYLE [AG] v15.1 ====== */
.hero{min-height:calc(100vh - 72px);display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;background:var(--wh);overflow:hidden;padding:80px 24px;text-align:center;border-bottom:1px solid var(--g100)}
.hero::after{content:'';position:absolute;inset:0;backdrop-filter:url(#grain);opacity:0.3;pointer-events:none}

.hero-wrap{position:relative;z-index:10;width:100%;max-width:1200px}
.hero-over{font-size:10px;font-weight:900;letter-spacing:4px;text-transform:uppercase;color:var(--g500);margin-bottom:24px;display:block}
.hero-title{font-family:var(--head);font-size:clamp(40px,10vw,110px);line-height:0.9;font-weight:900;letter-spacing:-.05em;text-transform:uppercase;color:var(--bk);margin:0}
.hero-sub{font-size:16px;font-weight:500;color:var(--g400);margin-top:24px;max-width:500px;margin-left:auto;margin-right:auto;line-height:1.4}

.hero-cta-box{margin-top:48px;display:flex;flex-direction:column;align-items:center;gap:24px}
.hero-cta{display:inline-flex;align-items:center;padding:18px 40px;background:var(--bk);color:var(--wh);font-size:11px;font-weight:900;letter-spacing:2px;text-transform:uppercase;text-decoration:none;transition:all .4s var(--eo);border:none}
.hero-cta:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,0,0,0.15)}

.mq{background:var(--bk);color:var(--wh);padding:10px 0}
.mqi{font-size:9px;font-weight:900;letter-spacing:2px;text-transform:uppercase;opacity:0.7}

.psec{background:var(--wh);padding:100px 32px}
.shdr{margin-bottom:60px;display:flex;justify-content:space-between;align-items:flex-end;border-bottom:1px solid var(--g100);padding-bottom:20px}
.stitle{font-size:22px;letter-spacing:-0.5px;font-weight:900;text-transform:uppercase}
.view-all{font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:var(--g400)}

.pgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:32px}
@media(max-width:1024px){.pgrid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:640px){.pgrid{grid-template-columns:1fr}}

.pcard{position:relative;text-decoration:none;color:inherit;transition:all .4s var(--eo)}
.pcimg{position:relative;aspect-ratio:3.5/4.5;background:var(--g50);overflow:hidden}
.pcimg img{width:100%;height:100%;object-fit:cover;transition:transform 1.2s var(--eo)}
.ih{position:absolute;inset:0;opacity:0;transition:opacity .6s var(--eo)}

.pcard:hover .pcimg img{transform:scale(1.04)}
.pcard:hover .ih{opacity:1}

/* QUICK ADD MINIMALIST [AG] */
.pc-quick{position:absolute;inset:0;top:auto;bottom:0;background:rgba(255,255,255,0.98);padding:24px;transform:translateY(100%);transition:transform .4s var(--eo);z-index:20;display:flex;flex-direction:column;gap:12px}
.pcard:hover .pc-quick{transform:translateY(0)}
.pq-title{font-size:9px;font-weight:900;letter-spacing:1px;text-transform:uppercase;color:var(--g400)}
.pq-sizes{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.pq-sz{padding:10px;border:1px solid var(--g100);background:var(--wh);color:var(--bk);font-size:10px;font-weight:700;text-align:center;cursor:pointer;transition:all .2s}.pq-sz:hover{background:var(--bk);color:var(--wh);border-color:var(--bk)}

.pcinfo{padding:20px 4px}
.pcname{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px}
.pcprice{display:flex;align-items:center;gap:10px}
.pcprice .cur{font-size:15px;font-weight:900}
.pcprice .cmp{font-size:12px;color:var(--g300);text-decoration:line-through}

/* DNA SECTION [AG] */
.dna{background:var(--g50);padding:100px 32px;display:grid;grid-template-columns:repeat(3,1fr);gap:40px;max-width:1200px;margin:0 auto;border:1px solid var(--g100)}
.dna-it{text-align:left}
.dna-it i{font-size:20px;color:var(--bk);margin-bottom:20px;display:block}
.dna-it h4{font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px}
.dna-it p{font-size:13px;color:var(--g500);line-height:1.6}
@media(max-width:768px){.dna{grid-template-columns:1fr;padding:60px 24px}}

.promo{height:60vh;display:flex;align-items:center;justify-content:center;background:var(--bk);color:var(--wh);text-align:center;position:relative;margin-top:80px}
.promo-title{font-family:var(--head);font-size:clamp(32px,6vw,80px);font-weight:900;text-transform:uppercase;letter-spacing:-.04em}
</style>

<section class="hero">
  <div class="hero-wrap">
    <span class="hero-over anim">Minimalist Drop 01 // 2026</span>
    <h1 class="hero-title anim d1">BUILT FROM SCRATCH WITH A<br>SHARED LOVE FOR MINIMALISM<br>& EVERYDAY STYLE.</h1>
    <p class="hero-sub anim d2">Premium fabrics meeting alternative silhouettes. No branding, no noise, just the collective's energy in every thread.</p>
    <div class="hero-cta-box anim d3">
      <a href="#products" class="hero-cta">Explore the Essentials</a>
    </div>
  </div>
</section>

<div class="mq"><div class="mqt">
${Array(4).fill('<span class="mqi">Everyday Uniform</span><span class="mqi">/</span><span class="mqi">Premium Cotton</span><span class="mqi">/</span><span class="mqi">Limited Run</span><span class="mqi">/</span><span class="mqi">Fast Shipping</span><span class="mqi">/</span>').join('')}
</div></div>

<section class="psec" id="products">
  <div class="shdr">
    <h2 class="stitle anim">The Essentials</h2>
    <a href="/collections" class="view-all anim d1">View All Drops</a>
  </div>
  <div class="pgrid">
  ${products.map((p, i) => {
    const sizes = p.sizes || ['S', 'M', 'L', 'XL'];
    const totalStock = p.stockCount ? Object.values(p.stockCount).reduce((a: number, b: number) => a + b, 0) : 10;
    
    let fomoHtml = '';
    if (totalStock === 0) fomoHtml = `<div class="badge-fomo sold">SOLD OUT</div>`;
    else if (totalStock <= 5) fomoHtml = `<div class="badge-fomo low">LOW STOCK</div>`;

    return `
    <div class="pcard anim d${(i % 3) + 1}">
      <div class="pcimg">
        <a href="/product/${p.slug}">
          <img src="${p.images[0]}" alt="${p.name}" loading="${i < 3 ? 'eager' : 'lazy'}">
          ${p.images[1] ? `<img class="ih" src="${p.images[1]}" alt="${p.name}" loading="lazy">` : ''}
        </a>
        <div class="pc-fomo">${fomoHtml}</div>
        <div class="pc-quick">
          <div class="pq-title">Quick Select Size</div>
          <div class="pq-sizes">
            ${sizes.map(sz => `<div class="pq-sz" onclick="event.preventDefault();quickAddToCart('${p.id}','${sz}')">${sz}</div>`).join('')}
          </div>
        </div>
      </div>
      <div class="pcinfo">
        <h3 class="pcname">${p.name}</h3>
        <div class="pcprice">
          <span class="cur">${STORE_CONFIG.currencySymbol}${p.price.toLocaleString('en-IN')}</span>
          ${p.comparePrice ? `<span class="cmp">${STORE_CONFIG.currencySymbol}${p.comparePrice.toLocaleString('en-IN')}</span>` : ''}
        </div>
      </div>
    </div>`;
  }).join('')}
  </div>
</section>

<section class="dna">
  <div class="dna-it anim"><i class="fas fa-microchip"></i><h4>Tech Fabric</h4><p>Custom-developed cotton-poly blends designed for breathability and shape retention.</p></div>
  <div class="dna-it anim d1"><i class="fas fa-scissors"></i><h4>Boxy Fit</h4><p>Meticulously tailored silhouettes that provide comfort without sacrificing style.</p></div>
  <div class="dna-it anim d2"><i class="fas fa-leaf"></i><h4>Sustainability</h4><p>Ethically sourced materials and zero-plastic packaging for every drop.</p></div>
</section>

<section class="promo anim">
  <div class="hero-wrap">
    <h2 class="promo-title">LESS NOISE.<br>MORE INTRU.</h2>
    <a href="#newsletter" class="hero-cta" style="margin-top:32px;background:var(--wh);color:var(--bk)">Get Notified</a>
  </div>
</section>

<section class="nlsec" id="newsletter">
  <h3>The Newsletter.</h3>
  <p>Join the inner circle for early access and collection updates.</p>
  <form class="nlform" onsubmit="event.preventDefault();subscribeEmail(this)">
    <input class="nlinp" type="email" placeholder="Email" required id="nlEmail">
    <button class="nlbtn" type="submit" id="nlBtn">Join</button>
  </form>
</section>

<script>
var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.style.animationPlayState='running';obs.unobserve(e.target)}})},{threshold:.1});
document.querySelectorAll('.anim').forEach(function(el){el.style.animationPlayState='paused';obs.observe(el)});

function subscribeEmail(form){
  var e=document.getElementById('nlEmail').value; if(!e)return;
  var b=document.getElementById('nlBtn'); b.disabled=true; b.textContent='...';
  fetch('/api/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:e})})
  .then(function(r){return r.json()}).then(function(d){
    toast(d.message||d.error||'Thank you!','ok'); form.reset();
  }).finally(function(){b.disabled=false; b.textContent='Join'});
}
</script>
`;

  return shell(
    'Streetwear India — INTRU.IN | Minimalism & Everyday Style',
    'Discover INTRU.IN: Functional minimalism for everyday style. Shop premium streetwear essentials, limited-edition drops, and engineered silhouettes. Free shipping on all prepaid orders.',
    body,
    { url: 'https://intru.in', schema, razorpayKeyId: opts.razorpayKeyId, googleClientId: opts.googleClientId, products, legalPages, useMagicCheckout: !!opts.useMagicCheckout, maintenanceConfig: opts.maintenanceConfig, storeSettings: opts.storeSettings }
  );
}
