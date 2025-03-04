// TODO fix type issues
import { useEffect, useState } from 'react';
// @ts-nocheck
import {
  Box,
  Button,
  Tabs,
  Text,
} from '@interchain-ui/react';
import Show from '../common/Show';
import JsonView from '@uiw/react-json-view';
import { ProposalInfo } from '..';
import { VotingInfo } from './VotingInfo';
import { getSpamVoteCountByProposalId } from '@/utils/database';

export interface ProposalInfoProps {
  proposal: any;
};

interface ProposalModalProps extends ProposalInfoProps {
  onMarkAsSpam: (proposal: any, vote: boolean) => void;
  isProposalsLoading?: boolean
}

export function ProposalModal({
  proposal,
  onMarkAsSpam,
  isProposalsLoading
}: ProposalModalProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [hasBeenMarked, setHasBeenMarked] = useState(proposal?.markedAsSpam)
  const [spamVoteCount, setSpamVoteCount] = useState(0)
  const [actionButtonLabel, setActionButtonLabel] = useState(proposal?.markedAsSpam ? 'Marked as Spam' : 'Mark as Spam')

  // Side effect triggered on mount to pull spam votes count. Decided against to add a dependency
  // to rerun the side effect to reduce number of calls to the db and possibly make the process
  // a little more performant.
  useEffect(() => {
    const fetchData = async () => {
      const data = await getSpamVoteCountByProposalId(proposal.proposal_id)
      setSpamVoteCount(data || 0)
    }

    fetchData()
  }, [])

  // Since the modal does not update the proposal prop we must similate what we expect
  // the prop will become upon setting or unsetting the proposal as spam.
  // We simulate the increase or decrease in spam votes, and simulate the change in the
  // boolean that is used to show or hide the action button.
  function handleSpamClick (vote: boolean) {
    setHasBeenMarked(vote)
    setActionButtonLabel(vote ? 'Marked as Spam' : 'Mark as Spam')
    setSpamVoteCount(vote ? spamVoteCount + 1 : spamVoteCount - 1)
    onMarkAsSpam(proposal, vote)
  }

  return (
    <Box p="$12" minWidth="40rem" maxWidth="40rem">
      <Box 
        display="flex" 
        flexDirection={{ mobile: 'column', tablet: 'row', desktop: 'row' }}
        justifyContent="space-between"
        alignItems={{
          mobile: 'flex-start',
          tablet: 'center',
          desktop: 'center'
        }}
      >
        <Tabs
          tabs={[
            { label: 'General', content: null },
            { label: 'Voting', content: null },
            { label: 'View Raw', content: null },
          ]}
          activeTab={activeTab}
          onActiveTabChange={(tabId) => setActiveTab(tabId)}
          attributes={{ width: '$min', marginBottom: { mobile: '$8', tablet: '$0', desktop: '$0' } }}
        />
        <Text>Spam Votes: {spamVoteCount}</Text>
      </Box>
      <Show when={activeTab === 0}>
        <ProposalInfo proposal={proposal} />
      </Show>
      <Show when={activeTab === 1}>
        <VotingInfo proposal={proposal} />
      </Show>
      <Show when={activeTab === 2}>
        <Text attributes={{ padding: '$8' }} fontSize="$xs" fontWeight="$normal" color="$textSecondary">
          <JsonView value={proposal} />
        </Text>
      </Show>
      <Show when={activeTab !== 2}>
        {!hasBeenMarked && (
          <Button
            disabled={isProposalsLoading}
            onClick={() => handleSpamClick(true)}
          >
            Mark as Spam
          </Button>
        )}
        {hasBeenMarked && (
          <Button
            disabled={isProposalsLoading}
            onClick={() => handleSpamClick(false)}
            onHoverStart={() => {
              setActionButtonLabel('Unmark as Spam')
            }}
            onHoverEnd={() => {
              setActionButtonLabel('Marked as Spam')
            }}
          >
            {actionButtonLabel}
          </Button>
        )}
      </Show>
    </Box>
  );
}
