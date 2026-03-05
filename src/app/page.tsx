'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { fadeInUp, staggerContainer, scaleIn } from '@/styles/motion';
import GlowButton from '@/components/ui/GlowButton';
import NeonCard from '@/components/ui/NeonCard';
import AnimatedGrid from '@/components/ui/AnimatedGrid';
import FloatingIcons from '@/components/ui/FloatingIcons';
import { getModules } from '@/utils/moduleRegistry';
import {
  ArrowRight,
  Sparkles,
  Shield,
  TrendingUp,
  Building2,
  Brain,
  Layers,
  ChevronDown,
} from 'lucide-react';

const agents = getModules();

const problems = [
  { icon: Layers, text: 'AI platform decisions across Vertex AI, Azure OpenAI, AWS Bedrock' },
  { icon: Brain, text: 'Architecture design for production-grade AI systems' },
  { icon: TrendingUp, text: 'Cost forecasting for GenAI infrastructure at enterprise scale' },
  { icon: Shield, text: 'Regulatory readiness and compliance assessment' },
  { icon: Building2, text: 'Product launch strategy and go-to-market planning' },
];

const workflow = [
  { step: '01', label: 'Define AI Use Case', color: '#4F46E5' },
  { step: '02', label: 'Platform Decision', color: '#3B82F6' },
  { step: '03', label: 'Architecture Design', color: '#06B6D4' },
  { step: '04', label: 'Cost Simulation', color: '#8B5CF6' },
  { step: '05', label: 'Enterprise Readiness', color: '#A78BFA' },
  { step: '06', label: 'Product Strategy', color: '#EC4899' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0B1020] relative">
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <AnimatedGrid />
        <FloatingIcons />
        <div className="absolute inset-0 radial-glow" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-[#94A3B8]">
              <Sparkles className="w-3 h-3 text-[#4F46E5]" />
              AI-Powered Decision System for Financial Institutions
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              custom={1}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
            >
              <span className="text-[#F8FAFC]">Enterprise GenAI</span>
              <br />
              <span className="bg-gradient-to-r from-[#4F46E5] via-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
                Strategy Console
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              custom={2}
              className="text-lg sm:text-xl text-[#94A3B8] max-w-2xl mx-auto leading-relaxed"
            >
              A decision system that helps CTOs and AI product leaders design, evaluate,
              and launch production AI systems — powered by five specialized AI agents.
            </motion.p>

            <motion.div variants={fadeInUp} custom={3} className="flex items-center justify-center gap-4 pt-4">
              <GlowButton href="/console" variant="primary" size="lg">
                <Sparkles className="w-4 h-4" />
                Launch AI Strategy Console
                <ArrowRight className="w-4 h-4" />
              </GlowButton>
              <GlowButton href="#agents" variant="secondary" size="lg">
                Explore Agents
              </GlowButton>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={5}
            className="mt-20"
          >
            <Image
              src="/images/hero-ai-console.svg"
              alt="AI Agent Network"
              width={700}
              height={440}
              className="mx-auto opacity-80"
              priority
            />
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <ChevronDown className="w-5 h-5 text-[#64748B]" />
          </motion.div>
        </div>
      </section>

      {/* ─── PROBLEM ─── */}
      <section className="py-32 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-xs font-medium tracking-widest uppercase text-[#4F46E5] mb-3">
              The Challenge
            </motion.p>
            <motion.h2 variants={fadeInUp} custom={1} className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] mb-4">
              Enterprise AI Decisions Are Broken
            </motion.h2>
            <motion.p variants={fadeInUp} custom={2} className="text-[#94A3B8] max-w-2xl mx-auto">
              Financial institutions spend months on fragmented consulting work to make critical
              AI infrastructure decisions. The cost of indecision is measured in lost competitive advantage.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-3"
          >
            {problems.map((p, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                custom={i}
                className="flex items-center gap-4 px-5 py-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-[#4F46E5]/10 border border-[#4F46E5]/20 flex items-center justify-center shrink-0">
                  <p.icon className="w-5 h-5 text-[#4F46E5]" />
                </div>
                <p className="text-sm text-[#94A3B8]">{p.text}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10 text-xs text-[#64748B]"
          >
            These decisions take months of consulting work. This console makes it minutes.
          </motion.p>
        </div>
      </section>

      {/* ─── AGENTS ─── */}
      <section id="agents" className="py-32 px-6 relative grid-pattern">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-xs font-medium tracking-widest uppercase text-[#06B6D4] mb-3">
              The System
            </motion.p>
            <motion.h2 variants={fadeInUp} custom={1} className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] mb-4">
              Five Specialized AI Strategy Agents
            </motion.h2>
            <motion.p variants={fadeInUp} custom={2} className="text-[#94A3B8] max-w-2xl mx-auto">
              Each agent evaluates a critical dimension of enterprise AI adoption,
              then synthesizes results into an actionable decision brief.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent, i) => (
              <NeonCard key={agent.id} color={agent.color} index={i}>
                <Link href={agent.route} className="block p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `${agent.color}15`,
                        border: `1px solid ${agent.color}30`,
                      }}
                    >
                      <Image
                        src={`/icons/${agent.icon}.svg`}
                        alt={agent.name}
                        width={24}
                        height={24}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-[#F8FAFC] mb-1">{agent.name}</h3>
                      <p className="text-xs text-[#64748B] leading-relaxed">{agent.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-medium" style={{ color: agent.color }}>
                    Open Agent
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              </NeonCard>
            ))}

            <NeonCard color="#22D3EE" index={5}>
              <Link href="/m/brief" className="block p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#22D3EE]/10 border border-[#22D3EE]/30">
                    <span className="text-xl">📋</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[#F8FAFC] mb-1">Decision Brief Generator</h3>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      Auto-generate executive decision briefs from all agent outputs with risk analysis and launch plans.
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-[#22D3EE]">
                  Generate Brief
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            </NeonCard>
          </div>
        </div>
      </section>

      {/* ─── WORKFLOW ─── */}
      <section className="py-32 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-xs font-medium tracking-widest uppercase text-[#8B5CF6] mb-3">
              The Workflow
            </motion.p>
            <motion.h2 variants={fadeInUp} custom={1} className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] mb-4">
              Mirrors Real Enterprise AI Adoption
            </motion.h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-[27px] top-0 bottom-0 w-px bg-gradient-to-b from-[#4F46E5]/40 via-[#3B82F6]/30 to-[#EC4899]/40" />
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-6"
            >
              {workflow.map((w, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  custom={i}
                  className="flex items-center gap-6 group"
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold border transition-all group-hover:scale-105"
                    style={{
                      backgroundColor: `${w.color}10`,
                      borderColor: `${w.color}30`,
                      color: w.color,
                    }}
                  >
                    {w.step}
                  </div>
                  <div className="flex-1 py-4 px-5 rounded-xl bg-white/[0.02] border border-white/[0.05] group-hover:bg-white/[0.04] transition-colors">
                    <p className="text-sm text-[#F8FAFC] font-medium">{w.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 radial-glow" />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="relative z-10 max-w-2xl mx-auto text-center"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] mb-4">
            Ready to Make AI Decisions Faster?
          </motion.h2>
          <motion.p variants={fadeInUp} custom={1} className="text-[#94A3B8] mb-8">
            Launch the console and let five AI agents evaluate your enterprise strategy in minutes, not months.
          </motion.p>
          <motion.div variants={fadeInUp} custom={2}>
            <GlowButton href="/console" variant="primary" size="lg">
              <Sparkles className="w-4 h-4" />
              Launch AI Strategy Console
              <ArrowRight className="w-4 h-4" />
            </GlowButton>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/[0.06] py-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-[#64748B]">
          <p>Enterprise GenAI Strategy Console</p>
          <p>AI Infra Decision Suite</p>
        </div>
      </footer>
    </div>
  );
}
