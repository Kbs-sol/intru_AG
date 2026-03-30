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
:root { --eo: cubic-bezier(0.8, 0, 0.2, 1); }
/* ====== BRUTALIST HERO [AG] ====== */
.hero{min-height:calc(100vh - 72px);display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;background:var(--bk);overflow:hidden;padding:80px 24px;text-align:center}
.hero::before{content:'';position:absolute;inset:0;background:url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop');background-size:cover;background-position:center;opacity:0.2;filter:grayscale(1) contrast(1.2)}
.hero::after{content:'';position:absolute;inset:0;backdrop-filter:url(#grain);opacity:0.4;pointer-events:none}

.hero-wrap{position:relative;z-index:10;width:100%;max-width:1200px}
.hero-over{font-size:12px;font-weight:900;letter-spacing:6px;text-transform:uppercase;color:var(--wh);opacity:0.6;margin-bottom:20px;display:block}
.hero-title{font-family:var(--head);font-size:clamp(48px,12vw,140px);line-height:0.85;font-weight:900;letter-spacing:-.06em;text-transform:uppercase;color:var(--wh);margin:0;display:flex;flex-direction:column}
.h-out{color:transparent;-webkit-text-stroke:1.5px var(--wh);opacity:0.4}
.h-fill{background:linear-gradient(to bottom, #fff 0%, #aaa 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent}

.hero-cta-box{margin-top:40px;display:flex;flex-direction:column;align-items:center;gap:20px}
.hero-cta{display:inline-flex;align-items:center;gap:16px;padding:20px 48px;background:var(--wh);color:var(--bk);font-size:12px;font-weight:900;letter-spacing:3px;text-transform:uppercase;text-decoration:none;transition:all .4s var(--eo);border:none}
.hero-cta:hover{background:var(--g100);transform:scale(1.05);letter-spacing:5px}
.hero-scroll{font-size:10px;font-weight:800;color:var(--wh);opacity:0.4;letter-spacing:2px;text-transform:uppercase;animation:scrollHint 2s infinite}
@keyframes scrollHint{0%,100%{transform:translateY(0)}50%{transform:translateY(10px)}}

/* ====== GRID & QUICK ADD [AG] ====== */
.mq{background:var(--wh);border-bottom:1px solid var(--g100);padding:14px 0}
.mqi{color:var(--bk);font-size:11px;font-weight:800;letter-spacing:1px}

.psec{background:var(--wh);padding:80px 24px}
.shdr{border-bottom:2px solid var(--bk);margin-bottom:48px}
.stitle{font-size:24px;letter-spacing:-1px}

.pgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
@media(max-width:1024px){.pgrid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:640px){.pgrid{grid-template-columns:1fr}}

.pcard{position:relative;text-decoration:none;color:inherit;transition:all .4s var(--eo);display:block}
.pcimg{position:relative;aspect-ratio:4/5;background:var(--g50);overflow:hidden}
.pcimg img{width:100%;height:100%;object-fit:cover;transition:transform 1.2s var(--eo)}
.ih{position:absolute;inset:0;opacity:0;transition:opacity .6s var(--eo)}

.pcard:hover .pcimg img{transform:scale(1.05)}
.pcard:hover .ih{opacity:1}

/* QUICK ADD PANEL [AG] */
.pc-quick{position:absolute;inset:0;top:auto;bottom:0;background:rgba(255,255,255,0.95);backdrop-filter:blur(8px);padding:20px;transform:translateY(100%);transition:transform .4s var(--eo);z-index:20;display:flex;flex-direction:column;gap:12px}
.pcard:hover .pc-quick{transform:translateY(0)}
.pq-title{font-size:9px;font-weight:900;letter-spacing:2px;text-transform:uppercase;color:var(--g400)}
.pq-sizes{display:flex;gap:8px;flex-wrap:wrap}
.pq-sz{flex:1;min-width:40px;padding:10px;border:1px solid var(--g200);background:var(--wh);color:var(--bk);font-size:11px;font-weight:800;text-align:center;cursor:pointer;transition:all .2s}.pq-sz:hover{background:var(--bk);color:var(--wh);border-color:var(--bk)}

.pcinfo{padding:20px 0}
.pcname{font-size:14px;font-weight:900;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px}
.pcprice{display:flex;align-items:center;gap:10px}
.pcprice .cur{font-size:16px;font-weight:900}
.pcprice .cmp{font-size:12px;color:var(--g400);text-decoration:line-through}

/* TRUST PORTAL [AG] */
.tp{background:var(--bk);padding:100px 32px;color:var(--wh);text-align:center}
.tp-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:40px;max-width:1200px;margin:0 auto}
.tp-it{text-align:center}
.tp-it i{font-size:24px;margin-bottom:20px;display:block;opacity:0.8}
.tp-it h4{font-size:12px;font-weight:900;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px}
.tp-it p{font-size:13px;color:rgba(255,255,255,0.5);line-height:1.6}
@media(max-width:768px){.tp-grid{grid-template-columns:repeat(2,1fr)}}

/* FOMO [AG] */
.pc-fomo{position:absolute;top:16px;left:16px;z-index:15}
.badge-fomo{background:var(--bk);color:var(--wh);font-size:10px;font-weight:900;padding:6px 12px;letter-spacing:1px}
.badge-fomo.low{background:var(--red)}

.story{padding:120px 32px;background:var(--wh);text-align:left;display:grid;grid-template-columns:1fr 1.2fr;gap:80px;align-items:center;max-width:1200px;margin:0 auto}
.story-title{font-family:var(--head);font-size:clamp(32px,5vw,56px);line-height:0.95;font-weight:900;text-transform:uppercase;letter-spacing:-.04em}
@media(max-width:768px){.story{grid-template-columns:1fr;padding:80px 24px;gap:32px}}
</style>

<section class="hero">
  <div class="hero-wrap">
    <span class="hero-over anim">Official Collection 2026</span>
    <h1 class="hero-title anim d1">
      <span class="h-out">STRICTLY</span>
      <span class="h-fill">LIMITED</span>
      <span class="h-out">EDITION</span>
    </h1>
    <div class="hero-cta-box anim d2">
      <a href="#products" class="hero-cta">Secure the Drop <i class="fas fa-arrow-down" style="margin-left:8px"></i></a>
      <span class="hero-scroll">Scroll to reveal</span>
    </div>
  </div>
</section>

<div class="mq"><div class="mqt">
${Array(4).fill('<span class="mqi">Zero Restocks</span><span class="mqi">/</span><span class="mqi">Limited Drop</span><span class="mqi">/</span><span class="mqi" style="color:var(--red)">Selling Fast</span><span class="mqi">/</span><span class="mqi">Heavyweight Fabric</span><span class="mqi">/</span>').join('')}
</div></div>

<section class="psec" id="products">
  <div class="shdr"><h2 class="stitle anim">The Current Drop</h2></div>
  <div class="pgrid">
  ${products.map((p, i) => {
    const sizes = p.sizes || ['S', 'M', 'L', 'XL'];
    const totalStock = p.stockCount ? Object.values(p.stockCount).reduce((a: number, b: number) => a + b, 0) : 10;
    
    let fomoHtml = '';
    if (totalStock === 0) fomoHtml = `<div class="badge-fomo sold">SOLD OUT</div>`;
    else if (totalStock <= 5) fomoHtml = `<div class="badge-fomo low">ONLY ${totalStock} LEFT</div>`;

    return `
    <div class="pcard anim d${(i % 3) + 1}">
        <div class="pcimg">
          <div class="pc-fomo">${fomoHtml}</div>
          <a href="/product/${p.slug}" class="pc_link_img">
            <img src="${p.images[0]}" alt="${p.name}" loading="${i < 3 ? 'eager' : 'lazy'}" width="400" height="500">
            ${p.images[1] ? `<img class="ih" src="${p.images[1]}" alt="${p.name}" loading="lazy">` : ''}
          </a>
          
          <div class="pc-quick">
            <div class="pq-title">Quick Add Size</div>
            <div class="pq-sizes">
              ${sizes.map(sz => `<div class="pq-sz" onclick="event.preventDefault();quickAddToCart('${p.id}','${sz}')">${sz}</div>`).join('')}
            </div>
          </div>
        </div>
      <div class="pcinfo">
        <a href="/product/${p.slug}" style="text-decoration:none;color:inherit"><h3 class="pcname">${p.name}</h3></a>
        <div class="pcprice">
          <span class="cur">${STORE_CONFIG.currencySymbol}${p.price.toLocaleString('en-IN')}</span>
          ${p.comparePrice ? `<span class="cmp">${STORE_CONFIG.currencySymbol}${p.comparePrice.toLocaleString('en-IN')}</span>` : ''}
        </div>
      </div>
    </div>`;
  }).join('')}
  </div>
</section>

<section class="tp">
  <div class="tp-grid">
    <div class="tp-it anim"><i class="fas fa-truck-fast"></i><h4>Express Ship</h4><p>Prepaid orders dispatched within 24 hours.</p></div>
    <div class="tp-it anim d1"><i class="fas fa-box-open"></i><h4>Check Order</h4><p>Live tracking link shared on email & WhatsApp.</p></div>
    <div class="tp-it anim d2"><i class="fas fa-shield-halved"></i><h4>Secure Pay</h4><p>Industry-leading protection by Razorpay.</p></div>
    <div class="tp-it anim d3"><i class="fas fa-rotate"></i><h4>Returns</h4><p>Easy 36h exchange for size mismatches.</p></div>
  </div>
</section>

<section class="story">
  <h2 class="story-title anim">Crafted for the Unconventional.</h2>
  <div class="story-cnt">
    <p class="story-txt anim d1">We're done with mass production. Every piece at <strong>INTRU.IN</strong> is a reflection of local alternative culture, tailored for those who refuse to blend in.</p>
    <p class="story-txt anim d2" style="margin-top:24px">Each drop is finalized after months of fabric R&D and fit testing. Once a drop is sold out, we destroy the screens. **Never restocked.**</p>
  </div>
</section>

<section class="igsec">
  <div class="shdr" style="border:none;text-align:center"><h2 class="stitle">OFFICIAL FEED</h2></div>
  <div class="iggrid" id="igHomeGrid">
    ${Array(5).fill('<div class="igit"><img src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&h=600&fit=crop" loading="lazy"></div>').join('')}
  </div>
</section>

<section class="nlsec" id="newsletter">
  <h3>Don't miss the next drop.</h3>
  <p>Our pieces sell out in minutes. Join the priority list.</p>
  <form class="nlform" onsubmit="event.preventDefault();subscribeEmail(this)">
    <input class="nlinp" type="email" placeholder="Email address" required id="nlEmail" style="border-radius:0">
    <button class="nlbtn" type="submit" id="nlBtn">Notify Me</button>
  </form>
</section>

<script>
var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.style.animationPlayState='running';obs.unobserve(e.target)}})},{threshold:.1});
document.querySelectorAll('.anim').forEach(function(el){el.style.animationPlayState='paused';obs.observe(el)});

