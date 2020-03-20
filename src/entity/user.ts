import { Entity } from './base';

export interface User extends Entity {
  id: number;
  name: string;
  email: string;
  profilePic: string;
  isActive: boolean;
  isRoot: boolean;
}
