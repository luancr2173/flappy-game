import { ASSETS } from '../assets.manifest';

export type GameImages = Record<string, HTMLImageElement | undefined>;

export function loadGameImages(onLoad: (images: GameImages) => void): { images: GameImages; dispose: () => void } {
  const images: GameImages = {};
  let disposed = false;

  for (const asset of ASSETS) {
    if (asset.kind !== 'image') continue;
    void fetch(asset.path, { method: 'HEAD' })
      .then((response) => {
        if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) return;
        const image = new Image();
        image.onload = () => {
          if (disposed) return;
          images[asset.id] = image;
          onLoad(images);
        };
        image.onerror = () => {
          images[asset.id] = undefined;
        };
        image.src = asset.path;
      })
      .catch(() => {
        images[asset.id] = undefined;
      });
  }

  return {
    images,
    dispose: () => {
      disposed = true;
    },
  };
}
