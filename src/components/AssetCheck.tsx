import { useEffect, useState } from 'react';
import { ASSETS } from '../assets.manifest';

export default function AssetCheck() {
  const [missing, setMissing] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    void Promise.all(
      ASSETS.map(async (asset) => {
        try {
          const response = await fetch(asset.path, { method: 'HEAD' });
          const contentType = response.headers.get('content-type') ?? '';
          return response.ok && !contentType.includes('text/html') ? null : asset;
        } catch {
          return asset;
        }
      }),
    ).then((results) => {
      if (!cancelled) setMissing(results.filter((asset): asset is (typeof ASSETS)[number] => asset !== null).map((asset) => `${asset.id}${asset.optional ? ' (opcional)' : ''}`));
    });
    return () => { cancelled = true; };
  }, []);

  if (!import.meta.env.DEV) return null;
  return (
    <details className="asset-check">
      <summary>Assets ausentes: {missing.length}</summary>
      {missing.length ? <ul>{missing.map((asset) => <li key={asset}>{asset}</li>)}</ul> : <p>Todos os assets estão presentes.</p>}
    </details>
  );
}
