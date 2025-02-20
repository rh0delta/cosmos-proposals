// TODO fix type issues
// @ts-nocheck
import {
  Box,
  Button,
  Icon,
  Stack,
  Text,
} from '@interchain-ui/react';
import {
  Proposal as IProposal,
} from 'interchain-query/cosmos/gov/v1beta1/gov';
import Markdown from 'react-markdown';

export type ProposalProps = {
  proposal: IProposal;
};

export function Proposal({
  proposal,
}: ProposalProps) {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => setShowMore((v) => !v);

  const description = proposal?.summary|| '';
  const renderedDescription =
    description.length > 200
      ? showMore
        ? description
        : `${description.slice(0, 200)}...`
      : description || '';

  return (
    <Box py="$12" minWidth="40rem" maxWidth="40rem">
      {/* Description */}
      <Box>
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

        <Text fontSize="$sm" fontWeight="$normal" color="$textSecondary">
          {showMore ? <Markdown>{description}</Markdown> : renderedDescription}
        </Text>

        <Box mt="$8" width="100%" display="flex" justifyContent="center">
          <Button intent="secondary" variant="ghost" onClick={toggleShowMore}>
            {showMore ? 'Show less' : 'Show more'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
