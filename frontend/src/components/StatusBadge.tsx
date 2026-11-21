import React from 'react';

interface StatusBadgeProps {
  type: 'severity' | 'status' | 'size' | 'bias';
  value: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value }) => {
  let style = 'bg-charcoal-800 text-charcoal-300 border-charcoal-700';

  if (type === 'severity') {
    switch (value) {
      case 'Critical':
        style = 'bg-rose-950/70 text-rose-300 border-rose-800/80';
        break;
      case 'High':
        style = 'bg-orange-950/70 text-orange-300 border-orange-800/80';
        break;
      case 'Medium':
        style = 'bg-amber-950/70 text-amber-300 border-amber-800/80';
        break;
      case 'Low':
        style = 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80';
        break;
    }
  } else if (type === 'status') {
    switch (value) {
      case 'Approved':
      case 'Verified':
        style = 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60';
        break;
      case 'Rejected':
        style = 'bg-rose-950/80 text-rose-300 border-rose-700/60';
        break;
      case 'Investigating':
        style = 'bg-purple-950/80 text-purple-300 border-purple-700/60';
        break;
      default: // Pending
        style = 'bg-amber-950/80 text-amber-300 border-amber-700/60';
        break;
    }
  } else if (type === 'size') {
    switch (value) {
      case 'Small':
        style = 'bg-blue-950/60 text-blue-300 border-blue-800/50';
        break;
      case 'Medium':
        style = 'bg-purple-950/60 text-purple-300 border-purple-800/50';
        break;
      case 'Large':
        style = 'bg-slate-800 text-slate-300 border-slate-700';
        break;
    }
  } else if (type === 'bias') {
    if (value.includes('Unfairly') || value.includes('Penalized')) {
      style = 'bg-rose-950/80 text-rose-300 border-rose-800/80';
    } else if (value.includes('Masked')) {
      style = 'bg-amber-950/80 text-amber-300 border-amber-800/80';
    } else {
      style = 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80';
    }
  }

  return (
    <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full border ${style}`}>
      {value}
    </span>
  );
};
