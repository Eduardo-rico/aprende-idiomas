// tests/unit/molde-mediacion.test.ts
//
// El TERCER eje del gate de virginidad: el molde de las mediaciones.
//
// Por qué existe (E2#6, medido): el gate de virginidad dio **0 pares
// para doce mediaciones de las que DOS eran clones**. No es un bug del
// umbral: es el diseño. El eje de PALABRAS pondera por IDF y una
// mediación clonada cambia exactamente las palabras (nombres, horas,
// precios, el asunto del aviso) y conserva exactamente el esqueleto
// (mismo tipo, misma dirección, mismo rango, misma rúbrica casilla a
// casilla, misma bisagra). Los textos largos rematan la dilución. El
// eje de CONCEPTS tampoco lo ve: todas las mediaciones declaran
// `b10-registro` o `b10-relay-avisos`, así que sólo dice «familia».
//
// Los fixtures son clones REALES ya observados, no inventados:
//
//   1. MED-53 v1 ↔ b2c2-med-38 (lote 7, E2#4). El borrador era med-38
//      «con los nombres cambiados»: mismo género (recado oral de jefa
//      en español), misma dirección es→pt, mismo wordRange 35-65 y la
//      rúbrica calcada casilla a casilla. El gate IDF dio CERO pares.
//   2. MED-108 v1 ↔ b2c2-med-64 (industrial 2, E2#6). Dos avisos de
//      instalación municipal con cierre + reapertura + alternativa. El
//      IDF lo rozó a 0,373 — por encima del umbral por los nombres de
//      mes compartidos, no por el molde. Si el mes hubiera sido otro,
//      pasa limpio.
//   3. MED-133 ⊂ MED-132 (lote 9, E2#6). Comparten FUENTE: el mismo
//      `junqueiro-o-talisman`, con los párrafos de uno contenidos en
//      los del otro, y las dos respuestas modelo dicen la misma frase.
//      Esta clase no necesita umbral: compartir fuente entre dos
//      mediaciones es un hallazgo por sí mismo.
//
// Y los no-clones son igual de importantes: la línea B industrial
// tiene molde POR DISEÑO (24 avisos por plantilla), así que un gate
// que marque dos avisos cualesquiera es un gate inútil.
import { describe, it, expect } from 'vitest';
import {
  enmascarar, firmaRubrica, similitudMolde, buscarClonesMolde, UMBRAL_MOLDE,
  type MedIndexable,
} from '@/scripts/lib/molde-mediacion';

// ── Fixtures: los clones reales ──────────────────────────────────

const MED_38: MedIndexable = {
  id: 'b2c2-med-38', register: 'informal', address: 'tu', tags: [],
  data: {
    mediationType: 'relay', sourceLang: 'es', targetLang: 'pt',
    audience: 'o Rui, colega de trabalho, tratado por tu',
    wordRange: { min: 35, max: 65 },
    sourceText: '«Oye, ¿me haces un favor? Dile a Rui que la reunión del jueves se pasa al viernes a las 10, en la sala pequeña. Que traiga los presupuestos impresos, que el proyector sigue roto. Y si no puede el viernes, que me escriba hoy mismo.»',
    rubric: [
      '¿Traslada los CUATRO datos: jueves→viernes 10h, sala pequeña, presupuestos impresos (proyector roto), avisar hoy si no puede?',
      '¿Está en portugués sin ninguna palabra española?',
      '¿Trata a Rui por tu, coherente de principio a fin?',
      '¿Entre 35 y 65 palabras?',
    ],
    modelAnswer: 'Olá Rui! Recado da nossa colega: a reunião de quinta passa para sexta às 10, na sala pequena.',
  },
};

