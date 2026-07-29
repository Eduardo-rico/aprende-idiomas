"use client";
// El lector karaoke: resalta cada palabra mientras suena su audio,
// encadena párrafos, y clicar una palabra salta el audio a ella.
//
// Los tiempos vienen por carácter de /with-timestamps y ya agrupados en
// palabras por el generador — aquí no se estima nada, sólo se busca la
// palabra cuyo intervalo contiene el currentTime. Validado en el piloto
// standalone aprobado por Edu el 2026-07-29.
import { useEffect, useRef, useState } from "react";
import type { ParrafoLectura } from "@/lib/data/loaders";

export function LectorKaraoke({
  parrafos,
  baseAudio,
}: {
  parrafos: ParrafoLectura[];
  baseAudio: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [pi, setPi] = useState(-1); // párrafo activo
  const [wi, setWi] = useState(-1); // palabra activa
  const [sonando, setSonando] = useState(false);
  const [fin, setFin] = useState(false);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // El estado que los handlers del <audio> necesitan leer, sin re-suscribir
  // los listeners en cada render.
  const piRef = useRef(pi);
  piRef.current = pi;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => {
      const p = piRef.current;
      if (p < 0) return;
      const ws = parrafos[p]?.palabras ?? [];
      const t = audio.currentTime;
      let idx = -1;
      for (let i = 0; i < ws.length; i++) {
        const w = ws[i]!;
        if (t >= w.s - 0.03 && t <= w.e + 0.12) { idx = i; break; }
        if (t < w.s) break;
        idx = i;
      }
      if (idx >= 0) setWi(idx);
    };
    const onEnded = () => {
      const p = piRef.current;
      if (p + 1 < parrafos.length) {
        setPi(p + 1);
        setWi(-1);
        audio.src = `${baseAudio}/${parrafos[p + 1]!.mp3}`;
        void audio.play();
      } else {
        setSonando(false);
        setFin(true);
        setPi(-1);
        setWi(-1);
      }
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, [parrafos, baseAudio]);

  // Mantener la palabra activa a la vista sin que el usuario persiga el texto.
  useEffect(() => {
    if (pi < 0 || wi < 0) return;
    const el = document.querySelector(`[data-kw="${pi}-${wi}"]`);
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top < 90 || r.bottom > window.innerHeight - 120) {
      el.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [pi, wi]);

  const carga = (p: number, seek?: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (pi !== p) {
      setPi(p);
      setWi(-1);
      audio.src = `${baseAudio}/${parrafos[p]!.mp3}`;
    }
    if (seek !== undefined) audio.currentTime = seek;
    void audio.play();
    setSonando(true);
    setFin(false);
  };

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (sonando) {
      audio.pause();
      setSonando(false);
    } else {
      carga(pi < 0 ? 0 : pi);
    }
  };

  return (
    <>
      <div>
        {parrafos.map((p, pIdx) => (
          <p
            key={pIdx}
            className={`font-display text-[20px] leading-[1.75] mb-5 transition-[padding,border] ${
              pIdx === pi
                ? "border-l-[3px] border-cobalt pl-4 -ml-[19px]"
                : ""
            }`}
          >
            {p.palabras.map((w, wIdx) => (
              <span key={wIdx}>
                <button
                  type="button"
                  data-kw={`${pIdx}-${wIdx}`}
                  onClick={() => carga(pIdx, w.s)}
                  className={`rounded-[3px] px-px cursor-pointer hover:bg-cobalt/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cobalt ${
                    pIdx === pi && wIdx === wi
                      ? "bg-cobalt text-white"
                      : ""
                  }`}
                >
                  {w.t}
                </button>{" "}
              </span>
            ))}
          </p>
        ))}
      </div>
      <div className="fixed bottom-0 left-0 right-0 border-t border-rule bg-canvas px-6 py-3">
        <div className="mx-auto max-w-[680px] flex items-center gap-4">
          <button
            type="button"
            onClick={toggle}
            className="rounded-full border border-cobalt bg-cobalt text-white font-semibold text-[15px] px-6 py-2"
          >
            {sonando ? "⏸ Pausa" : "▶ Ouvir"}
          </button>
          <span className="font-mono text-[11.5px] text-ink-faint tabular-nums">
            {fin
              ? "fim"
              : pi >= 0
                ? `párrafo ${pi + 1}/${parrafos.length}`
                : `${parrafos.length} párrafos · toca una palabra para saltar a ella`}
          </span>
        </div>
      </div>
    </>
  );
}