/* IG Feed Logic */
fetch('/api/instagram-feed').then(function(r){return r.json()}).then(function(d){
  if(d.feed && d.feed.length > 0){
    var grid=document.getElementById('igHomeGrid');
    var h='';
    d.feed.forEach(function(item){h+='<a href="'+(item.link_url||'#')+'" target="_blank" class="igit"><img src="'+item.image_url+'" loading="lazy"></a>'});
    grid.innerHTML=h;
  }
}).catch(function(){});

function subscribeEmail(form){
  var e=document.getElementById('nlEmail').value; if(!e)return;
  var b=document.getElementById('nlBtn'); b.disabled=true; b.textContent='...';
  fetch('/api/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:e})})
  .then(function(r){return r.json()}).then(function(d){
    toast(d.message||d.error||'Thank you!','ok'); form.reset();
  }).finally(function(){b.disabled=false; b.textContent='Notify Me'});
}
</script>
`;

  return shell(
    'Streetwear India — INTRU.IN | Limited Drops & No Restocks',
    'Discover INTRU.IN: India\'s premier destination for limited-edition streetwear. Shop oversized tees, exclusive drops, and premium basics. Free shipping on all prepaid orders.',
    body,
    { url: 'https://intru.in', schema, razorpayKeyId: opts.razorpayKeyId, googleClientId: opts.googleClientId, products, legalPages, useMagicCheckout: !!opts.useMagicCheckout, maintenanceConfig: opts.maintenanceConfig, storeSettings: opts.storeSettings }
  );
}
