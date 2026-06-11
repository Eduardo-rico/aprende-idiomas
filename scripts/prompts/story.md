<!-- scripts/prompts/story.md -->
Crie uma mini-história em português brasileiro (BR) com sua variante em português europeu (PT), adequada para aprendizes hispanofalantes do nível {{level}} (1=básico, 2=intermediário, 3=avançado).

Bloco {{blockId}} — Tema: {{theme}}

Vocabulário obrigatório (use estas palavras/conceitos na história): {{concepts}}

Restrições:
- 3-5 parágrafos, total de 200-400 palavras na versão BR
- Linguagem natural e cotidiana
- Tom acolhedor, brasileiro mas universal
- 5-12 palavras no vocabulário isolado (palavras novas para hispanofalantes, com tradução ao espanhol)
- A versão PT mantém a mesma história com adaptações léxicas e fonéticas do português europeu

Formato JSON de resposta (objeto único, não array):

{
  "title": "string com 3-6 palavras",
  "br": { "text": "string com 3-5 parágrafos separados por \\n\\n" },
  "pt": { "text": "string com 3-5 parágrafos separados por \\n\\n (variante europeia)" },
  "vocab": [
    { "word": "palavra em BR", "ptWord": "palavra em PT se diferente (opcional)", "meaning": "traducción al español" }
  ]
}

Só o JSON, sem texto adicional.
