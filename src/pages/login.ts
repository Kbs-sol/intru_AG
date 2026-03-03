import { shell } from '../components/shell'
import { STORE_CONFIG, type Product, type LegalPage } from '../data'

export function loginPage(opts: {
  razorpayKeyId?: string;
  googleClientId?: string;
  products: Product[];
  legalPages: LegalPage[];
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}): string {
  const products = opts.products;
  const legalPages = opts.legalPages;
  const sbUrl = opts.supabaseUrl || '';
  const sbAnon = opts.supabaseAnonKey || '';

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Sign In — intru.in",
    "description": "Sign in to your intru.in account. Access your orders, store credit, and exclusive drops.",
    "url": "https://intru.in/login"
  });

  const body = `<style>
.auth-wrap{max-width:420px;margin:0 auto;padding:80px 24px 100px;min-height:calc(100vh - 64px);display:flex;flex-direction:column;justify-content:center}
.auth-hdr{text-align:center;margin-bottom:40px}
.auth-over{font-size:10px;font-weight:700;letter-spacing:5px;text-transform:uppercase;color:var(--g400);margin-bottom:12px}
.auth-title{font-family:var(--head);font-size:clamp(28px,5vw,40px);text-transform:uppercase;letter-spacing:-.03em;margin-bottom:8px}
.auth-sub{font-size:14px;color:var(--g400);line-height:1.6}
.auth-divider{display:flex;align-items:center;gap:16px;margin:28px 0;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:var(--g300)}
.auth-divider::before,.auth-divider::after{content:'';flex:1;height:1px;background:var(--g100)}
.auth-form{display:flex;flex-direction:column;gap:14px}
.auth-input{width:100%;padding:16px 18px;border:1.5px solid var(--g200);background:var(--wh);font-size:14px;font-family:inherit;outline:none;transition:border-color .2s}.auth-input:focus{border-color:var(--bk)}
.auth-input::placeholder{color:var(--g300)}
.auth-btn{width:100%;padding:17px;background:var(--bk);color:var(--wh);border:none;font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;transition:all .3s var(--ease)}.auth-btn:hover{background:var(--g600);transform:translateY(-1px)}.auth-btn:disabled{background:var(--g300);cursor:not-allowed;transform:none}
.auth-msg{font-size:12px;text-align:center;padding:12px 16px;border-radius:4px;display:none}
.auth-msg.ok{display:block;background:#d1fae5;color:#065f46;border:1px solid #6ee7b7}
.auth-msg.err{display:block;background:#fee2e2;color:#991b1b;border:1px solid #fca5a5}
.auth-link{text-align:center;font-size:13px;color:var(--g400);margin-top:24px}
.auth-link a{color:var(--bk);font-weight:700;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:2px}
.g-wrap{display:flex;justify-content:center;margin-bottom:8px}
.g-btn{width:100%;display:flex;align-items:center;justify-content:center;gap:12px;padding:15px;border:1.5px solid var(--g200);background:var(--wh);border-radius:0;font-size:13px;font-weight:600;font-family:inherit;color:var(--bk);transition:all .2s;cursor:pointer}
.g-btn:hover{border-color:var(--bk);background:var(--g50)}
.g-btn svg{width:20px;height:20px}
</style>

<div class="auth-wrap">
<div class="auth-hdr">
<p class="auth-over anim">Welcome Back</p>
<h1 class="auth-title anim d1">Sign In</h1>
<p class="auth-sub anim d2">Access your orders, store credit, and exclusive drops.</p>
</div>

<div class="g-wrap anim d2">
<button class="g-btn" id="gSignIn" onclick="triggerGoogleSignIn()">
<svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
Continue with Google
</button>
</div>

<div class="auth-divider">or</div>

<form class="auth-form anim d3" onsubmit="event.preventDefault();sendMagicLink()">
<input class="auth-input" type="email" id="authEmail" placeholder="Enter your email" required autocomplete="email">
<button class="auth-btn" type="submit" id="authBtn"><i class="fas fa-magic" style="margin-right:8px"></i>Send Magic Link</button>
</form>

<div class="auth-msg" id="authMsg"></div>

<p class="auth-link anim d4">Don't have an account? <a href="/register">Create one</a></p>
</div>

<script>
var SB_URL='${sbUrl}';
var SB_ANON='${sbAnon}';

function triggerGoogleSignIn(){
  if(typeof google!=='undefined'&&google.accounts){
    google.accounts.id.prompt();
  } else {
    toast('Google Sign-In not available. Check your connection.','err');
  }
}

function sendMagicLink(){
  var email=document.getElementById('authEmail').value.trim();
  if(!email){toast('Enter your email','err');return}
  var btn=document.getElementById('authBtn');
  var msg=document.getElementById('authMsg');
  btn.disabled=true;btn.textContent='SENDING...';
  msg.className='auth-msg';msg.style.display='none';

  fetch('/api/auth/magic-link',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({email:email})
  })
  .then(function(r){return r.json()})
  .then(function(d){
    if(d.success){
      msg.className='auth-msg ok';msg.textContent='Magic link sent to '+email+'. Check your inbox!';msg.style.display='block';
      localStorage.setItem('intru_user_email',email);
    } else {
      msg.className='auth-msg err';msg.textContent=d.error||'Failed to send. Try again.';msg.style.display='block';
    }
  })
  .catch(function(e){msg.className='auth-msg err';msg.textContent='Error: '+e.message;msg.style.display='block'})
  .finally(function(){btn.disabled=false;btn.innerHTML='<i class="fas fa-magic" style="margin-right:8px"></i>Send Magic Link'});
}
</script>`;

  return shell(
    'Sign In — INTRU.IN | Exclusive Streetwear India',
    'Sign in to your intru.in account. Access your orders, store credit, and exclusive drops. Google One-Tap or passwordless email magic links.',
    body,
    { url: 'https://intru.in/login', schema, razorpayKeyId: opts.razorpayKeyId, googleClientId: opts.googleClientId, products, legalPages }
  );
}
