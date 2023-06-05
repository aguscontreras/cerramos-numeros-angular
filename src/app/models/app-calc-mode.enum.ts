/**
 * Nivel de detalle de manejo de los datos
 */
export enum DetailLevel {
  /**
   * - miembro y monto
   * - se reparte de forma igualitaria
   */
  BASIC,

  /**
   * - miembro, categorias y monto por categoria
   * - se reparte de forma igualitaria
   */
  MID,

  /**
   * - miembro, categorias y monto por categoria, y categorias
   *   en las cuales se incluye el miembro para los calculos finales
   * - se reparte segun categorias
   */
  HIGH,
}
