import { gql } from '@apollo/client';

export const LOGIN = gql`
  query Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export const SIGNUP = gql`
  mutation Signup(
    $email: String!
    $password: String!
    $firstName: String
    $lastName: String
  ) {
    signup(
      email: $email
      password: $password
      first_name: $firstName
      last_name: $lastName
    ) {
      id
      email
      first_name
      last_name
      picture_url
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    get_me {
      id
      email
      first_name
      last_name
      picture_url
      created_at
      updated_at
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile(
    $firstName: String!
    $lastName: String!
    $setProfilePictureNull: Boolean
  ) {
    update_user_profile(
      first_name: $firstName
      last_name: $lastName
      set_profile_picture_null: $setProfilePictureNull
    ) {
      id
      email
      first_name
      last_name
      picture_url
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    change_password(
      current_password: $currentPassword
      new_password: $newPassword
    )
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($email: String!) {
    forgot_password(email: $email)
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    reset_password(token: $token, new_password: $newPassword)
  }
`;
