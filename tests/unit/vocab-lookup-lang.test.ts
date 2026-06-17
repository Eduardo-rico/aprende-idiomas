// tests/unit/vocab-lookup-lang.test.ts
// Phase 2: /api/vocab/lookup acepta ?lang= y sirve el catalog por idioma.
import { describe, it, expect, beforeAll } from 'vitest';
import { GET } from '@/app/api/vocab/lookup/route';
import { _resetCatalogCacheForTests } from '@/lib/vocab/catalog';

beforeAll(() => { _resetCatalogCacheForTests(); });

function req(query: string): Request {
  return new Request(`http://localhost/api/vocab/lookup?${query}`);
}

describe('/api/vocab/lookup (Phase 2: per-lang)', () => {
  it('responde 400 si falta ?w=', async () => {
    const res = await GET(req('lang=pt'));
    expect(res.status).toBe(400);
  });

  it('responde 400 si ?w es muy largo', async () => {
    const res = await GET(req('w=' + 'a'.repeat(100)));
    expect(res.status).toBe(400);
  });

  it('busca en catalog de PT y retorna el item', async () => {
    // El catalog de PT incluye "à espera" (primera entrada del vocab catalog).
    const res = await GET(req('w=à espera&lang=pt'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.source).toBe('catalog');
    expect(body.word).toBe('à espera');
  });

  it('busca en catalog de PT (default sin ?lang)', async () => {
    const res = await GET(req('w=à espera'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.source).toBe('catalog');
  });

  it('lang desconocido cae a "pt"', async () => {
    const res = await GET(req('w=à espera&lang=xx'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.source).toBe('catalog');
  });

  it('lang sin catalog (ru) retorna null para palabra conocida en PT', async () => {
    const res = await GET(req('w=à espera&lang=ru'));
    expect(res.status).toBe(200);
    const body = await res.json();
    // RU no tiene catalog todavía, así que cai a null.
    expect(body.item).toBeNull();
  });
});
