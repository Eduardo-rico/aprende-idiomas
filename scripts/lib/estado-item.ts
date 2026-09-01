// scripts/lib/estado-item.ts — QUÉ significa cada estado de un ítem.
// Una definición, un sitio.
//
// Existe porque `sellado()` llegó a significar tres cosas distintas en
// tres scripts a la vez: `cuarentena-excedente.ts` daba por sellado a
// todo el que tuviera `variantVerificacion` —y las colas 1-2 lo tienen
// aunque su dictamen no cubría variante—, mientras `sellar-familia-a.ts`
// acababa de decidir NO sellarlas. Un script mandaba a cuarentena lo que
// otro contaba como cobertura, y el corpus quedaba a merced de cuál
// corriera primero.
//
// Es la cuarta vez esta semana que un concepto con nombre y sin
// definición única muerde: el piso cero guardado por `cuenta.has`, la
// cuarentena que no se descontaba, el padre cubierto que no llegaba a los
// puntos vacíos, y esto. La contramedida no es recordar: es que sólo haya
// un sitio donde escribirlo, y un test que impida abrir un segundo.

/** Lo que el alumno puede ver. `needs-human` está filtrado en el embudo
 *  de `lib/data/loaders.ts`, así que ni se sirve ni cuenta como
 *  cobertura. */
export const servibleAlAlumno = (x: any) => x?.variantStatus !== 'needs-human';

/** SELLADO: alguien —humano o calibración— respondió a la pregunta de
 *  variante. Es el ESTADO, no el rastro: tener `variantVerificacion`
 *  significa «hay algo escrito sobre este ítem», que no es lo mismo.
 *
 *  `divergent` cuenta: está verificado como divergencia real, con su
 *  override. `neutral` cuenta: sin divergencia, por dictamen o por
 *  calibración, y `variantVerificacion` distingue por cuál de las dos. */
export const selladoDeVariante = (x: any) =>
  x?.variantStatus === 'neutral' || x?.variantStatus === 'divergent';

/** ESCUCHA va por su propia vía: sus ítems esperan que Edu confirme a
 *  oído que la voz realiza el rasgo europeo, no un dictamen de cola. Ni
 *  se sellan por construcción ni se cuarentenan por excedente. */
export const esDeEscucha = (x: any) => /par mínimo|Escucha/i.test(String(x?.variantVerificacion ?? ''));

/** EN CUARENTENA: retirado de servicio, con su motivo escrito. */
export const enCuarentena = (x: any) => x?.variantStatus === 'needs-human';
