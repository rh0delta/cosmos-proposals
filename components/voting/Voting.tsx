// TODO fix type issues
// @ts-nocheck

import { useEffect, useRef, useState } from 'react';
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
  Button,
  GovernanceProposalItem,
  Spinner,
  Text,
  useColorModeValue,
} from '@interchain-ui/react';
import { useModal } from '@/hooks';
import { Proposal } from '@/components';
import { formatDate } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import ProposalItem from './ProposalItem';

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


// Pagination
// state variable to keep track of used pagination keys
// state variable for dynamic page limits (could be a stretch goal)
// side effect to refetch data from cosmos api (QN: does react query auto fetch when param changes with variable?)
// scroll to top of div on page change
// create ref for proposals list; ref needed for scroll functionality

export function Voting({ chainName }: VotingProps) {
  const { address } = useChain(chainName);
  const proposalsListRef = useRef(null);
  const [proposal, setProposal] = useState<IProposal>();
  const [paginationKeys, setPaginationKeys] = useState<string[]>([]);
  const [pageKey, setPageKey] = useState<string>();
  console.log('pagekey', pageKey);
  console.log('paginationkeys', paginationKeys);
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['get-proposals', pageKey],
    queryFn: async () => {
      const response = await fetch(`https://cosmos-api.polkachu.com/cosmos/gov/v1/proposals?pagination.limit=10${pageKey ? `&pagination.key=${pageKey}` : ''}`, {
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

  const scrollToTop = () => {
    proposalsListRef.current.scroll({
      top: 0,
      behavior: "smooth"
    });
  };

  function onClickNextPage() {
    const nextKey = data?.pagination?.next_key
    setPageKey(nextKey)
    setPaginationKeys(paginationKeys?.concat([nextKey]))
  }

  function onClickPreviousPage() {
    const tempArr = [...paginationKeys]
    console.log({ tempArr });
    tempArr.pop()
    console.log({ tempArr });
    const previousKey = tempArr.length >= 1 ? tempArr[tempArr.length - 1] : ''
    setPageKey(previousKey)
    setPaginationKeys(previousKey ? tempArr : [])
  }

  useEffect(() => {
    if (proposalsListRef.current) scrollToTop()
  }, [pageKey])

  if (!address) {
    return (
      <Box my="$20" display="flex" alignItems="center" justifyContent="center">
        <Text fontSize="$lg" fontWeight="$semibold" color="$textSecondary">
          Please connect to your wallet to see the proposals.
        </Text>
      </Box>
    );
  }

  return (
    <Box mb="$20" position="relative">
      <Text fontWeight="600" fontSize="$2xl">
        Proposals
      </Text>

      <Box ref={proposalsListRef} mt="$12" height="100%" maxHeight="350px" overflowY="scroll" padding="$12" borderStyle="$solid" borderWidth="$sm" borderColor="$gray200" borderRadius="$md">
        {!isLoading ? (
          data.proposals && data.proposals.length > 0 ? (
            data.proposals.map((proposal, index) => (
              <Box
                my="$8"
                key={proposal.id?.toString() || index}
                position="relative"
                attributes={{ onClick: () => onClickProposal(index) }}
              >
                <ProposalItem
                  id={`# ${proposal.id?.toString()}`}
                  key={new Date(proposal.submit_time)?.getTime()}
                  title={proposal?.title || ''}
                  status={status(proposal.status)}
                  endTime={formatDate(proposal.voting_end_time)!}
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
          )
        ) : (
          <Box height="100%" my="$22" display="flex" justifyContent="center">
            <Spinner size="$5xl" color={spinnerColor} />
          </Box>
        )}
      </Box>
      <Box my="$10" display="flex">
        {!!paginationKeys.length && (
          <Button onClick={onClickPreviousPage} attributes={{ marginRight: '$10' }}>
            Previous
          </Button>
        )}
        <Button disabled={!data?.pagination?.next_key} onClick={onClickNextPage}>
          Next
        </Button>
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
          proposal={proposal!}
          quorum={data?.quorum!}
          bondedTokens={data?.bondedTokens!}
          chainName={chainName}
          onVoteSuccess={refetch}
        />
      </BasicModal>
    </Box>
  );
}
