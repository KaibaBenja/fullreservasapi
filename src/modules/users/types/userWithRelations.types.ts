import { IMembershipWithPlan } from "../../memberships/types/membershipWithPlan.types";
import { IRole } from "./roles.types";
import { IUser } from "./users.types";

export interface IUserWithRelations extends Omit<IUser, 'id'> {
  id: Buffer;
  created_at?: Date;
  updated_at?: Date;
  roles?: IRole[];
  membership?: IMembershipWithPlan;
};