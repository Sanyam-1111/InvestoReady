import React from 'react';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlatform } from '../../context/PlatformContext';

interface RestrictedAccessCardProps {
  sectionName: string;
  permissionLabel: string;
}

export const RestrictedAccessCard: React.FC<RestrictedAccessCardProps> = ({
  sectionName,
  permissionLabel,
}) => {
  const { setRoleMode } = usePlatform();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <Lock className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-slate-900">
        {sectionName} Restricted by Founder
      </h3>
      <p className="mt-1.5 max-w-md text-xs text-slate-500">
        The founder has currently disabled &ldquo;{permissionLabel}&rdquo; in Investor Sharing
        controls. Switch to the Founder workspace to preview how sharing permissions control
        investor visibility.
      </p>
      <button
        type="button"
        onClick={() => {
          setRoleMode('founder');
          navigate('/founder/sharing');
        }}
        className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
      >
        Manage in Founder Sharing
      </button>
    </div>
  );
};
