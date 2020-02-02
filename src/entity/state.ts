import { Entity } from './base';

/**
 * An interface which represents single user state
 */
export interface State extends Entity {
  /**
   * User's ID, derived from LINE ID. Must be unique per entity
   * to differentiate it from other user's state
   */
  id: string;
  /**
   * Service identifier. Derived from service's `identifier`
   */
  service: string;
  /**
   * Service state. Describes the curent progress of request flow
   */
  state: number;
  /**
   * Accumulated user text
   */
  text: string;
  /**
   * Miscellanous object needed by particular services,
   * Useful for caching data
   */
  misc?: Map<string, any>;
}
