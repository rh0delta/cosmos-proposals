// TODO fix type issues
// @ts-nocheck

import { useState } from 'react';
import { useChain } from '@cosmos-kit/react';
import {
  Proposal as IProposal,
  ProposalStatus,
  TallyResult,
  TextProposal,
} from 'interchain-query/cosmos/gov/v1beta1/gov';
import {
  BasicModal,
  Box,
  GovernanceProposalItem,
  Spinner,
  Text,
  useColorModeValue,
} from '@interchain-ui/react';
import { useModal } from '@/hooks';
import { Proposal } from '@/components';
import { formatDate } from '@/utils';
import { useQuery } from '@tanstack/react-query';

function status(s: ProposalStatus) {
  switch (s) {
    case 'PROPOSAL_STATUS_UNSPECIFIED':
      return 'pending';
    case 'PROPOSAL_STATUS_DEPOSIT_PERIOD':
      return 'pending';
    case 'PROPOSAL_STATUS_VOTING_PERIOD':
      return 'pending';
    case 'PROPOSAL_STATUS_PASSED':
      return 'passed';
    case 'PROPOSAL_STATUS_REJECTED':
      return 'rejected';
    case 'PROPOSAL_STATUS_FAILED':
      return 'rejected';
    default:
      return 'pending';
  }
}

function votes(result: TallyResult) {
  return {
    yes: Number(result.yes) || 0,
    no: Number(result.no) || 0,
    abstain: Number(result.abstain) || 0,
    noWithVeto: Number(result.noWithVeto) || 0,
  };
}

export type VotingProps = {
  chainName: string;
};

export function Voting({ chainName }: VotingProps) {
  const { address } = useChain(chainName);
  const [proposal, setProposal] = useState<IProposal>();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['get-proposals'],
    queryFn: async () => {
      const response = await fetch('https://cosmos-api.polkachu.com/cosmos/gov/v1/proposals?pagination.limit=20', {
        headers: {
          'accept': 'application/json'
        }
      })
      const data = await response.json()
      return data
    }
  });
  
  const { modal, open: openModal, close: closeModal, setTitle } = useModal('');

  const spinnerColor = useColorModeValue('$blackAlpha800', '$whiteAlpha900');

  function onClickProposal(index: number) {
    const proposal = data.proposals![index];
    openModal();
    setProposal(proposal);
    setTitle(
      `#${proposal.id?.toString()} ${
        (proposal.content as TextProposal)?.title
      }`
    );
  }

  if (!address) {
    return (
      <Box my="$20" display="flex" alignItems="center" justifyContent="center">
        <Text fontSize="$lg" fontWeight="$semibold" color="$textSecondary">
          Please connect to your wallet to see the proposals.
        </Text>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box my="$22" display="flex" justifyContent="center">
        <Spinner size="$5xl" color={spinnerColor} />
      </Box>
    );
  }

  return (
    <Box mb="$20" position="relative">
      <Text fontWeight="600" fontSize="$2xl">
        Proposals
      </Text>

      <Box mt="$12">
        {data.proposals && data.proposals.length > 0 ? (
          data.proposals.map((proposal, index) => (
            <Box
              my="$8"
              key={proposal.id?.toString() || index}
              position="relative"
              attributes={{ onClick: () => onClickProposal(index) }}
            >
              <GovernanceProposalItem
                id={`# ${proposal.id?.toString()}`}
                key={new Date(proposal.submit_time)?.getTime()}
                title={proposal?.title || ''}
                status={status(proposal.status)}
                endTime={formatDate(proposal.voting_end_time)!}
                votes={{}}
              />
            </Box>
          ))
        ) : (
          <Text
            fontSize="$lg"
            fontWeight="$semibold"
            color="$textSecondary"
            textAlign="center"
            attributes={{ mt: '$8' }}
          >
            No proposals found
          </Text>
        )}
      </Box>

      <BasicModal
        title={
          <Box maxWidth="40rem">
            <Text fontSize="$xl" fontWeight="$bold">
              {modal.title}
            </Text>
          </Box>
        }
        isOpen={modal.open}
        onOpen={openModal}
        onClose={closeModal}
      >
        <Proposal
          votes={data.votes}
          proposal={proposal!}
          quorum={data.quorum!}
          bondedTokens={data.bondedTokens!}
          chainName={chainName}
          onVoteSuccess={refetch}
        />
      </BasicModal>
    </Box>
  );
}
