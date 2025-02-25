import { DEFAULT_CHAIN_NAME } from "@/components";
import { getUserProposalsByAddress } from "@/utils/database";
import { useChain } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useProposals = (pageKey: string, forceReload?: boolean) => {  
  const { address } = useChain(DEFAULT_CHAIN_NAME)
  const [userVotedProposals, setUserVotedProposals] = useState<string[]>([])

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

  useEffect(() => {
    const fetchUserVotedProposals = async () => {
      if (!address) return
      const proposals = await getUserProposalsByAddress(address, 'id:proposal_id')
      console.log('proposals', proposals);
      
      setUserVotedProposals(proposals?.map((pr: any) => pr.id) || [])
    }

    fetchUserVotedProposals()
  }, [data, forceReload, address])

  if (userVotedProposals.length) {
    const proposalsList = data?.proposals.map((prp: any) => {
      if (userVotedProposals.includes(prp.id)) {
        return {
          ...prp,
          markedAsSpam: true
        }
      }
      return prp
    })

    return {
      data: {
        ...data,
        proposals: proposalsList
      },
      isLoading, refetch
    }
  }

  return { data, isLoading, refetch }
}

// dont need to filter spam proposals
// need to display spam votes counts (in modal or in proposal item)
// add raw json tab in modal for individual proposal