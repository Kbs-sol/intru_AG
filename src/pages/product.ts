import { shell } from '../components/shell'
import { STORE_CONFIG, PRODUCTS, type Product } from '../data'

export function productPage(product: Product): string {
  const disc = product.comparePrice ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;
  const related = PRODUCTS.filter(p => p.id !== product.id).slice(0, 3);
  const schema = JSON.stringify({"@context":"https://schema.org","@type":"Product","name":product.name,"description":product.description,"image":product.images,"brand":{"@type":"Brand","name":"intru.in"},"offers":{"@type":"Offer","url":"https://intru.in/product/"+product.slug,"priceCurrency":"INR","price":product.price,"availability":product.inStock?"https://schema.org/InStock":"https://schema.org/OutOfStock"},"aggregateRating":{"@type":"AggregateRating","ratingValue":"4.8","reviewCount":"47"}});
  const pj = JSON.stringify({id:product.id,s:product.slug,n:product.name,p:product.price,i:product.images,sz:product.sizes});

  const body = `<style>
.pdp{max-width:1280px;margin:0 auto;padding:40px 24px 80px}
.bc{display:flex;align-items:center;gap:8px;font-size:11px;color:var(--g400);margin-bottom:28px;font-weight:500;letter-spacing:.5px;text-transform:uppercase}
.bc a:hover{color:var(--bk)}
.pdpl{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:start}
.gal{position:sticky;top:80px}
/* Desktop: 2x2 grid with hero */
.ggrid{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.gitem{aspect-ratio:3/4;overflow:hidden;border-radius:6px;background:var(--g50);cursor:zoom-in;position:relative}
.gitem img{width:100%;height:100%;object-fit:cover;transition:transform .4s var(--ease)}.gitem:hover img{transform:scale(1.04)}
.gitem:first-child{grid-column:span 2;aspect-ratio:4/5}
/* Mobile: swipe carousel with all 4 images */
.gcar{display:none;position:relative;overflow:hidden;border-radius:8px;background:var(--g50)}
.gtrack{display:flex;transition:transform .4s var(--eo);touch-action:pan-y}
.gslide{min-width:100%;aspect-ratio:3/4}
.gslide img{width:100%;height:100%;object-fit:cover}
.gdots{display:flex;justify-content:center;gap:6px;padding:14px 0}
.gdot{width:8px;height:8px;border-radius:50%;background:var(--g200);border:none;padding:0;transition:all .3s}
.gdot.act{background:var(--bk);width:24px;border-radius:4px}
.gnav{position:absolute;top:50%;transform:translateY(-50%);width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.9);border:none;font-size:13px;color:var(--bk);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(0,0,0,.1);z-index:2;transition:all .2s}.gnav:hover{box-shadow:0 4px 16px rgba(0,0,0,.15)}
.gnav.prv{left:10px}.gnav.nxt{right:10px}
/* Lightbox */
.lb{position:fixed;inset:0;z-index:500;background:rgba(0,0,0,.96);display:none;align-items:center;justify-content:center;cursor:zoom-out}.lb.open{display:flex}
.lb img{max-width:90vw;max-height:90vh;object-fit:contain;animation:scaleIn .3s var(--eo)}
.lbcls{position:absolute;top:20px;right:20px;background:none;border:none;color:#fff;font-size:28px;cursor:pointer;padding:8px}
.lbnav{position:absolute;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.12);border:none;color:#fff;width:48px;height:48px;border-radius:50%;font-size:18px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .2s}.lbnav:hover{background:rgba(255,255,255,.25)}
.lbnav.prv{left:20px}.lbnav.nxt{right:20px}
.lbcnt{position:absolute;bottom:20px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,.5);font-size:12px;font-weight:600;letter-spacing:1px}
/* Product Info */
.pinfo{padding:8px 0}
.pcat{font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--g400);margin-bottom:8px}
.pname{font-family:var(--head);font-size:clamp(24px,3.5vw,36px);text-transform:uppercase;letter-spacing:-.03em;margin-bottom:6px}
.ptag{font-size:14px;color:var(--g400);margin-bottom:16px}
.prating{display:flex;align-items:center;gap:8px;margin-bottom:16px;font-size:12px}
.pstars{color:#f59e0b}
.prtext{color:var(--g400)}
.pprow{display:flex;align-items:baseline;gap:12px;margin-bottom:20px}
.pprice{font-size:32px;font-weight:700;letter-spacing:-.5px}
.pcmp{font-size:16px;color:var(--g300);text-decoration:line-through}
.psave{font-size:11px;font-weight:700;color:#16a34a;background:#f0fdf4;padding:3px 10px;border-radius:3px}
/* 36h badge */
.dispatch-badge{display:inline-flex;align-items:center;gap:8px;background:var(--g50);border:1px solid var(--g100);border-radius:6px;padding:10px 16px;margin-bottom:20px;font-size:12px;font-weight:600}
.dispatch-badge i{font-size:16px;color:var(--bk)}
.pdiv{border:none;border-top:1px solid var(--g100);margin:20px 0}
.pdesc{font-size:13px;color:var(--g500);line-height:1.8;margin-bottom:24px}
.plbl{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;display:block;color:var(--g500)}
.szopt{display:flex;gap:6px;margin-bottom:20px;flex-wrap:wrap}
.szbtn{min-width:46px;height:46px;border:1.5px solid var(--g200);background:none;border-radius:4px;font-size:12px;font-weight:700;transition:all .2s;display:flex;align-items:center;justify-content:center;padding:0 14px;letter-spacing:.5px}
.szbtn:hover{border-color:var(--bk)}.szbtn.sel{background:var(--bk);color:var(--wh);border-color:var(--bk)}
.pactions{display:flex;gap:10px;margin-bottom:16px}
.atc-btn{flex:1;padding:17px 24px;background:var(--bk);color:var(--wh);border:none;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;transition:all .3s var(--ease)}.atc-btn:hover{background:var(--g600);transform:translateY(-1px)}
.bn-btn{flex:1;padding:17px 24px;background:var(--wh);color:var(--bk);border:2px solid var(--bk);font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;transition:all .3s var(--ease)}.bn-btn:hover{background:var(--bk);color:var(--wh)}
.wl-btn{width:50px;height:50px;border:1.5px solid var(--g200);background:none;border-radius:4px;font-size:16px;transition:all .2s;display:flex;align-items:center;justify-content:center}.wl-btn:hover{border-color:var(--bk)}.wl-btn.act{color:#e53e3e;border-color:#e53e3e}
/* Store credit tooltip */
.sc-info{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--g400);margin-bottom:24px;padding:10px 14px;background:var(--g50);border-radius:6px;line-height:1.5}
.sc-info .tip{position:relative;cursor:help}
.sc-info .tip .tiptext{visibility:hidden;width:260px;background:var(--bk);color:var(--wh);padding:12px 16px;border-radius:6px;font-size:11px;line-height:1.6;position:absolute;bottom:130%;left:50%;transform:translateX(-50%);z-index:10;box-shadow:0 4px 20px rgba(0,0,0,.3);pointer-events:none;opacity:0;transition:opacity .2s}
.sc-info .tip:hover .tiptext{visibility:visible;opacity:1}
.pshipping{display:flex;gap:20px;margin-bottom:28px;font-size:11px;color:var(--g400);font-weight:500}
.pshipping i{margin-right:4px}
/* Accordion */
.pdets{margin-top:24px}
.ditm{border-top:1px solid var(--g100)}
.dtog{width:100%;display:flex;justify-content:space-between;align-items:center;padding:14px 0;background:none;border:none;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--bk)}
.dtog i{transition:transform .3s;font-size:11px}.dtog.opn i{transform:rotate(180deg)}
.dcnt{max-height:0;overflow:hidden;transition:max-height .3s var(--ease)}.dcnt.opn{max-height:300px}
.dcnti{padding:0 0 14px;font-size:12px;color:var(--g500);line-height:1.8}
/* Related */
.relsec{padding:80px 24px;max-width:1280px;margin:0 auto}
.relgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:40px}
@media(max-width:900px){.pdpl{grid-template-columns:1fr;gap:28px}.gal{position:static}.ggrid{display:none}.gcar{display:block}.relgrid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){.relgrid{grid-template-columns:1fr;max-width:380px;margin:40px auto 0}.pactions{flex-direction:column}}
</style>

<div class="pdp">
<nav class="bc"><a href="/">Home</a><span>/</span><a href="/#products">Shop</a><span>/</span><span style="color:var(--bk)">${product.name}</span></nav>
<div class="pdpl">
<div class="gal">
<div class="ggrid">
${product.images.map((img,i)=>'<div class="gitem" onclick="openLB('+i+')"><img src="'+img+'" alt="intru.in '+product.name+' - View '+(i+1)+'" loading="'+(i===0?'eager':'lazy')+'" width="600" height="800"></div>').join('')}
</div>
<div class="gcar" id="car">
<div class="gtrack" id="gtrk">
${product.images.map((img,i)=>'<div class="gslide"><img src="'+img+'" alt="intru.in '+product.name+' - View '+(i+1)+'" loading="'+(i===0?'eager':'lazy')+'" width="600" height="800"></div>').join('')}
</div>
<button class="gnav prv" onclick="cPrev()"><i class="fas fa-chevron-left"></i></button>
<button class="gnav nxt" onclick="cNext()"><i class="fas fa-chevron-right"></i></button>
<div class="gdots" id="gdots">
${product.images.map((_,i)=>'<button class="gdot '+(i===0?'act':'')+'" onclick="goSlide('+i+')"></button>').join('')}
</div></div>
</div>

<div class="pinfo">
<p class="pcat">${product.category}</p>
<h1 class="pname">${product.name}</h1>
<p class="ptag">${product.tagline}</p>
<div class="prating"><span class="pstars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i></span><span class="prtext">4.8 (47 reviews)</span></div>
<div class="pprow">
<span class="pprice">${STORE_CONFIG.currencySymbol}${product.price.toLocaleString('en-IN')}</span>
${product.comparePrice?'<span class="pcmp">'+STORE_CONFIG.currencySymbol+product.comparePrice.toLocaleString('en-IN')+'</span>':''}
${disc>0?'<span class="psave">'+disc+'% OFF</span>':''}
</div>
<div class="dispatch-badge"><i class="fas fa-rocket"></i> Fast Dispatch: Orders processed within 36 hours</div>
<p class="pdesc">${product.description}</p>
<hr class="pdiv">
<label class="plbl">Select Size</label>
<div class="szopt" id="szopt">
${product.sizes.map((s,i)=>'<button class="szbtn '+(i===0?'sel':'')+'" data-sz="'+s+'" onclick="selSz(this)">'+s+'</button>').join('')}
</div>
<div class="pactions">
<button class="atc-btn" onclick="handleATC()"><i class="fas fa-shopping-bag" style="margin-right:8px"></i>Add to Bag</button>
<button class="bn-btn" onclick="handleBuyNow()"><i class="fas fa-bolt" style="margin-right:8px"></i>Buy Now</button>
<button class="wl-btn" onclick="this.classList.toggle('act')"><i class="far fa-heart"></i></button>
</div>
<div class="sc-info">
<i class="fas fa-info-circle"></i>
<span>All sales final. No cash refunds. <span class="tip"><strong>Store Credit only <i class="fas fa-question-circle" style="font-size:10px"></i></strong><span class="tiptext">We value our community. If a product arrives damaged, we provide instant store credit equal to your purchase value for your next pick. Credit never expires.</span></span></span>
</div>
<div class="pshipping">
<span><i class="fas fa-truck"></i> Free shipping over Rs.1,999</span>
<span><i class="fas fa-exchange-alt"></i> 36h exchange window</span>
</div>
<div class="pdets">
<div class="ditm"><button class="dtog opn" onclick="togDet(this)">Product Details <i class="fas fa-chevron-down"></i></button><div class="dcnt opn"><div class="dcnti">&bull; Premium 240 GSM cotton<br>&bull; Garment-dyed for soft hand-feel<br>&bull; Pre-shrunk &mdash; true to size<br>&bull; Ribbed neckline<br>&bull; Double-needle stitching</div></div></div>
<div class="ditm"><button class="dtog" onclick="togDet(this)">Size &amp; Fit <i class="fas fa-chevron-down"></i></button><div class="dcnt"><div class="dcnti">Model is 6'0" / 183cm, wearing size L.<br>Relaxed fit &mdash; if between sizes, go with your usual.</div></div></div>
<div class="ditm"><button class="dtog" onclick="togDet(this)">Shipping &amp; Returns <i class="fas fa-chevron-down"></i></button><div class="dcnt"><div class="dcnti">Dispatched within 36 hours. Free shipping over Rs.1,999.<br>All sales final. Store credit only for defects within 36h. <a href="/p/returns" style="text-decoration:underline">Full policy</a></div></div></div>
</div></div></div></div>

<section class="relsec"><div class="shdr"><p class="sover">You May Also Like</p><h2 class="stitle">Complete the Look</h2></div>
<div class="relgrid">
${related.map(p=>{const d=p.comparePrice?Math.round((1-p.price/p.comparePrice)*100):0;return '<a href="/product/'+p.slug+'" class="pcard"><div class="pcimg"><img src="'+p.images[0]+'" alt="intru.in '+p.name+'" loading="lazy" width="400" height="533"><img class="ih" src="'+p.images[1]+'" alt="'+p.name+'" loading="lazy" width="400" height="533" style="width:100%;height:100%;object-fit:cover">'+(d>0?'<span class="pcbadge">Save '+d+'%</span>':'')+'</div><div class="pcinfo"><h3 class="pcname">'+p.name+'</h3><p class="pctag">'+p.tagline+'</p><div class="pcprice"><span class="cur">'+STORE_CONFIG.currencySymbol+p.price.toLocaleString('en-IN')+'</span>'+(p.comparePrice?' <span class="cmp">'+STORE_CONFIG.currencySymbol+p.comparePrice.toLocaleString('en-IN')+'</span>':'')+'</div></div></a>'}).join('')}
</div></section>

<div class="lb" id="lb" onclick="closeLB()">
<button class="lbcls" onclick="closeLB()"><i class="fas fa-times"></i></button>
<button class="lbnav prv" onclick="event.stopPropagation();lbPrev()"><i class="fas fa-chevron-left"></i></button>
<img id="lbi" src="" alt="">
<button class="lbnav nxt" onclick="event.stopPropagation();lbNext()"><i class="fas fa-chevron-right"></i></button>
<div class="lbcnt" id="lbcnt"></div>
</div>

<script>
var P=${pj};var selSize=P.sz[0];var cs=0;var li=0;
function selSz(b){document.querySelectorAll('.szbtn').forEach(function(x){x.classList.remove('sel')});b.classList.add('sel');selSize=b.dataset.sz}
function handleATC(){addToCart(P.id,selSize,1)}
function handleBuyNow(){buyNow(P.id,selSize)}
function updCar(){var t=document.getElementById('gtrk');if(t)t.style.transform='translateX(-'+cs*100+'%)';document.querySelectorAll('.gdot').forEach(function(d,i){d.classList.toggle('act',i===cs)})}
function cNext(){cs=(cs+1)%P.i.length;updCar()}
function cPrev(){cs=(cs-1+P.i.length)%P.i.length;updCar()}
function goSlide(i){cs=i;updCar()}
var tx=0;var car=document.getElementById('car');
if(car){car.addEventListener('touchstart',function(e){tx=e.touches[0].clientX});car.addEventListener('touchend',function(e){var d=tx-e.changedTouches[0].clientX;if(Math.abs(d)>50)d>0?cNext():cPrev()})}
function openLB(i){li=i;updLB();document.getElementById('lb').classList.add('open');document.body.style.overflow='hidden'}
function closeLB(){document.getElementById('lb').classList.remove('open');document.body.style.overflow=''}
function updLB(){document.getElementById('lbi').src=P.i[li];document.getElementById('lbi').alt='intru.in '+P.n+' - View '+(li+1);document.getElementById('lbcnt').textContent=(li+1)+' / '+P.i.length}
function lbNext(){li=(li+1)%P.i.length;updLB()}
function lbPrev(){li=(li-1+P.i.length)%P.i.length;updLB()}
document.addEventListener('keydown',function(e){if(!document.getElementById('lb').classList.contains('open'))return;if(e.key==='Escape')closeLB();if(e.key==='ArrowRight')lbNext();if(e.key==='ArrowLeft')lbPrev()});
function togDet(b){b.classList.toggle('opn');b.nextElementSibling.classList.toggle('opn')}
</script>`;

  return shell(
    product.name + ' — INTRU.IN | ' + STORE_CONFIG.currencySymbol + product.price.toLocaleString('en-IN'),
    product.description.substring(0,155) + '...',
    body,
    { og: product.images[0], url: 'https://intru.in/product/' + product.slug, schema }
  );
}
