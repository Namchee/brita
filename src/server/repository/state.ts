import { RedisClient } from 'redis';
import { Repository } from './base';
import { State } from './../entity/state';
import config from './../config/env';

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

/**
 * State repository implemented with redis
 */
export class StateRepositoryRedis implements StateRepository {
  private readonly client: RedisClient;

  /**
   * Constructor for StateRepositoryRedis
   *
   * @param {RedisClient} client Redis client object
   */
  public constructor(client: RedisClient) {
    this.client = client;
  }

  /**
   * Finds a user state by its ID
   *
   * @param {string} id User's ID
   * @return {Promise<State | null>} User's state if it exists,
   * `null` otherwise
   */
  public findById = (id: string): Promise<State | null> => {
    return new Promise((resolve) => {
      this.client.get(id, (err, res: string) => {
        if (err || res.length === 0) {
          return null;
        }

        return resolve({
          id,
          ...JSON.parse(res),
        });
      });
    });
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
    if (await this.findById(id)) {
      return false;
    }

    const stateData = {
      service,
      state,
      text,
      misc,
    };

    return this.client.setex(
      id,
      config.expirationTime,
      JSON.stringify(stateData),
    );
  }

  /**
   * Deletes a user's state from database
   *
   * @param {string} id User's ID
   * @return {Promise<boolean>} `true` if deletion completed
   * successfully, `false` otherwise (e.g: It doens't exist)
   */
  public delete = async (id: string): Promise<boolean> => {
    if (!(await this.findById(id))) {
      return false;
    }

    return this.client.del(id);
  }

  /**
   * Updates a user's state in the database
   *
   * @param {State} state User's state
   * @return {Promise<boolean>} `true` if update completed
   * successfully, `false` otherwise
   */
  public update = async (state: State): Promise<boolean> => {
    if (!(await this.findById(state.id))) {
      return false;
    }

    const stateData = { ...state };
    delete stateData.id;

    return this.client.setex(
      state.id,
      config.expirationTime,
      JSON.stringify(stateData),
    );
  }
}
