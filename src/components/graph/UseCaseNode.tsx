'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';

export default function UseCaseNode({ data }: NodeProps) {
  return (
    <div className="relative px-6 py-4 rounded-2xl bg-gradient-to-br from-[#4F46E5]/20 to-[#06B6D4]/10 border border-[#4F46E5]/30 backdrop-blur-sm min-w-[200px] text-center">
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#06B6D4]" />
      <p className="text-[10px] tracking-widest uppercase text-[#4F46E5] font-medium mb-1">AI Use Case</p>
      <p className="text-sm font-semibold text-[#F8FAFC]">{data.label as string}</p>
      <p className="text-[10px] text-[#64748B] mt-1">Scale: {(data.scale as string || 'enterprise')}</p>
      <Handle type="source" position={Position.Bottom} className="!bg-[#4F46E5] !w-2 !h-2 !border-0" />
    </div>
  );
}
