import { Entity } from 'entity/base';

/**
 * An interface which represents single Category entity
 */
export interface Category extends Entity {
  /**
   * Name of the Category
   *
   * It is used as user-identifier for categories
   */
  name: string;
  /**
   * Description of the Category
   *
   * It is used to quickly determine what the category is about
   */
  desc: string;
  /**
   * The number of announcements which satisfies the category
   */
  announcementCount?: number;
}