// El borrador retirado en E2#4 — med-38 con los nombres cambiados.
const MED_53_V1: MedIndexable = {
  id: 'MED-53-v1', register: 'informal', address: 'tu', tags: [],
  data: {
    mediationType: 'relay', sourceLang: 'es', targetLang: 'pt',
    audience: 'a Marta, colega de trabalho portuguesa, tratada por tu',
    wordRange: { min: 35, max: 65 },
    sourceText: '«Oye, antes de que se me olvide: dile a Marta que el cliente de Oporto adelantó la visita al miércoles a las once y media. Que imprima el contrato — dos copias — y que reserve la sala grande. Ah, y si el miércoles ella no está, que me avise hoy sin falta.»',
    rubric: [
      '¿Traslada los CUATRO datos: visita adelantada a miércoles 11:30, contrato impreso en DOS copias, reservar la sala grande, avisar HOY si no puede?',
      '¿Está en portugués sin ninguna palabra española?',
      '¿Trata a Marta por tu, coherente de principio a fin?',
      '¿Entre 35 y 65 palabras?',
    ],
    modelAnswer: 'Olá Marta! Recado da chefe: o cliente do Porto antecipou a visita para quarta-feira às onze e meia.',
  },
};

const MED_64: MedIndexable = {
  id: 'b2c2-med-64', register: 'informal', tags: ['b2c2-linea-b', 'plantilla:aviso-v1', 'genero:cartel'],
  data: {
    mediationType: 'relay', sourceLang: 'pt', targetLang: 'es',
    audience: 'tu amiga española de intercambio, que tiene libros prestados',
    wordRange: { min: 30, max: 65 },
    sourceText: 'A biblioteca municipal encerra de 15 a 19 de setembro para inventário. Reabrimos segunda-feira, dia 22. Durante o encerramento, as devoluções podem ser feitas na caixa exterior, junto à porta principal. Os prazos de empréstimo ficam suspensos.',
    rubric: [
      '¿Traslada el cierre con sus fechas (del 15 al 19 de septiembre, por inventario)?',
      '¿Traslada la reapertura (lunes 22)?',
      '¿Traslada el lugar alternativo (devoluciones en el buzón exterior, junto a la puerta principal)?',
      '¿Español natural, sin lusismos («encerra», «empréstimo»), entre 30 y 65 palabras?',
    ],
    modelAnswer: 'La biblioteca cierra del 15 al 19 de septiembre por inventario; vuelven a abrir el lunes 22.',
  },
};

// El borrador que el IDF rozó a 0,373 en E2#6 y que rediseñé.
const MED_108_V1: MedIndexable = {
  id: 'MED-108-v1', register: 'informal', tags: ['b2c2-linea-b', 'plantilla:aviso-v1.2', 'genero:cartel'],
  data: {
    mediationType: 'relay', sourceLang: 'pt', targetLang: 'es',
    audience: 'tu madre, de visita, que va a aquagym',
    wordRange: { min: 25, max: 60 },
    sourceText: 'Piscina Municipal encerrada para manutenção de 2 a 13 de setembro. Reabertura: segunda-feira, dia 16. Durante o encerramento, as aulas de hidroginástica decorrem no Pavilhão dos Desportos.',
    rubric: [
      '¿Traslada el cierre con fechas (del 2 al 13 de septiembre, por mantenimiento)?',
      '¿Traslada la reapertura (lunes 16)?',
      '¿Traslada la alternativa que le toca (el aquagym se da mientras tanto en el Pabellón de Deportes)?',
      '¿Español natural, sin lusismos («encerrada», «decorrem»), entre 25 y 60 palabras?',
    ],
    modelAnswer: 'Mamá, la piscina está cerrada por mantenimiento del 2 al 13 de septiembre; vuelven a abrir el lunes 16.',
  },
};

// Comparten FUENTE: [5]-[7] ⊂ [0]-[7] del mismo cuento.
const MED_132: MedIndexable = {
  id: 'MED-132', register: 'neutro', tags: [],
  data: {
    mediationType: 'synthesise_sources', sourceLang: 'pt', targetLang: 'pt',
    sourceRef: 'junqueiro-o-talisman+um-poeta-lirico',
    audience: 'uma colega de trabalho portuguesa que gosta de histórias com moral',
    wordRange: { min: 80, max: 130 },
    sourceText: 'Dois habitantes da mesma cidade exerciam n\'ella a mesma industria…',
    rubric: ['¿Recoge el talismán: dos comerciantes iguales, uno prospera y otro se arruina?'],
    modelAnswer: 'São dois textos sobre procurar valor no sítio errado. …descobre a desordem: a adega vazia, o celeiro roubado, os livros mal escriturados.',
  },
};

