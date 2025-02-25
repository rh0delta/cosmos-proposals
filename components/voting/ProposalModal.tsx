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
  onMarkAsSpam: (proposal: any) => void;
}

export function ProposalModal({
  proposal,
  onMarkAsSpam
}: ProposalModalProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [hasBeenMarked, setHasBeenMarked] = useState(false)
  const [spamVoteCount, setSpamVoteCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSpamVoteCountByProposalId(proposal.id)
      setSpamVoteCount(data || 0)
    }

    fetchData()
  }, [])

  function handleSpamClick () {
    setHasBeenMarked(true)
    // Users can only vote once, simulating increase in spam votes here
    // to reduce extra call to the db
    setSpamVoteCount(spamVoteCount + 1)
    onMarkAsSpam(proposal)
  }

  return (
    <Box p="$12" minWidth="40rem" maxWidth="40rem">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Tabs
          tabs={[
            {
              label: 'General',
              content: null,
            },
            {
              label: 'Voting',
              content: null,
            },
            {
              label: 'View Raw',
              content: null
            },
          ]}
          activeTab={activeTab}
          onActiveTabChange={(tabId) => setActiveTab(tabId)}
          attributes={{ width: '$min' }}
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
        <Button disabled={hasBeenMarked || proposal.markedAsSpam} onClick={handleSpamClick}>
          {proposal.markedAsSpam ? 'Marked as Spam' : 'Mark as Spam'}
        </Button>
      </Show>
    </Box>
  );
}
