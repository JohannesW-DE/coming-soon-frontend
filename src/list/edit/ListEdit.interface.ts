

export interface IUpdateListDetailsVars {
  id: string;
  name: string;
  description: string;
  url: string;
  isPublic: boolean;
}

export interface IUpdateListDetails {
  updateListDetails: boolean;
}

export interface ICreateListVars {
  name: string;
  description: string;
  url: string;
  isPublic: boolean;
}

export interface ICreateList {
  createList: string;
}

export interface IDeleteListVars {
  id: string;
}

export interface IDeleteList {
  deleteList: boolean;
}