const MED_133: MedIndexable = {
  id: 'MED-133', register: 'formal', address: 'o_senhor', tags: [],
  data: {
    mediationType: 'explain_concept', sourceLang: 'pt', targetLang: 'pt',
    sourceRef: 'junqueiro-o-talisman',
    audience: 'o seu chefe português, que lhe perguntou porque anda a citar uma avelã nas reuniões',
    wordRange: { min: 45, max: 85 },
    sourceText: 'Quando ao outro dia foi procurar o seu generoso concorrente…',
    rubric: ['¿Explica qué es el talismán A LA LETRA (una avellana atravesada por un hilo de seda)?'],
    modelAnswer: 'O talismã do conto é apenas uma avelã atravessada por um fio de seda… descobre a adega vazia e os livros mal escriturados.',
  },
};

// ── No-clones: el gate no puede marcarlos ────────────────────────

// Mismo tipo y misma plantilla industrial, pero género, datos y
// operación distintos: es la línea B funcionando, no un clon.
const MED_113: MedIndexable = {
  id: 'b2c2-med-113', register: 'informal', tags: ['b2c2-linea-b', 'plantilla:aviso-v1.2', 'genero:sms-servicio'],
  data: {
    mediationType: 'relay', sourceLang: 'pt', targetLang: 'es',
    audience: 'tu suegra española, de visita larga — la receta es suya',
    wordRange: { min: 25, max: 60 },
    sourceText: 'SNS: a sua receita renovada já está disponível. Pode levantá-la na receção do Centro de Saúde da Alameda, das 8h às 18h, apresentando o cartão de utente. Validade da receita: 60 dias.',
    rubric: [
      '¿Traslada el objeto (su receta renovada, lista)?',
      '¿Traslada lugar y franja (recepción del Centro de Salud de la Alameda, de 8 a 18, con la tarjeta de usuaria)?',
      '¿Traslada la validez (60 días)?',
      '¿Español natural, sin lusismos («levantar», «cartão de utente» resuelto), entre 25 y 60 palabras?',
    ],
    modelAnswer: 'Ya está lista tu receta renovada. Se recoge en la recepción del Centro de Salud de la Alameda, de ocho a seis.',
  },
};

// Tipos y direcciones distintas: nada que ver.
const MED_96: MedIndexable = {
  id: 'b2c2-med-96', register: 'informal', address: 'tu', tags: [],
  data: {
    mediationType: 'synthesise_sources', sourceLang: 'pt', targetLang: 'pt',
    sourceRef: 'junqueiro-a-rapariguinha-e-os-phosphoros+junqueiro-o-valente-soldado-de-chumbo',
    audience: 'um amigo teu, português, que não leu nenhum dos dois',
    wordRange: { min: 75, max: 125 },
    sourceText: 'Que frio! a neve cahia, e a noite aproximava-se…',
    rubric: ['¿Recoge la cerillera: vende fósforos descalza la última noche del año?'],
    modelAnswer: 'São dois contos que acabam no lume, mas o lume não diz o mesmo.',
  },
};

describe('enmascarar: los huecos variables de la plantilla', () => {
  it('borra números, horas, precios, fechas y nombres propios, y deja el esqueleto', () => {
    const a = enmascarar('El jueves 11, de 9h a 13h, los técnicos del gas visitan el piso; llama al 210 340 500.');
    const b = enmascarar('El martes 23, de 8h a 12h, los técnicos del gas visitan el piso; llama al 216 999 000.');
    // Dos avisos con los MISMOS huecos y distinto relleno colapsan al mismo esqueleto.
    expect(a).toBe(b);
  });

  it('NO borra el léxico que distingue un aviso de otro', () => {
    const receta = enmascarar('a sua receita renovada já está disponível');
    const piscina = enmascarar('a piscina municipal encerra para manutenção');
    expect(receta).not.toBe(piscina);
  });
});

