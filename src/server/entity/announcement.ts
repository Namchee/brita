import { Entity } from './base';
import { Category } from './category';

/**
 * An interface which represents single Announcement entity
 */
export interface Announcement extends Entity {
  id: number;
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
   * Announcement expiration date
   *
   * Always store this on UTC timezone
   */
  validUntil: Date;
  /**
   * Categories of the Announcement
   */
  categories?: Category[];
}
