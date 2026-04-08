import { shell } from '../components/shell'
import { type Product, type LegalPage } from '../data'

export function maintenancePage(opts: {
  razorpayKeyId?: string;
  googleClientId?: string;
  products: Product[];
  legalPages: LegalPage[];
  useMagicCheckout?: boolean;
  maintenance?: { enabled?: boolean; type?: string };
  storeSettings?: Record<string, string>;
}): string {
  const body = [
    '<style>',
    '.m-page{min-height:92vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:120px 24px;background:#f5f5f5}',
    '.m-page-box{background:#fff;max-width:500px;width:100%;padding:64px 32px;border-radius:2px;box-shadow:0 12px 32px rgba(0,0,0,0.06)}',
    '.m-page-box i{font-size:48px;color:var(--bk);margin-bottom:24px}',
    '.m-page-box h1{font-family:var(--head);font-size:32px;letter-spacing:-0.04em;text-transform:uppercase;margin-bottom:16px}',
    '.m-page-box p{font-size:15px;color:var(--g500);line-height:1.6;margin-bottom:32px}',
    '.m-page-box a{display:inline-block;padding:16px 32px;background:var(--bk);color:var(--wh);text-transform:uppercase;font-size:11px;font-weight:700;letter-spacing:2px}',
    '</style>',
    '<div class="m-page">',
    '  <div class="m-page-box">',
    '    <i class="fas fa-hammer"></i>',
    '    <h1>Site Maintenance</h1>',
    '    <p>We are currently down for scheduled maintenance.<br><br>Nobody can browse or place orders at the moment. Please check back later.</p>',
    '    <a href="mailto:shop@intru.in">Contact Support</a>',
    '  </div>',
    '</div>',
  ].join('\n');

  return shell('Site Maintenance | Intru', 'The site is currently down for maintenance.', body, { ...opts, useMagicCheckout: !!opts.useMagicCheckout, cls: 'pg-main' });
}
