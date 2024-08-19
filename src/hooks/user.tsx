import { useMutation } from '@tanstack/react-query';
import apiClient from '../context/client';
import { UC_AUTH_API_PREFIX } from '../utils/constants';

interface LoginResponse {
  access_token: string;
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
