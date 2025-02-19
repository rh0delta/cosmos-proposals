// TODO fix type issues
// @ts-nocheck

import { useState } from 'react';
import { Divider } from '@interchain-ui/react';
import { ChainName } from 'cosmos-kit';

import { useAuthzContext } from '@/context';
import { Layout, Wallet, Voting } from '@/components';
import Link from 'next/link';

export default function Home() {
  const [selectedChain, setSelectedChain] = useState<ChainName>();
  const { setChainName, chainName, permission } = useAuthzContext();
  console.log('index', { chainName, permission });
  

  return (
    <Layout>
      <Wallet
        chainName={selectedChain}
        onChainChange={(chainName) => {
          setSelectedChain(chainName);
          setChainName(chainName);
        }}
      />
      <Divider height="0.1px" mt="$12" mb="$17" />
      {selectedChain && <Voting chainName={selectedChain} />}
    </Layout>
  );
}
