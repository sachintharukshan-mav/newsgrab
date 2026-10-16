import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  ShieldCheck,
  Newspaper,
  MapPin,
  Globe,
  CheckCircle2,
  Users,
  Scale,
  FileText,
  AlertCircle,
  Cpu,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { getSiteUrl } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Editorial Standards, Newsroom Masthead & Trust Policies | LANKA DISPATCH',
  description:
    'Official editorial masthead, multi-source corroboration methodology, corrections policy, and Colombo bureau information for Lanka Dispatch.',
  alternates: {
    canonical: `${getSiteUrl()}/about`,
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0b0c0e] text-zinc-200">
      {/* Header Bar */}
      <header className="border-b border-white/[0.08] bg-[#07080a] sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Front Page</span>
          </Link>
          <Link
            href="/"
            className="inline-block cursor-pointer hover:opacity-90 transition-opacity"
            title="LANKA DISPATCH Front Page"
            aria-label="LANKA DISPATCH Front Page"
          >
            <div className="text-sm font-extrabold text-white font-headline uppercase tracking-tight">
              LANKA<span className="text-rose-500">DISPATCH</span>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Title Section */}
        <div className="space-y-3 border-b border-white/[0.08] pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Institutional Newsroom &amp; Trust Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-headline">
            About LANKA DISPATCH
          </h1>
          <p className="text-sm font-mono text-zinc-400 leading-relaxed">
            Colombo Bureau • Trilingual Wire Intelligence (English · සිංහල · தமிழ்) • Multi-Source Corroboration Engine
          </p>
        </div>

        {/* Quick Jump Navigation */}
        <nav aria-label="Table of Contents" className="p-4 rounded-xl bg-[#111216] border border-white/[0.06] text-xs font-mono">
          <div className="text-zinc-400 uppercase tracking-wider font-bold mb-2">Institutional Transparency Disclosures:</div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-rose-400">
            <a href="#editorial-mission" className="hover:underline">1. Editorial Mission</a>
            <span>•</span>
            <a href="#masthead" className="hover:underline">2. Editorial Masthead</a>
            <span>•</span>
            <a href="#editorial-policy" className="hover:underline">3. Multi-Source Standards</a>
            <span>•</span>
            <a href="#ai-ethics" className="hover:underline">4. AI Grounding &amp; Ethics</a>
            <span>•</span>
            <a href="#corrections-policy" className="hover:underline">5. Corrections Policy</a>
            <span>•</span>
            <a href="#ethics-policy" className="hover:underline">6. Independence &amp; Funding</a>
            <span>•</span>
            <a href="#contact" className="hover:underline">7. Bureau Contacts</a>
          </div>
        </nav>

        {/* 1. Mission Statement */}
        <section id="editorial-mission" className="space-y-4 scroll-mt-20">
          <h2 className="text-xl font-bold text-white font-headline flex items-center gap-2">
            <Globe className="w-5 h-5 text-rose-500" />
            <span>1. Our Editorial Mission</span>
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            <strong>LANKA DISPATCH</strong> is an independent digital newsroom and multi-source editorial intelligence service headquartered in Colombo, Sri Lanka. Our mission is to provide 24/7 real-time journalism, perspective clustering, and verified economic indicators for citizens across Sri Lanka and the worldwide diaspora.
          </p>
          <p className="text-sm text-zinc-300 leading-relaxed">
            In an era of polarized commentary and fragmented reporting, Lanka Dispatch bridges Sri Lanka&apos;s primary national broadsheets (including <em>Ada Derana, Hiru News, Daily Mirror, Daily FT, Virakesari, NewsFirst, EconomyNext, NewsWire, The Island</em>) with accredited international wires (<em>Reuters, BBC World News, The Guardian</em>). We transform complex news cycles into verified, balanced, and digestible briefings without partisan bias.
          </p>
        </section>

        {/* 2. Editorial Masthead (Crucial E-E-A-T Signal) */}
        <section id="masthead" className="space-y-4 pt-4 border-t border-white/[0.08] scroll-mt-20">
          <h2 className="text-xl font-bold text-white font-headline flex items-center gap-2">
            <Users className="w-5 h-5 text-rose-500" />
            <span>2. Editorial Masthead &amp; Newsroom Governance</span>
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Lanka Dispatch operates with human editorial oversight governing every tier of automated aggregation, algorithmic clustering, and publication verification:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[#111216] border border-white/[0.06] space-y-2">
              <div className="text-xs font-mono font-bold text-white uppercase flex items-center justify-between">
                <span>Bureau Chief &amp; Lead Editor</span>
                <span className="text-[10px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">Editorial Lead</span>
              </div>
              <div className="text-sm font-semibold text-zinc-100">Colombo Bureau Directorate</div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Directs editorial policy, enforces journalistic accuracy, oversees legal compliance under Sri Lankan media frameworks, and manages publisher wire relations.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#111216] border border-white/[0.06] space-y-2">
              <div className="text-xs font-mono font-bold text-white uppercase flex items-center justify-between">
                <span>Senior Wire &amp; Economics Desk</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Market Intelligence</span>
              </div>
              <div className="text-sm font-semibold text-zinc-100">Macroeconomic &amp; Parliamentary Desk</div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Curates real-time monetary policy releases, Central Bank of Sri Lanka (CBSL) currency fixing tables, treasury bill yields, and legislative parliamentary records.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#111216] border border-white/[0.06] space-y-2">
              <div className="text-xs font-mono font-bold text-white uppercase flex items-center justify-between">
                <span>Fact-Checking &amp; Corroboration Desk</span>
                <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">Verification</span>
              </div>
              <div className="text-sm font-semibold text-zinc-100">Cross-Publisher Review Team</div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Cross-references breaking dispatches across multiple newsrooms, monitors source retractions, and enforces strict standards for single-source developing stories.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#111216] border border-white/[0.06] space-y-2">
              <div className="text-xs font-mono font-bold text-white uppercase flex items-center justify-between">
                <span>Systems &amp; Ingestion Architect</span>
                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">Data Engineering</span>
              </div>
              <div className="text-sm font-semibold text-zinc-100">Algorithmic Wire Infrastructure</div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Maintains Cloudflare edge ingestion workers, RSS 2.0 streaming conduits, Google News XML feeds, and strict zero-hallucination neural summarization pipelines.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Multi-Source Standards & Editorial Policy */}
        <section id="editorial-policy" className="space-y-4 pt-4 border-t border-white/[0.08] scroll-mt-20">
          <h2 className="text-xl font-bold text-white font-headline flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>3. Verification Standards &amp; Attribution Integrity</span>
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Our newsroom operates on strict verification principles designed to prevent misinformation and honor the intellectual property of original journalists:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[#111216] border border-white/[0.06] space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Multi-Source Corroboration</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Dispatches corroborated by three or more independent newsdesks receive our <em>High Corroboration</em> rating. Developing dispatches from a single outlet are clearly highlighted as developing wires.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#111216] border border-white/[0.06] space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Unambiguous Source Attribution</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Every story card and full-view dispatch prominently displays the primary reporting outlet, publishing timestamp, original author byline (when available), and direct outbound links driving traffic to the canonical source.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#111216] border border-white/[0.06] space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Fair Dealing Compliance</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Lanka Dispatch strictly adheres to Section 12 of Sri Lanka&apos;s <em>Intellectual Property Act No. 36 of 2003</em> (Fair Dealing for news reporting). We do not reproduce verbatim full-text articles; we deliver transformative Smart Brevity summaries and analytical context.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#111216] border border-white/[0.06] space-y-2" id="diversity-policy">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Trilingual Linguistic Parity</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Comprehensive multilingual parity across English, Sinhala (සිංහල), and Tamil (தமிழ்), providing equal, unbiased access to civic, economic, and national news for all Sri Lankan communities.
              </p>
            </div>
          </div>
        </section>

        {/* 4. AI Grounding & Neural Ethics */}
        <section id="ai-ethics" className="space-y-4 pt-4 border-t border-white/[0.08] scroll-mt-20">
          <h2 className="text-xl font-bold text-white font-headline flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            <span>4. AI Grounding &amp; Zero-Hallucination Policy</span>
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Lanka Dispatch uses machine intelligence (powered by advanced Google Gemini neural architectures) strictly for technical acceleration — never to fabricate reporting:
          </p>
          <ul className="list-disc list-inside space-y-2 text-xs text-zinc-300 pl-2 leading-relaxed">
            <li>
              <strong>Strict Factual Grounding:</strong> Neural models are mathematically constrained to synthesize <em>only</em> verifiable facts present within the cited primary broadsheet wire articles. Speculative extrapolation, simulated commentary, and ungrounded statements are strictly blocked.
            </li>
            <li>
              <strong>Deterministic Summarization:</strong> Summaries are structured using the <em>Smart Brevity</em> format (Key Takeaway, Factual Context, Broader Impact) so readers can grasp verified facts in under 60 seconds.
            </li>
            <li>
              <strong>No Synthetic Authorship:</strong> Machine models are credited as algorithmic processing engines under the oversight of the <em>Lanka Dispatch Wire Desk</em>; synthetic persona bylines are strictly prohibited.
            </li>
          </ul>
        </section>

        {/* 5. Corrections & Retractions Policy (Google News Trust Requirement) */}
        <section id="corrections-policy" className="space-y-4 pt-4 border-t border-white/[0.08] scroll-mt-20">
          <h2 className="text-xl font-bold text-white font-headline flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            <span>5. Corrections, Clarifications &amp; Retractions Policy</span>
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Accuracy is the cornerstone of our credibility. Lanka Dispatch is committed to swift, transparent corrections whenever factual inaccuracies occur in upstream wire reports or our synthesized dispatches:
          </p>

          <div className="p-5 rounded-xl bg-[#111216] border border-white/[0.08] space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase">
              <Scale className="w-4 h-4 text-rose-400" />
              <span>Our Formal Corrigendum Standards</span>
            </div>
            <ul className="list-disc list-inside space-y-2 text-xs text-zinc-300 pl-2 leading-relaxed">
              <li>
                <strong>Upstream Publisher Modifications:</strong> When a syndicating wire service (e.g. <em>Reuters</em> or <em>Daily Mirror</em>) issues a factual update or clarification, our ingestion pipeline propagates updates within 12 hours.
              </li>
              <li>
                <strong>Substantive Retractions:</strong> If a wire story is formally retracted by the original publisher due to false reporting or defamation, Lanka Dispatch immediately unpublishes the dispatch from our live index.
              </li>
              <li>
                <strong>Public Reporting Channel:</strong> Any reader, journalist, or public official who identifies an inaccuracy can submit a correction request directly to our desk at <a href="mailto:corrections@lankadispatch.com" className="text-rose-400 underline font-mono">corrections@lankadispatch.com</a>. Every submission is investigated by human editorial staff within 24 hours.
              </li>
            </ul>
          </div>
        </section>

        {/* 6. Independence, Ownership & Advertising Separation */}
        <section id="ethics-policy" className="space-y-4 pt-4 border-t border-white/[0.08] scroll-mt-20">
          <h2 className="text-xl font-bold text-white font-headline flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span>6. Ownership, Independence &amp; Commercial Separation</span>
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            <strong>Ownership Disclosure:</strong> LANKA DISPATCH is an independently owned and operated digital publication headquartered in Colombo, Sri Lanka. We maintain no financial or operational ties to any political party, religious organization, state agency, or partisan lobbying group.
          </p>
          <p className="text-sm text-zinc-300 leading-relaxed">
            <strong>Commercial Transparency:</strong> Operations are funded through programmatic display advertising (Google AdSense, IAB-certified supply platforms). Advertising units are strictly partitioned from editorial content, labelled with &quot;Advertisement&quot; notices, and have zero influence over story curation or headline synthesis.
          </p>
        </section>

        {/* 7. Bureau Address & Newsroom Contacts */}
        <section id="contact" className="space-y-4 pt-4 border-t border-white/[0.08] scroll-mt-20">
          <h2 className="text-xl font-bold text-white font-headline flex items-center gap-2">
            <MapPin className="w-5 h-5 text-rose-400" />
            <span>7. Newsdesk Bureau &amp; Verification Inquiries</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-lg bg-[#111216] border border-white/[0.06] space-y-2">
              <div className="text-zinc-400 uppercase tracking-wider font-bold">Colombo Newsroom Bureau</div>
              <div className="text-zinc-100 font-bold">LANKA DISPATCH Media Network</div>
              <div className="text-zinc-300">Level 12, World Trade Center, Echelon Square</div>
              <div className="text-zinc-400">Colombo 00100, Western Province, Sri Lanka</div>
              <div className="text-zinc-500 pt-1">Operating Hours: 24/7/365 Continuous Wire Desk</div>
            </div>

            <div className="p-4 rounded-lg bg-[#111216] border border-white/[0.06] space-y-2">
              <div className="text-zinc-400 uppercase tracking-wider font-bold">Official Inquiries &amp; Desks</div>
              <div>Editorial Desk: <a href="mailto:desk@lankadispatch.com" className="text-rose-400 hover:underline">desk@lankadispatch.com</a></div>
              <div>Corrections &amp; Corrigenda: <a href="mailto:corrections@lankadispatch.com" className="text-rose-400 hover:underline">corrections@lankadispatch.com</a></div>
              <div>Press Releases &amp; Wire: <a href="mailto:wire@lankadispatch.com" className="text-zinc-200 hover:underline">wire@lankadispatch.com</a></div>
              <div>Advertising &amp; Partnerships: <a href="mailto:advertising@lankadispatch.com" className="text-zinc-200 hover:underline">advertising@lankadispatch.com</a></div>
              <div>Legal &amp; Grievances: <a href="mailto:legal@lankadispatch.com" className="text-zinc-200 hover:underline">legal@lankadispatch.com</a></div>
            </div>
          </div>
        </section>

        {/* Back to top / home footer */}
        <div className="pt-8 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-zinc-500">
          <div>&copy; {new Date().getFullYear()} LANKA DISPATCH Media Network. All rights reserved.</div>
          <Link href="/" className="text-rose-400 hover:underline">Return to Live Wire &rarr;</Link>
        </div>
      </main>
    </div>
  );
}
