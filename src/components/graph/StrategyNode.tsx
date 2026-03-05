'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';

export default function StrategyNode({ data }: NodeProps) {
  const color = (data.color as string) || '#EC4899';
  const readiness = data.readiness as number;
  const readinessColor = readiness >= 70 ? '#22C55E' : readiness >= 50 ? '#F59E0B' : '#EF4444';

  return (
    <div
      className="px-5 py-3 rounded-xl border backdrop-blur-sm min-w-[150px]"
      style={{
        backgroundColor: `${color}08`,
        borderColor: `${color}25`,
      }}
    >
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !border-0" style={{ background: color }} />
      <p className="text-[10px] tracking-widest uppercase font-medium mb-1" style={{ color }}>Strategy</p>
      <p className="text-xs font-semibold text-[#F8FAFC]">{data.label as string}</p>
      <div className="flex items-center gap-3 mt-2 text-[10px]">
        <span className="text-[#94A3B8]">
          Ready: <strong style={{ color: readinessColor }}>{readiness}</strong>
        </span>
        <span className="text-[#64748B]">{data.timeline as string}</span>
      </div>
    </div>
  );
}
