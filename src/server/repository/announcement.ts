import {
  EntityRepository as BaseEntityRepository,
  EntityManager,
  Repository as BaseRepository,
} from 'typeorm';
import { Announcement } from 'entity/announcement';
import { TypeORMRepository, EntityRepository } from 'repository/base';
import { Category } from 'entity/category';
import { AnnouncementEntity } from 'model/announcement';

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
   * @return {Announcement[]} Array of announcements
   */
  findByCategory(category: Category): Promise<Announcement[]>;
  /**
   * Creates a new Announcement and save it in the database
   *
   * @param {string} title Announcement's title
   * @param {string} content Announcement's content
   * @param {Date} date Announcement's date
   * @param {boolean} important Announcement's importance
   * @param {Category[]} categories Announcement's categories
   * @return {Promise<Announcement>} The newly created Announcement
   */
  create(
    title: string,
    content: string,
    date: Date,
    important: boolean,
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
        'announcement.important',
        'categories.id',
        'categories.name',
      ])
      .getMany();
  }

  /**
   * Get all announcements which satisfies the requested category
   *
   * @param {Category} category Requested category
   * @return {Promise<Announcement[]>} Announcement array, which
   * satisfies the requested category
   */
  public findByCategory = async (
    category: Category,
  ): Promise<Announcement[]> => {
    return await this.repository
      .createQueryBuilder('announcement')
      .innerJoin(
        'announcement.categories',
        'categories',
        'categories.id = :id', { id: category.id })
      .select([
        'announcement.title',
        'announcement.content',
        'announcement.validUntil',
        'announcement.important',
      ])
      .getMany();
  }

  /**
   * Creates a new Announcement and save it in the database
   *
   * @param {string} title Announcement's title
   * @param {string} content Announcement's content
   * @param {Date} validUntil Announcement's date
   * @param {boolean} important Announcement's importance
   * @param {Category[]} categories Announcement's categories
   * @return {Promise<Announcement>} The newly created Announcement
   */
  public create = async (
    title: string,
    content: string,
    validUntil: Date,
    important: boolean,
    categories: Category[],
  ): Promise<Announcement | null> => {
    return await this.repository.save({
      title,
      content,
      validUntil,
      important,
      categories,
    });
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
      important,
      categories,
    }: Announcement,
  ): Promise<boolean> => {
    const updateResult = await this.repository.update(
      id,
      {
        title,
        content,
        validUntil,
        important,
        categories,
      },
    );

    return !!updateResult.affected;
  }
}
