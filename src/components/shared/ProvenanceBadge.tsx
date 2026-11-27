import React from 'react';
import {
  AlertTriangle,
  Building2,
  FileSpreadsheet,
  GitBranch,
  PenLine,
  Sparkles,
} from 'lucide-react';
import { ProvenanceType } from '../../types/finance';
import { PROVENANCE_META } from '../../utils/formatters';

interface ProvenanceBadgeProps {
  type: ProvenanceType;
  compact?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const ICONS: Record<ProvenanceType, React.ReactNode> = {
  bank_derived: <Building2 className="h-3 w-3" />,
  accounting_derived: <FileSpreadsheet className="h-3 w-3" />,
  founder_entered: <PenLine className="h-3 w-3" />,
  ai_extracted: <Sparkles className="h-3 w-3" />,
  projected: <GitBranch className="h-3 w-3" />,
  unreconciled: <AlertTriangle className="h-3 w-3" />,
};

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  type,
  compact = false,
  onClick,
}) => {
  const meta = PROVENANCE_META[type];
  return (
    <span
      title={meta.description}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none transition-colors ${meta.bgClass} ${meta.textClass} ${meta.borderClass} ${
        onClick ? 'cursor-pointer hover:brightness-95' : ''
      }`}
    >
      {ICONS[type]}
      <span>{compact ? meta.shortLabel : meta.label}</span>
    </span>
  );
};
