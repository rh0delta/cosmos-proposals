import { useChain } from '@cosmos-kit/react';
import {
  useRpcEndpoint,
  useRpcClient,
  createRpcQueryHooks,
} from 'interchain-query';

export const useQueryHooks = (chainName: string) => {
  const { getRpcEndpoint } = useChain(chainName);

  const rpcEndpointQuery = { data: 'https://cosmos-api.polkachu.com:443' }

  const rpcClientQuery = useRpcClient({
    rpcEndpoint: 'https://cosmos-api.polkachu.com',
    options: {
      enabled: Boolean(rpcEndpointQuery.data),
      staleTime: Infinity,
    },
  });

  const { cosmos } = createRpcQueryHooks({
    rpc: rpcClientQuery.data,
  });

  const isReady = Boolean(rpcClientQuery.data);
  const isFetching = rpcClientQuery.isFetching;
  

  return {
    cosmos,
    isReady,
    isFetching,
    rpcEndpoint: rpcEndpointQuery.data,
  };
};
