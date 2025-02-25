// TODO fix type issues
import { useState } from 'react';
// @ts-nocheck
import {
  Box,
  Button,
  Text,
} from '@interchain-ui/react';
import Markdown from 'react-markdown';
import { Decimal } from '@cosmjs/math'
import { ProposalProps } from '@/components';
import Show from '../common/Show';
import JsonView from '@uiw/react-json-view';

export function ProposalInfo({
  proposal,
}: ProposalProps) {
  const description = proposal?.summary|| '';

  return (
    <Box py="$12" minWidth="40rem" maxWidth="40rem">
      <Show when={proposal?.proposer}>
        <Box marginBottom="$8">
          <Text
            color="$textSecondary"
            fontSize="$md"
            fontWeight="$semibold"
            attributes={{ marginRight: '$12' }}
          >
            Proposer
          </Text>
          <Text fontSize="$sm" fontWeight="$normal" color="$textSecondary">
            {proposal?.proposer}
          </Text>
        </Box>
      </Show>
      <Box display="flex" alignItems="center" marginBottom="$8">
        <Text
          color="$textSecondary"
          fontSize="$md"
          fontWeight="$semibold"
          attributes={{ marginRight: '$12' }}
        >
          Status
        </Text>
        <Text fontSize="$sm" fontWeight="$normal" color="$textSecondary">
          {proposal?.status}
        </Text>
      </Box>
      <Box display="flex" alignItems="center" marginBottom="$8">
        <Text
          color="$textSecondary"
          fontSize="$md"
          fontWeight="$semibold"
          attributes={{ marginRight: '$12' }}
        >
          Time Submitted
        </Text>
        <Text fontSize="$sm" fontWeight="$normal" color="$textSecondary">
          {proposal?.submit_time}
        </Text>
      </Box>
      <Box display="flex" alignItems="center" marginBottom="$8">
        <Text
          color="$textSecondary"
          fontSize="$md"
          fontWeight="$semibold"
          attributes={{ marginRight: '$12' }}
        >
          Deposit Amount
        </Text>
        <Text fontSize="$sm" fontWeight="$normal" color="$textSecondary">
          {Decimal.fromAtomics(proposal.total_deposit[0].amount, 6).toString()}
          {' '}
          {proposal.total_deposit[0].denom}
        </Text>
      </Box>
      <Box display="flex" alignItems="center" marginBottom="$8">
        <Text
          color="$textSecondary"
          fontSize="$md"
          fontWeight="$semibold"
          attributes={{ marginRight: '$12' }}
        >
          Deposit End Time
        </Text>
        <Text fontSize="$sm" fontWeight="$normal" color="$textSecondary">
          {proposal.deposit_end_time}
        </Text>
      </Box>
      <Show when={proposal?.metadata}>
        <Box marginBottom="$8">
          <Text
            color="$textSecondary"
            fontSize="$md"
            fontWeight="$semibold"
            attributes={{ marginRight: '$12' }}
          >
            Metadata
          </Text>
          <Text fontSize="$sm" fontWeight="$normal" color="$textSecondary">
            {proposal?.metadata}
          </Text>
        </Box>
      </Show>
      <Box maxWidth="100%" width="auto">
        <Text
          color="$textSecondary"
          fontSize="$lg"
          fontWeight="$semibold"
          attributes={{
            marginBottom: '$8',
          }}
        >
          Description
        </Text>

        <Text fontSize="$sm" fontWeight="$normal" color="$textSecondary" attributes={{ padding: '$1' }}>
          <Markdown>{description}</Markdown>
        </Text>
      </Box>
    </Box>
  );
}
