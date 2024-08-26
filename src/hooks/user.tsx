import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '../context/client';
import { UC_AUTH_API_PREFIX } from '../utils/constants';
const jwtDecode = require('jwt-decode');

interface LoginResponse {
  access_token: string;
}

export interface UserInterface {
  id: string;
  userName: string;
  displayName: string;
}

export function useLoginWithToken() {
  return useMutation<LoginResponse, Error, string>({
    mutationFn: async (idToken) => {
      const params = {
        grantType: 'urn:ietf:params:oauth:grant-type:token-exchange',
        requestedTokenType: 'urn:ietf:params:oauth:token-type:access_token',
        subjectTokenType: 'urn:ietf:params:oauth:token-type:id_token',
        subjectToken: idToken,
      };

      return apiClient
        .post(`/auth/tokens`, JSON.stringify(params), {
          baseURL: `${UC_AUTH_API_PREFIX}`,
        })
        .then((response) => response.data)
        .catch((e) => {
          throw new Error(e.response?.data?.message || 'Failed to log in');
        });
    },
  });
}

export function useGetCurrentUser(access_token: string) {
  return useQuery<UserInterface>({
    queryKey: ['getUser', access_token],
    queryFn: async () => {
      const decoded = jwtDecode.jwtDecode(access_token);
      const email = decoded.email;
      return (
        apiClient
          //todo We can use this endpoint for now but we should create a new endpoint on the backend after repo is
          //     merged. The new endpoint should just take the token without decoding
          .get(`/scim2/Users`, {
            baseURL: `${UC_AUTH_API_PREFIX}`,
            params: { filter: `userName eq "${email}"` },
          })
          .then((response) => response.data)
          .catch((e) => {
            throw new Error('Failed to fetch user');
          })
      );
    },
  });
}
