import Joi from '@hapi/joi';
import { UserRepository } from '../repository/user';
import { User } from '../entity/user';
import { USER_ERROR_MESSAGE } from './err.msg';
import { UserError } from '../utils/error';
import { TokenPayload } from 'google-auth-library';

export interface BritaTokenPayload extends TokenPayload {
  name: string;
  email: string;
  profile_pic: string;
}

export class UserService {
  private static readonly CREATE_SCHEMA = Joi.object().keys({
    email: Joi.string().error(new Error(USER_ERROR_MESSAGE.EMAIL_IS_STRING))
      .required().error(new Error(USER_ERROR_MESSAGE.EMAIL_IS_REQUIRED))
      .email().error(new Error(USER_ERROR_MESSAGE.EMAIL_IS_EMAIL)),
  });

  public constructor(
    private readonly repository: UserRepository,
  ) { }

  /**
   * Get all administrator from the data source
   */
  public find = async (): Promise<User[]> => {
    return await this.repository.findAll();
  }

  public create = async (
    params: any,
    auth: BritaTokenPayload,
  ): Promise<User> => {
    const validation = UserService.CREATE_SCHEMA.validate(params);

    if (validation.error) {
      throw new UserError(validation.error.message);
    }

    const user = await this.repository.findByEmail(auth.email);

    if (!user?.isActive) {
      throw new UserError(USER_ERROR_MESSAGE.USER_ACTIVE_ONLY);
    }

    if (!user?.isRoot) {
      throw new UserError(USER_ERROR_MESSAGE.CREATE_ONLY_ROOT);
    }

    const insertResult = await this.repository.create(params.email);

    if (!insertResult) {
      throw new UserError(USER_ERROR_MESSAGE.EMAIL_ALREADY_EXIST);
    }

    return insertResult;
  }

  public delete = async (
    id: number,
    auth: BritaTokenPayload,
  ): Promise<boolean> => {
    const targetUser = await this.repository.findById(id);

    if (!targetUser) {
      return false;
    }

    if (targetUser.isRoot) {
      throw new UserError(USER_ERROR_MESSAGE.ADMINISTRATOR_IS_ROOT);
    }

    const user = await this.repository.findByEmail(auth.email);

    if (!user?.isActive) {
      throw new UserError(USER_ERROR_MESSAGE.USER_ACTIVE_ONLY);
    }

    if (!user?.isRoot) {
      throw new UserError(USER_ERROR_MESSAGE.DELETE_ONLY_ROOT);
    }

    return await this.repository.delete(id);
  }

  public activateAccount = async (
    params: BritaTokenPayload,
  ): Promise<boolean> => {
    const administrator = await this.repository.findByEmail(params.email);

    if (!administrator) {
      throw new UserError(USER_ERROR_MESSAGE.EMAIL_GOOGLE_NOT_EXIST);
    }

    if (administrator.isActive) {
      return true;
    }

    return await this.repository.update({
      id: administrator.id,
      name: params.name,
      profilePic: params.profile_pic,
      isActive: true,
    } as User);
  }
}
