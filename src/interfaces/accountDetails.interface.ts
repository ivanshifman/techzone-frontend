import { Action, State, User } from "../types/context.types";

export interface IAccountDetailsProps {
  user: User;
  dispatch: React.Dispatch<Action>;
  token: string | null;
  state: State;
}

export interface FormValues {
  name: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
