// scripts/seed-shadowing.ts
// Genera shadowing cards para bloques 3-8. Invocar: tsx scripts/seed-shadowing.ts
// Requiere MINIMAX_API_KEY en el entorno.

import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { createHash } from "node:crypto";

interface ShadowItem { prompt: string; blockId: number; variant: "br" | "pt" | "both"; }

const ITEMS: ShadowItem[] = [
  // Bloco 3 — Presente perfeito composto BR / Pretérito perfeito composto PT
  { prompt: "Tenho estudado português todos os dias.", blockId: 3, variant: "both" },
  { prompt: "Você tem trabalhado muito ultimamente?", blockId: 3, variant: "both" },
  { prompt: "Nós temos comido juntos toda semana.", blockId: 3, variant: "both" },
  { prompt: "Ele tem dormido bem desde que começou a se exercitar.", blockId: 3, variant: "br" },
  { prompt: "Ela tem viajado bastante este ano.", blockId: 3, variant: "both" },
  // Bloco 4 — Pretérito imperfeito
  { prompt: "Quando era criança, brincava na rua todos os dias.", blockId: 4, variant: "both" },
  { prompt: "Ela estudava piano quando tinha oito anos.", blockId: 4, variant: "both" },
  { prompt: "Nós morávamos perto do mar.", blockId: 4, variant: "both" },
  { prompt: "Eles sempre chegavam tarde ao trabalho.", blockId: 4, variant: "both" },
  { prompt: "Eu não sabia que você estava aqui.", blockId: 4, variant: "both" },
  // Bloco 5 — Futuro do presente
  { prompt: "Viajarei ao Brasil no próximo mês.", blockId: 5, variant: "pt" },
  { prompt: "Vou viajar ao Brasil no próximo mês.", blockId: 5, variant: "br" },
  { prompt: "Amanhã será um dia especial.", blockId: 5, variant: "both" },
  { prompt: "Quando você terminar, me avisa.", blockId: 5, variant: "br" },
  { prompt: "Quando terminares, avisa-me.", blockId: 5, variant: "pt" },
  // Bloco 6 — Conjuntivo presente
  { prompt: "Espero que você venha amanhã.", blockId: 6, variant: "both" },
  { prompt: "É importante que estudemos todos os dias.", blockId: 6, variant: "both" },
  { prompt: "Quero que ele fique.", blockId: 6, variant: "both" },
  { prompt: "Talvez ela saiba a resposta.", blockId: 6, variant: "both" },
  { prompt: "Duvido que ele chegue a tempo.", blockId: 6, variant: "both" },
  // Bloco 7 — Condicional / Futuro do pretérito
  { prompt: "Eu compraria uma casa se tivesse dinheiro.", blockId: 7, variant: "both" },
  { prompt: "Se eu soubesse, teria chegado mais cedo.", blockId: 7, variant: "both" },
  { prompt: "Gostaria de um café, por favor.", blockId: 7, variant: "both" },
  { prompt: "Você poderia me ajudar?", blockId: 7, variant: "both" },
  { prompt: "Nós viajaríamos mais se pudéssemos.", blockId: 7, variant: "both" },
  // Bloco 8 — Conjuntivo imperfeito / Condicional composto
  { prompt: "Se eu fosse rico, viajaria pelo mundo.", blockId: 8, variant: "both" },
  { prompt: "Se tivéssemos estudado mais, teríamos passado.", blockId: 8, variant: "both" },
  { prompt: "Oxalá que ela esteja bem.", blockId: 8, variant: "pt" },
  { prompt: "Tomara que chova amanhã.", blockId: 8, variant: "br" },
  { prompt: "Mesmo que fosse difícil, ela continuaria tentando.", blockId: 8, variant: "both" },
];

async function sha256hex(buf: Buffer): Promise<string> {
  return createHash("sha256").update(buf).digest("hex");
}

async function main() {
  const { generateTts } = await import("../lib/llm/tts.js");
  await mkdir("public/audio", { recursive: true });

  const results: Array<{ prompt: string; blockId: number; br?: string; pt?: string }> = [];

  for (const item of ITEMS) {
    const result: { prompt: string; blockId: number; br?: string; pt?: string } = {
      prompt: item.prompt,
      blockId: item.blockId,
    };
    const variants: Array<"br" | "pt"> = item.variant === "both" ? ["br", "pt"] : [item.variant];

    for (const variant of variants) {
      const buf = await generateTts(item.prompt, variant);
      const hash = await sha256hex(Buffer.from(buf));
      const path = join("public/audio", `${hash}.mp3`);
      await writeFile(path, Buffer.from(buf));
      result[variant] = hash;
      console.log(`✓ ${variant} b${item.blockId} "${item.prompt.slice(0, 40)}…" → ${hash.slice(0, 8)}`);
    }
    results.push(result);
  }

  const { writeFileSync } = await import("node:fs");
  writeFileSync("lib/data/languages/pt/shadowing-seeds.json", JSON.stringify(results, null, 2));
  console.log(`\n✓ ${results.length} shadowing seeds written`);
}

main().catch(console.error);
