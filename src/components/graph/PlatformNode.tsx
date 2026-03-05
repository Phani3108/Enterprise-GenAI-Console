'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';

export default function PlatformNode({ data }: NodeProps) {
  const color = (data.color as string) || '#4F46E5';

  return (
    <div
      className="px-5 py-4 rounded-xl border backdrop-blur-sm min-w-[160px]"
      style={{
        backgroundColor: `${color}10`,
        borderColor: `${color}30`,
      }}
    >
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !border-0" style={{ background: color }} />
      <p className="text-[10px] tracking-widest uppercase font-medium mb-1" style={{ color }}>Platform</p>
      <p className="text-sm font-semibold text-[#F8FAFC]">{data.label as string}</p>
      <div className="flex items-center gap-3 mt-2 text-[10px]">
        <span className="text-[#94A3B8]">Score: <strong className="text-[#F8FAFC]">{data.score as number}</strong></span>
        <span className="text-[#94A3B8]">{data.cost as string}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !border-0" style={{ background: color }} />
    </div>
  );
}
