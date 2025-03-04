import { Box, Text } from "@interchain-ui/react";
import JsonView from "@uiw/react-json-view";
import { ProposalInfoProps } from "@/components";

export function VotingInfo ({ proposal }: ProposalInfoProps) {
  return (
    <Box py="$12" minWidth="40rem" maxWidth="40rem">
      <Box display="flex" alignItems="center" marginBottom="$4">
        <Text
          color="$textSecondary"
          fontSize="$sm"
          fontWeight="$semibold"
          attributes={{ marginRight: '$12' }}
        >
          Start Time
        </Text>
        <Text fontSize="$xs" fontWeight="$normal" color="$textSecondary">
          {proposal.voting_start_time}
        </Text>
      </Box>
      <Box display="flex" alignItems="center" marginBottom="$4">
        <Text
          color="$textSecondary"
          fontSize="$sm"
          fontWeight="$semibold"
          attributes={{ marginRight: '$12' }}
        >
          End Time
        </Text>
        <Text fontSize="$xs" fontWeight="$normal" color="$textSecondary">
          {proposal.voting_end_time}
        </Text>
      </Box>
      <Box display="flex" alignItems="center" marginBottom="$4">
        <Text
          color="$textSecondary"
          fontSize="$sm"
          fontWeight="$semibold"
          attributes={{ marginRight: '$12' }}
        >
          Results
        </Text>
        <Text fontSize="$xs" fontWeight="$normal" color="$textSecondary">
          <JsonView value={proposal.final_tally_result} />
        </Text>
      </Box>
    </Box>
  )
}