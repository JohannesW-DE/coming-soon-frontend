import { gql } from "@apollo/client";

export const GQL_MUTATION_UPDATE_LIST_DETAILS = gql`
  mutation UpdateListDetails($id: ID!, $name: String, $description: String, $isPublic: Boolean, $url: String) {
    updateListDetails(id: $id, name: $name, description: $description, isPublic: $isPublic, url: $url)
  }
`;

export const GQL_MUTATION_CREATE_LIST = gql`
  mutation CreateList($name: String!, $description: String, $isPublic: Boolean, $url: String) {
    createList(name: $name, description: $description, isPublic: $isPublic, url: $url)
  }
`;

export const GQL_MUTATION_DELETE_LIST = gql`
  mutation DeleteList($id: ID!) {
    deleteList(id: $id)
  }
`;

