import { Entity } from './base';
import { Category } from './category';

/**
 * An interface which represents single Announcement entity
 */
export interface Announcement extends Entity {
  /**
   * Title for the Announcement
   *
   * It is used for searching for management purposes
   */
  title: string;
  /**
   * Content for the Announcement
   *
   * It defines what the Announcement about
   */
  contents: string;
  /**
   * Announcement expiration Date
   *
   * An Announcement will be deleted if passed this value
   */
  validUntil: Date;
  /**
   * The importance of the Announcement
   *
   * If an Announcement is important, it will be prioritized
   * when requested even if the expiration date is longer
   */
  important: boolean;
  /**
   * Categories of the Announcement
   */
  categories?: Category[];
}
