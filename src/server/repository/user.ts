import {
  EntityRepository,
  EntityManager,
  Repository as BaseRepository,
} from 'typeorm';
import { UserEntity } from '../database/model/user';
import { TypeORMRepository, Repository } from './base';
import { User } from '../entity/user';

export interface UserRepository extends Repository<User> {
  exist(email: string): Promise<boolean>;
  findById(id: number): Promise<User | null>;
  findAll(): Promise<User[]>;
  findByEmail(email: string): Promise<User | null>;
  create(email: string): Promise<User | null>;
  update(entity: User): Promise<boolean>;
}

@EntityRepository(UserEntity)
export class UserRepositoryTypeORM
  extends TypeORMRepository<User>
  implements UserRepository {
  public constructor(manager: EntityManager) {
    super(manager);
  }

  protected get repository(): BaseRepository<User> {
    return this.manager.getRepository(UserEntity);
  }

  public exist = async (email: string): Promise<boolean> => {
    const admin = await this.repository.findOne({ email });

    return !!admin;
  }

  public findAll = async (): Promise<User[]> => {
    return await this.repository.find();
  }

  public findById = async (id: number): Promise<User | null> => {
    const administrator = await this.repository.findOne(id);

    return administrator || null;
  }

  public findByEmail = async (email: string): Promise<User | null> => {
    const administrator = await this.repository.findOne({ email });

    return administrator || null;
  }

  public create = async (email: string): Promise<User | null> => {
    try {
      const insertResult = await this.repository.insert({
        email,
        isRoot: false,
        isActive: false,
      });

      return insertResult.generatedMaps[0] as User;
    } catch (err) {
      return null;
    }
  }

  public delete = async (id: number): Promise<boolean> => {
    const deleteResult = await this.repository.delete(id);

    return !!deleteResult.affected;
  }

  public update = async (
    {
      id,
      name,
      profilePic,
      isActive,
    }: User,
  ): Promise<boolean> => {
    const updateResult = await this.repository.update(
      id,
      {
        name,
        profilePic,
        isActive,
      },
    );

    return !!updateResult.affected;
  }
}
