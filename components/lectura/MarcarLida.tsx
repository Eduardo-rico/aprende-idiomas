"use client";
// «Marcar como lida»: el cierre del circuito de la Ola L — terminar una
// lectura de nivel N registra evidencia de comprensión lectora de N en
// la capa MCER (Dexie), con las reglas de esa capa: releer no infla,
// y el umbral ≥2 sigue exigiendo dos días distintos.
import { useEffect, useState } from "react";
import { registrarLecturaTerminada, lecturaYaTerminada } from "@/lib/db/evidence";
import type { LanguageId } from "@/lib/locales";

export function MarcarLida({
  lecturaId,
  nivel,
  lang,
}: {
  lecturaId: string;
  nivel: string;
  lang: LanguageId;
}) {
  const [estado, setEstado] = useState<"cargando" | "pendiente" | "lida">("cargando");

  useEffect(() => {
    let cancelado = false;
    void lecturaYaTerminada(lecturaId, nivel, lang).then((ya) => {
      if (!cancelado) setEstado(ya ? "lida" : "pendiente");
    });
    return () => {
      cancelado = true;
    };
  }, [lecturaId, nivel, lang]);

  const marcar = async () => {
    const r = await registrarLecturaTerminada({ lecturaId, nivel, language: lang });
    if (r) setEstado("lida");
  };

  if (estado === "cargando") return null;
  return (
    <div className="mt-10 border-t border-rule pt-6 text-center">
      {estado === "lida" ? (
        <p className="font-mono text-[12px] text-ink-muted">
          ✓ Lida — cuenta como evidencia de {nivel} (comprensión lectora)
        </p>
      ) : (
        <button
          type="button"
          onClick={marcar}
          className="rounded-full border border-cobalt text-cobalt font-semibold text-[14px] px-6 py-2 hover:bg-cobalt hover:text-white transition-colors"
        >
          Marcar como lida
        </button>
      )}
    </div>
  );
}
