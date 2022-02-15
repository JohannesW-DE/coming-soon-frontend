export interface ISetting {
  key: string;
  value?: string;
  values?: string[];
}

export interface IMutationUpdateAccount {
  updateAccount: boolean;
}

export interface IMutationUpdateAccountVars {
  username: string;
  settings: ISetting[];
}

export interface IMutationDeleteAccount {
  deleteAccount: boolean;
}

export interface IMutationDeleteAccountVars {}
