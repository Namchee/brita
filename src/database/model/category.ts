import { EntitySchema, EntitySchemaColumnOptions } from 'typeorm';
import { Category } from '../../entity/category';

/**
 * TypeORM base schema for Category entity
 */
const baseSchema = {
  id: {
    type: Number,
    primary: true,
    generated: true,
    nullable: false,
  } as EntitySchemaColumnOptions,
  name: {
    type: String,
    nullable: false,
    unique: true,
    length: 25,
  } as EntitySchemaColumnOptions,
  desc: {
    type: String,
    nullable: false,
    length: 100,
  } as EntitySchemaColumnOptions,
};

/**
 * TypeORM entity schema for Category entity
 */
export const CategoryEntity = new EntitySchema<Category>({
  name: 'category',
  tableName: 'category',
  columns: {
    ...baseSchema,
  },
});

/**
 * TypeORM entity schema for Category VIEW, which includes COUNT
 * on it
 */
export const CategoryWithCount = new EntitySchema<Category>({
  name: 'category_with_count',
  tableName: 'category_with_count',
  columns: {
    ...baseSchema,
    announcementCount: {
      type: Number,
      name: 'announcement_count',
    },
  },
});
