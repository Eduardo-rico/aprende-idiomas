// lib/audio/preloader.ts
// LRU de 50 audios precargados. `preloadNextAudio(urls)` se llama desde
// la sesión al cargar cada card para que el play sea instantáneo.

const cache = new Map<string, HTMLAudioElement>();
const MAX = 50;

export function preloadAudio(url: string): void {
  if (typeof window === "undefined") return;
  if (cache.has(url)) return;
  const a = new Audio();
  a.preload = "auto";
  a.src = url;
  cache.set(url, a);
  if (cache.size > MAX) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
}

export function preloadNextAudio(urls: string[]): void {
  // Pre-carga hasta 3 siguientes audios de la cola.
  for (const u of urls.slice(0, 3)) preloadAudio(u);
}

export function clearAudioPreloadCache(): void {
  cache.clear();
}