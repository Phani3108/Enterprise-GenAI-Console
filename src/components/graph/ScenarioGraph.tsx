'use client';

import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  type NodeTypes,
  Position,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import UseCaseNode from './UseCaseNode';
import PlatformNode from './PlatformNode';
import ArchitectureNode from './ArchitectureNode';
import StrategyNode from './StrategyNode';
import { useScenarioStore } from '@/store/scenarioStore';

const nodeTypes: NodeTypes = {
  useCase: UseCaseNode,
  platform: PlatformNode,
  architecture: ArchitectureNode,
  strategy: StrategyNode,
};

export default function ScenarioGraph() {
  const { getActiveScenario } = useScenarioStore();
  const scenario = getActiveScenario();

  const useCaseLabel = scenario?.useCase?.replace(/_/g, ' ') || 'Customer Support';
  const trafficLabel = scenario ? `${(scenario.traffic.requestsPerMonth / 1_000_000).toFixed(1)}M req/mo` : 'enterprise';

  const nodes: Node[] = useMemo(() => [
    {
      id: 'uc',
      type: 'useCase',
      position: { x: 400, y: 0 },
      data: { label: useCaseLabel, scale: trafficLabel },
    },
    {
      id: 'vertex',
      type: 'platform',
      position: { x: 150, y: 160 },
      data: { label: 'Vertex AI', score: 91, cost: '$4,900/mo', color: '#4F46E5' },
    },
    {
      id: 'azure',
      type: 'platform',
      position: { x: 650, y: 160 },
      data: { label: 'Azure OpenAI', score: 84, cost: '$5,600/mo', color: '#3B82F6' },
    },
    {
      id: 'rag-vertex',
      type: 'architecture',
      position: { x: 50, y: 340 },
      data: { label: 'RAG Architecture', risk: 'Low', latency: '220ms', color: '#06B6D4' },
    },
    {
      id: 'ft-vertex',
      type: 'architecture',
      position: { x: 280, y: 340 },
      data: { label: 'Fine-Tuned Models', risk: 'Medium', latency: '180ms', color: '#06B6D4' },
    },
    {
      id: 'hybrid-azure',
      type: 'architecture',
      position: { x: 530, y: 340 },
      data: { label: 'Hybrid Architecture', risk: 'Medium', latency: '260ms', color: '#3B82F6' },
    },
    {
      id: 'api-azure',
      type: 'architecture',
      position: { x: 760, y: 340 },
      data: { label: 'API Inference', risk: 'Low', latency: '300ms', color: '#3B82F6' },
    },
    {
      id: 'strat-vertex-rag',
      type: 'strategy',
      position: { x: 50, y: 520 },
      data: { label: 'Phased RAG Rollout', readiness: 61, timeline: '12 months', color: '#EC4899' },
    },
    {
      id: 'strat-vertex-ft',
      type: 'strategy',
      position: { x: 280, y: 520 },
      data: { label: 'Custom Model Strategy', readiness: 48, timeline: '18 months', color: '#EC4899' },
    },
    {
      id: 'strat-azure-hybrid',
      type: 'strategy',
      position: { x: 530, y: 520 },
      data: { label: 'Hybrid Cloud Launch', readiness: 55, timeline: '14 months', color: '#EC4899' },
    },
    {
      id: 'strat-azure-api',
      type: 'strategy',
      position: { x: 760, y: 520 },
      data: { label: 'API-First MVP', readiness: 72, timeline: '6 months', color: '#EC4899' },
    },
  ], [useCaseLabel, trafficLabel]);

  const edgeStyle = { stroke: 'rgba(148, 163, 184, 0.2)', strokeWidth: 1.5 };
  const animatedEdgeStyle = { ...edgeStyle, stroke: 'rgba(79, 70, 229, 0.4)' };

  const edges: Edge[] = useMemo(() => [
    { id: 'uc-vertex', source: 'uc', target: 'vertex', style: animatedEdgeStyle, animated: true, markerEnd: { type: MarkerType.ArrowClosed, color: '#4F46E530' } },
    { id: 'uc-azure', source: 'uc', target: 'azure', style: edgeStyle, markerEnd: { type: MarkerType.ArrowClosed, color: '#94A3B820' } },
    { id: 'vertex-rag', source: 'vertex', target: 'rag-vertex', style: animatedEdgeStyle, animated: true },
    { id: 'vertex-ft', source: 'vertex', target: 'ft-vertex', style: edgeStyle },
    { id: 'azure-hybrid', source: 'azure', target: 'hybrid-azure', style: edgeStyle },
    { id: 'azure-api', source: 'azure', target: 'api-azure', style: edgeStyle },
    { id: 'rag-strat', source: 'rag-vertex', target: 'strat-vertex-rag', style: animatedEdgeStyle, animated: true },
    { id: 'ft-strat', source: 'ft-vertex', target: 'strat-vertex-ft', style: edgeStyle },
    { id: 'hybrid-strat', source: 'hybrid-azure', target: 'strat-azure-hybrid', style: edgeStyle },
    { id: 'api-strat', source: 'api-azure', target: 'strat-azure-api', style: edgeStyle },
  ], []);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-white/[0.06] bg-[#0B1020]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        minZoom={0.3}
        maxZoom={1.5}
      >
        <Background color="rgba(148, 163, 184, 0.05)" gap={40} />
        <Controls
          showInteractive={false}
          style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}
        />
      </ReactFlow>
    </div>
  );
}
