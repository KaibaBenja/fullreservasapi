import { IMemberships } from "./memberships.types";
import { IMembershipsPlans } from "./membershipsPlans.types";

export interface IMembershipWithPlan extends IMemberships{
  created_at?: Date;
  updated_at?: Date;
  membership_plan?: IMembershipsPlans;
}