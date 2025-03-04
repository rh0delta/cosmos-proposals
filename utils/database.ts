import { createClient } from "@supabase/supabase-js";

const supabase = createClient('https://odkcnyztfgqjuodmldga.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ka2NueXp0ZmdxanVvZG1sZGdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNjc2NDMsImV4cCI6MjA1NTc0MzY0M30.670b5yw8jHpWeSGFU8LiFOmk_qEPPezWNNg2gza6O3I')

export async function getSpamUserProposalsByAddress (address: string, returnColumn?: string) {
  const { data } = await supabase.from('proposals').select(returnColumn || '').eq('cosmos_address', address).eq('is_spam', true)

  return data
}

export async function getSpamVoteCountByProposalId (proposalId: string, returnColumn?: string) {
  const { count } = await supabase
    .from('proposals')
    .select(returnColumn || '', { count: 'exact', head: true })
    .eq('proposal_id', proposalId)
    .eq('is_spam', true)


  return count
}

export async function setProposalAsSpam (userAddress: string, proposal: any) {
  const { data } = await supabase
    .from('proposals')
    .upsert({ is_spam: true, proposal_id: proposal?.proposal_id, cosmos_address: userAddress })
    .select()
  
  return data
}

export async function unsetProposalAsSpam (userAddress: string, proposal: any) {
  const { error } = await supabase
    .from('proposals')
    .delete()
    .eq('proposal_id', proposal?.proposal_id)
    .eq('cosmos_address', userAddress)
  
  if (error) throw error
  return
}