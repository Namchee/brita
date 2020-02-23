import {
  EntityRepository as BaseEntityRepository,
  EntityManager,
  Repository as BaseRepository,
} from 'typeorm';
import { Announcement } from './../entity/announcement';
import { TypeORMRepository, EntityRepository, PagingOptions } from './base';
import { Category } from './../entity/category';
import { AnnouncementEntity } from './../database/model/announcement';

/**
 * Interface for Announcement repository
 *
 * Any concrete Announcement repository implementation MUST
 * implement this interface (including mocked one)
 */
export interface AnnouncementRepository
  extends EntityRepository<Announcement> {
  /**
   * Get all Announcement which satisfies the requested category
   *
   * @param {Category} category Category criterion
   * @param {PagingOptions=} options Options for pagination purposes
   * @return {Announcement[]} Array of announcements
   */
  findByCategory(
    category: Category,
    options?: PagingOptions,
  ): Promise<Announcement[]>;
  /**
   * Creates a new Announcement and save it in the database
   *
   * @param {string} title Announcement's title
   * @param {string} content Announcement's content
   * @param {Date} date Announcement's date
   * @param {Category[]} categories Announcement's categories
   * @return {Promise<Announcement>} The newly created Announcement
   * or `null` if duplicate properties exists
   */
  create(
    title: string,
    content: string,
    date: Date,
    categories: Category[],
  ): Promise<Announcement | null>;
}

/**
 * Announcement repository implemented with typeorm
 *
 * It abstracts database access for Announcements from complex queries
 */
@BaseEntityRepository(AnnouncementEntity)
export class AnnouncementRepositoryTypeORM
  extends TypeORMRepository<Announcement>
  implements AnnouncementRepository {
  public constructor(manager: EntityManager) {
    super(manager);
  }

  protected get repository(): BaseRepository<Announcement> {
    return this.manager.getRepository(AnnouncementEntity);
  }

  /**
   * Get all announcement from the database
   *
   * @return {Promise<Announcement[]>} Announcement array
   */
  public findAll = async (): Promise<Announcement[]> => {
    return await this.repository
      .createQueryBuilder('announcement')
      .innerJoinAndSelect(
        'announcement.categories',
        'categories',
      )
      .select([
        'announcement.title',
        'announcement.content',
        'announcement.validUntil',
        'categories.id',
        'categories.name',
      ])
      .getMany();
  }

  /**
   * Get all announcements which satisfies the requested category
   *
   * @param {Category} category Requested category
   * @param {number=} limit Announcement amount limit
   * @return {Promise<Announcement[]>} Announcement array, which
   * satisfies the requested category
   */
  public findByCategory = async (
    category: Category,
    options?: PagingOptions,
  ): Promise<Announcement[]> => {
    return await this.repository
      .createQueryBuilder('announcement')
      .innerJoin(
        'announcement.categories',
        'categories',
        'categories.id = :id', { id: category.id })
      .where('announcement.valid_until')
      .select([
        'announcement.title',
        'announcement.content',
        'announcement.validUntil',
      ])
      .limit(options?.limit)
      .offset(options?.offset)
      .getMany();
  }

  /**
   * Creates a new Announcement and save it in the database
   *
   * @param {string} title Announcement's title
   * @param {string} content Announcement's content
   * @param {Date} validUntil Announcement's date
   * @param {Category[]} categories Announcement's categories
   * @return {Promise<Announcement>} The newly created Announcement
   * or `null` if duplicate property exists
   */
  public create = async (
    title: string,
    content: string,
    validUntil: Date,
    categories: Category[],
  ): Promise<Announcement | null> => {
    try {
      const insertResult = await this.repository.insert({
        title,
        content,
        validUntil,
        categories,
      });

      return (insertResult.generatedMaps[0]) as Announcement;
    } catch (err) {
      return null; // hopefully, dupes issues
    }
  }

  /**
   * Deletes an announcement from the database
   *
   * @param {string} id ID of target announcement
   * @return {Promise<boolean>} `true` if deletion is successful,
   * `false` otherwise
   */
  public delete = async (id: string): Promise<boolean> => {
    const deleteResult = await this.repository.delete({ id });

    return !!deleteResult.affected;
  }

  /**
   * Updates an announcement with given arguments
   *
   * @param {Announcement} obj Announcement object
   * @return {Promise<boolean>} `true` if update is successful,
   * `false` otherwise
   */
  public update = async (
    {
      id,
      title,
      content,
      validUntil,
      categories,
    }: Announcement,
  ): Promise<boolean> => {
    const updateResult = await this.repository.update(
      id,
      {
        title,
        content,
        validUntil,
        categories,
      },
    );

    return !!updateResult.affected;
  }
}