describe('firmaRubrica: la rúbrica calcada casilla a casilla', () => {
  it('reconoce dos rúbricas con el mismo molde y distintos valores', () => {
    const f1 = firmaRubrica(MED_38.data.rubric);
    const f2 = firmaRubrica(MED_53_V1.data.rubric);
    expect(f1).toEqual(f2);
  });

  it('distingue rúbricas de operaciones distintas', () => {
    expect(firmaRubrica(MED_64.data.rubric)).not.toEqual(firmaRubrica(MED_96.data.rubric));
  });
});

describe('similitudMolde: los tres clones reales', () => {
  it('MED-53 v1 ↔ med-38 (el clon que el IDF no vio: 0 pares)', () => {
    const r = similitudMolde(MED_53_V1, MED_38);
    expect(r.score).toBeGreaterThanOrEqual(UMBRAL_MOLDE);
    expect(r.motivos).toContain('rubrica-calcada');
    expect(r.motivos).toContain('tupla-de-clase-identica');
  });

  // La decisión del gate es por reglas combinadas, no por la media
  // ponderada: este par tiene el esqueleto clonado pero la rúbrica sólo
  // a medias, así que su score queda por debajo del umbral y aun así ES
  // un clon. Comprobamos la decisión (esHallazgo), que es lo que se
  // reporta, y el motivo concreto.
  it('MED-108 v1 ↔ med-64 (el que el IDF sólo rozó a 0,373)', () => {
    const r = similitudMolde(MED_108_V1, MED_64);
    expect(r.esHallazgo).toBe(true);
    expect(r.motivos).toContain('esqueleto-compartido');
    expect(r.motivos).toContain('clon-de-esqueleto');
  });

  it('MED-133 ⊂ MED-132: compartir FUENTE es hallazgo aunque el molde difiera', () => {
    const r = similitudMolde(MED_133, MED_132);
    expect(r.motivos).toContain('fuente-compartida');
    expect(r.esHallazgo).toBe(true);
  });
});

describe('similitudMolde: lo que NO puede marcar', () => {
  it('dos avisos de la misma plantilla industrial con género y datos distintos', () => {
    const r = similitudMolde(MED_113, MED_64);
    expect(r.esHallazgo).toBe(false);
  });

  it('tipos, direcciones y operaciones distintas', () => {
    const r = similitudMolde(MED_96, MED_38);
    expect(r.esHallazgo).toBe(false);
  });

  it('un ítem contra sí mismo no se reporta como par', () => {
    const pares = buscarClonesMolde([MED_38], [MED_38]);
    expect(pares).toHaveLength(0);
  });
});

describe('buscarClonesMolde: el barrido', () => {
  it('encuentra el clon dentro de un corpus con ruido y lo ordena por score', () => {
    const corpus = [MED_38, MED_64, MED_96, MED_113];
    const pares = buscarClonesMolde(corpus, [MED_53_V1]);
    expect(pares.length).toBeGreaterThan(0);
    expect(pares[0]!.contra).toBe('b2c2-med-38');
  });

  it('no inventa pares cuando el candidato es genuinamente nuevo', () => {
    const nuevo: MedIndexable = {
      id: 'NUEVO', register: 'formal', address: 'V_Exa', tags: [],
      data: {
        mediationType: 'reformulate_register', sourceLang: 'pt', targetLang: 'pt',
        audience: 'a Câmara Municipal, no formulário de reclamações',
        wordRange: { min: 55, max: 95 },
        sourceText: 'Ó pá, isto assim não dá: o candeeiro está fundido há três semanas.',
        rubric: ['¿Conserva los hechos y elimina el desahogo?', '¿Cierra con fórmula de cortesía?'],
        modelAnswer: 'Exmos. Senhores: venho por este meio expor…',
      },
    };
    expect(buscarClonesMolde([MED_38, MED_64, MED_96, MED_113], [nuevo])).toHaveLength(0);
  });
});
