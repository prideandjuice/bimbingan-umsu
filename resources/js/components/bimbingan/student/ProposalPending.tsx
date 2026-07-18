// components/bimbingan/student/ProposalPending.tsx
import { Clock } from 'lucide-react';
import { DB } from '@/db';
import type { Proposal, ProposalTitle } from '@/types';

interface ProposalPendingProps {
  myProposal: Proposal;
  proposalTitles: ProposalTitle[];
  onRefresh: () => void;
}

export default function ProposalPending({ myProposal, proposalTitles, onRefresh }: ProposalPendingProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm max-w-4xl mx-auto text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
        <Clock className="w-8 h-8" />
      </div>
      <h2 className="font-display font-bold text-2xl text-gray-900">Proposal Sedang Ditinjau</h2>
      {/* ... mapping proposalTitles ... */}
    </div>
  );
}