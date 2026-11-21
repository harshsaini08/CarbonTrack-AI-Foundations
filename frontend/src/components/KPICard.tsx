import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  accentColor?: 'emerald' | 'amber' | 'rose' | 'blue' | 'purple';
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  trend,
  accentColor = 'emerald'
}) => {
  const colorMap = {
    emerald: {
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      glow: 'hover:border-emerald-500/40',
    },
    amber: {
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      glow: 'hover:border-amber-500/40',
    },
    rose: {
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      glow: 'hover:border-rose-500/40',
    },
    blue: {
      iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      glow: 'hover:border-blue-500/40',
    },
    purple: {
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      glow: 'hover:border-purple-500/40',
    },
  };

  return (
    <div className={`p-4 rounded-xl bg-charcoal-850/80 border border-charcoal-800 transition-all duration-200 ${colorMap[accentColor].glow}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-charcoal-400">{title}</span>
            {badge && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-charcoal-750 text-charcoal-300 border border-charcoal-700">
                {badge}
              </span>
            )}
          </div>
          <div className="text-2xl font-bold tracking-tight text-white font-mono">
            {value}
          </div>
        </div>
        <div className={`p-2.5 rounded-lg border ${colorMap[accentColor].iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs text-charcoal-400 pt-2 border-t border-charcoal-800/80">
          {subtitle && <span>{subtitle}</span>}
          {trend && (
            <span className={`font-medium ${trend.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend.value} {trend.label && <span className="text-charcoal-500 text-[11px]">{trend.label}</span>}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
