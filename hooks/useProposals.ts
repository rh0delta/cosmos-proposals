import { DEFAULT_CHAIN_NAME } from "@/components";
import { getSpamUserProposalsByAddress } from "@/utils/database";
import { useChain } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useProposals = (pageKey: string, forceReload?: boolean) => {  
  const { address } = useChain(DEFAULT_CHAIN_NAME)
  const [userVotedProposals, setUserVotedProposals] = useState<string[]>([])

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['get-proposals', pageKey],
    queryFn: async () => {
      const response = await fetch(`https://cosmos-api.polkachu.com/cosmos/gov/v1beta1/proposals?pagination.limit=10${pageKey ? `&pagination.key=${pageKey}` : ''}`, {
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
      const proposals = await getSpamUserProposalsByAddress(address, 'id:proposal_id')
      
      setUserVotedProposals(proposals?.map((pr: any) => pr.id) || [])
    }

    fetchUserVotedProposals()
  }, [data, forceReload, address])

  if (userVotedProposals.length) {
    const proposalsList = data?.proposals.map((prp: any) => {
      if (userVotedProposals.includes(prp.proposal_id)) {
        return {
          ...prp,
          markedAsSpam: true
        }
      }
      return {
        ...prp,
        markedAsSpam: false
      }
    }).sort((a: any, b: any) => {
      if (a?.markedAsSpam !== b?.markedAsSpam) {
        return a?.markedAsSpam - b?.markedAsSpam
      }
      return Number(a.id) - Number(b.id)
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