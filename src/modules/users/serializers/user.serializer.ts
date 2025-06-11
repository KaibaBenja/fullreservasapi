import { IUserWithRelations } from "../types/userWithRelations.types";

export function serializeUser(user: IUserWithRelations) {
  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    ... (user.password && {
      password: user.password,
    }),
    passwordChanged: user.passwordChanged,
    created_at: user.created_at,
    updated_at: user.updated_at,
    roles: user.roles?.map(role => role.name),
    ...(user.membership && {
      membership: {
        tier: user.membership.tier,
        status: user.membership.status,
        expire_date: user.membership.expire_date,
        created_at: user.membership.created_at,
        updated_at: user.membership.updated_at,
        membership_plan: user.membership.membership_plan,
      },
    }),
  };
}

export function serializeUsers(users: IUserWithRelations[]) {
  return users.map(serializeUser);
}