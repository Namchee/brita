import { Repository, TypeORMRepository } from './base';
import { State } from '../entity/state';
import {
  EntityRepository,
  EntityManager,
  Repository as BaseRepository,
} from 'typeorm';
import { StateEntity } from '../database/model/state';
import { ServerError } from '../utils/error';

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
   * @return {Promise<State>} User's state, or `null` if not found
   */
  findById(id: string): Promise<State | null>;
  /**
   * Creates a new user state and insert it into the database
   * @param {string} id User's ID
   * @param {string} service Service identifier
   * @param {number} state Service's state
   * @param {string} text Accumulated user request text
   * @return {Promise<boolean>} `true` if insertion is successful,
   * `false` otherwise
   */
  create(
    id: string,
    service: string,
    state: number,
    text: string,
  ): Promise<boolean>;
}

@EntityRepository(StateEntity)
export class StateRepositoryTypeORM extends TypeORMRepository<State>
  implements StateRepository {
  public constructor(manager: EntityManager) {
    super(manager);
  }

  /**
   * Get the default typeORM repository for state entity
   *
   * @return {BaseRepository<State>} Default typeORM repository for
   * state entity
   */
  protected get repository(): BaseRepository<State> {
    return this.manager.getRepository(StateEntity);
  }

  /**
   * Get a state based on user's id.
   *
   * As id is unique, it will only return one unique state
   *
   * @param {string} id User's ID
   * @return {Promise<State>} User's state, or `null` if not found
   */
  public findById = async (id: string): Promise<State | null> => {
    const state = await this.repository
      .createQueryBuilder('state')
      .where('id = :id', { id })
      .getOne();

    return state ? state : null;
  }

  /**
   * Creates a new user state and insert it into the database
   * @param {string} id User's ID
   * @param {string} service Service identifier
   * @param {number} state Service's state
   * @param {string} text Accumulated user request text
   * @return {Promise<boolean>} `true` if insertion is successful,
   * `false` otherwise
   */
  public create = async (
    id: string,
    service: string,
    state: number,
    text: string,
  ): Promise<boolean> => {
    const exist = await this.repository.count({ id });

    if (exist > 0) {
      throw new ServerError('User state already exist');
    }

    const insertionResult = await this.repository.save({
      id,
      service,
      state,
      text,
    });

    return !!insertionResult;
  }

  /**
   * Deletes a user's state from the database
   *
   * Usually, a user's state is deleted when the state identifier
   * from service result is zero
   *
   * @param {string} id User's ID
   * @return {Promise<boolean>} `true` if deletion is successful
   * `false` otherwise
   */
  public delete = async (id: string): Promise<boolean> => {
    const deleteResult = await this.repository.delete({ id });

    return !!deleteResult.affected;
  }

  /**
   * Updates a user's state with given parameters
   *
   * The service identifier is NOT updated, as you cannot do it
   * before finishing the current request or expire it
   * @param {State} obj State object
   * @return {Promise<boolean>} `true` if update is successful,
   * `false` otherwise
   */
  public update = async (
    {
      id,
      state,
      text,
    }: State,
  ): Promise<boolean> => {
    const updateResult = await this.repository.update(
      { id },
      {
        state,
        text,
      },
    );

    return !!updateResult.affected;
  }
}
