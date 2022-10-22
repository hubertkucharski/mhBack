import {User} from "../../src/user/user.entity";

export type ValidateSessionUserResponse = {
  user: User | null;
  status: number;
};
