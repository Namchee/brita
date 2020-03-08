/**
 * A class which represents single Entity
 *
 * Mostly just a POJO
 */
export interface Entity {
  /**
   * Identifier for an entity
   *
   * Must be unique per entity to differentiate
   * it from other entity
   */
  id: string;
}
