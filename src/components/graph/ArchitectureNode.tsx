'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';

export default function ArchitectureNode({ data }: NodeProps) {
  const color = (data.color as string) || '#06B6D4';
  const risk = data.risk as string;
  const riskColor = risk === 'Low' ? '#22C55E' : risk === 'Medium' ? '#F59E0B' : '#EF4444';

  return (
    <div
      className="px-5 py-3 rounded-xl border backdrop-blur-sm min-w-[150px]"
      style={{
        backgroundColor: `${color}08`,
        borderColor: `${color}25`,
      }}
    >
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !border-0" style={{ background: color }} />
      <p className="text-[10px] tracking-widest uppercase font-medium mb-1" style={{ color }}>Architecture</p>
      <p className="text-xs font-semibold text-[#F8FAFC]">{data.label as string}</p>
      <div className="flex items-center gap-3 mt-2 text-[10px]">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: riskColor }} />
          <span style={{ color: riskColor }}>{risk} Risk</span>
        </span>
        <span className="text-[#64748B]">{data.latency as string}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !border-0" style={{ background: color }} />
    </div>
  );
}
