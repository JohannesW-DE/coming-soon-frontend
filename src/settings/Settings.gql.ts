import { gql } from '@apollo/client';

export const GQL_MUTATION_UPDATE_ACCOUNT = gql`
  mutation UpdateAccount($username: String, $settings: [SettingInput]) {
    updateAccount(username: $username, settings: $settings)
  }
`;

export const GQL_MUTATION_DELETE_ACCOUNT = gql`
  mutation DeleteAccount {
    deleteAccount
  }
`;
