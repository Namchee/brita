import { Repository } from './base';
import { State } from './../entity/state';

/**
 * An interface which describes state repository behavior
 *
 * Any concrete state repository implementation must implement
 * this interface
 */
export interface StateRepository extends Repository<State> {
  /**
   * Get a state based on user's id.
   *
   * As id is unique, it will only return one unique state
   *
   * @param {string} id User's ID
   * @return {Promise<State | null>} User's state, or `null` if not found
   */
  findById(id: string): Promise<State | null>;
  /**
   * Creates a new user state and insert it into the database
   * @param {string} id User's ID
   * @param {string} service Service identifier
   * @param {number} state Service's state
   * @param {string} text Accumulated user request text
   * @param {Map<string, any> =} misc Miscellanous data for services
   * @return {Promise<boolean>} `true` if insertion is successful,
   * `false` otherwise
   */
  create(
    id: string,
    service: string,
    state: number,
    text: string,
    misc?: Map<string, any>,
  ): Promise<boolean>;
}

export class StateRepositoryVolatile implements StateRepository {
  private readonly stateContainer: Map<string, State>;

  /**
   * Constructor for in-memory state repository
   */
  public constructor() {
    this.stateContainer = new Map();
  }

  /**
   * Finds a user state by its ID
   *
   * @param {string} id User's ID
   * @return {Promise<State | null>} User's state if it exists,
   * `null` otherwise
   */
  public findById = async (id: string): Promise<State | null> => {
    const state = this.stateContainer.get(id);

    return state || null;
  }

  /**
   * Creates a new user state in database
   *
   * @param {string} id User's ID
   * @param {string} service Service identifier
   * @param {number} state State number
   * @param {string} text Accumulated text
   * @param {Map<string, any> =} misc Miscellanous data
   * @return {Promise<boolean>} `true` if insertion successful,
   * `false` otherwise (e.g: It already exist)
   */
  public create = async (
    id: string,
    service: string,
    state: number,
    text: string,
    misc?: Map<string, any>,
  ): Promise<boolean> => {
    if (this.stateContainer.has(id)) {
      return false;
    }

    this.stateContainer.set(
      id,
      { id, service, state, text, misc },
    );

    return this.stateContainer.has(id);
  }

  /**
   * Deletes a user's state from database
   *
   * @param {string} id User's ID
   * @return {Promise<boolean>} `true` if deletion completed
   * successfully, `false` otherwise
   */
  public delete = async (id: string): Promise<boolean> => {
    return this.stateContainer.delete(id);
  }

  /**
   * Updates a user's state in the database
   *
   * @param {State} state User's state
   * @return {Promise<boolean>} `true` if update completed
   * successfully, `false` otherwise
   */
  public update = async (state: State): Promise<boolean> => {
    if (!this.stateContainer.has(state.id)) {
      return false;
    }

    this.stateContainer.set(state.id, state);

    return true;
  }
}
