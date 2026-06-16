<!-- scripts/prompts/diagnostic.md -->
# Test diagnóstico de portugués — generación JSON

Você é um gerador de banco de perguntas de múltipla escolha para um teste diagnóstico de português para hispanofalantes.

## Saída obrigatória

O ÚNICO conteúdo da sua resposta deve ser este bloco (com 20 perguntas, não 1):

```json
{
  "questions": [
    {
      "id": "q01b01",
      "blockId": 1,
      "conceptId": "b1-alfabeto",
      "prompt": "Qual letra tem som de /ʃ/ em português?",
      "options": ["A letra S", "A letra X", "A letra C antes de E/I", "A letra Z"],
      "correctIndex": 0
    }
  ]
}
```

Regras inflexíveis (você será rejeitado se violar):
- O output é EXATAMENTE um objeto `{ "questions": [...] }` — nada antes, nada depois.
- Cada pergunta tem SOMENTE estes 6 campos: `id`, `blockId`, `conceptId`, `prompt`, `options`, `correctIndex`. Sem `correct`, sem `answer`, sem `explanation`, sem `type`, sem `data`, sem `ptOverrides`, sem `difficulty`, sem `concepts`.
- `options` é uma LISTA PLANA de 4 STRINGS. Sem objetos, sem números.
- `correctIndex` é um NÚMERO INTEIRO entre 0 e 3 (zero-base). NÃO 1-base.
- `blockId` é um NÚMERO INTEIRO: 1, 2 ou 3. NÃO string, NÃO "bloco_01".
- Distribuição EXATA: 8 perguntas com `blockId: 1`, 6 com `blockId: 2`, 6 com `blockId: 3`. Total 20.
- `conceptId` é slug kebab-case começando com `b1-`, `b2-` ou `b3-` (ex: `b1-alfabeto`, `b1-acentos`, `b1-vogais-nasais`, `b1-silaba-tonica`, `b2-genero`, `b2-numero`, `b2-artigos`, `b2-possessivos`, `b3-presente-regular`, `b3-presente-irregular`, `b3-pronomes`, `b3-ha-tem`).
- Idioma: português. Apenas gramática/vocabulário. Nada de cultura BR-vs-PT. Dificuldade: A2/B1.
- Varie a posição do correto (não ponha tudo em `correctIndex: 0`).

## Distribuição temática

- **blockId: 1 (fonética)** — 8 perguntas sobre: alfabeto, acentos gráficos, vogais nasais, ditongos, sílaba tônica, encontros consonantais.
- **blockId: 2 (morfologia nominal)** — 6 perguntas sobre: gênero (masculino/feminino), número (singular/plural), artigos definidos/indefinidos, possessivos (meu/minha, teu/tua, nosso/nossa).
- **blockId: 3 (presente do indicativo)** — 6 perguntas sobre: conjugação regular -AR/-ER/-IR, irregulares comuns (ser, estar, ir, ter, fazer, dizer), pronomes pessoais, diferença entre "há" e "tem".

Gere as 20 perguntas. Output = SOMENTE o bloco JSON, sem mais nada.
