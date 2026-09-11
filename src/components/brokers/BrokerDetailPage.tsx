import React, { useState, useId } from 'react';
import { Broker, UserProfile } from '../../types';
import {
  Check,
  ArrowLeft,
  DollarSign,
  User,
  Building2,
  ChevronDown,
  Calendar,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Globe,
  Award,
  Lock,
  Zap,
} from 'lucide-react';

interface BrokerDetailPageProps {
  broker: Broker;
  user: UserProfile;
  onBackToBrokers: () => void;
  onNavigateToConnectBroker: (broker: Broker) => void;
  onOpenViewPlan?: () => void;
  onShowToast?: (msg: string) => void;
}

export const BrokerDetailPage: React.FC<BrokerDetailPageProps> = ({
  broker,
  user,
  onBackToBrokers,
  onNavigateToConnectBroker,
  onOpenViewPlan,
  onShowToast,
}) => {
  // Scenario Toggle: Partner with Cashback (Scenario A) vs Partner with No Cashback (Scenario B)
  // Default to broker's cashback capability, but allow instant switcher testing!
  const [hasCashbackScenario, setHasCashbackScenario] = useState<boolean>(
    broker.hasCashback !== false
  );

  // Active Tab: If cashback scenario -> default 'cashback'. If no-cashback scenario -> default 'account'
  const [activeTab, setActiveTab] = useState<'cashback' | 'account' | 'company'>(
    broker.hasCashback !== false ? 'cashback' : 'account'
  );

  // Monthly Lots Interactive Slider in Top Purple Card
  const [lotsPerMonth, setLotsPerMonth] = useState<number>(25);

  // Calculator Inputs in Cashback Tab
  const [selectedAccountType, setSelectedAccountType] = useState<string>('Bonus');
  const [selectedMemberLevel, setSelectedMemberLevel] = useState<string>('Rookie');
  const [dailyLotsInput, setDailyLotsInput] = useState<string>('0');
  const lotsInputId = useId();

  // Tier multiplier mapping
  const tierMultipliers: Record<string, number> = {
    Rookie: 1.0,
    Climber: 1.15,
    Pro: 1.25,
    Master: 1.35,
    Boss: 1.5,
  };

  // Account Type Base Rates per lot
  const accountTypeRates: Record<string, number> = {
    Bonus: 5.0,
    Standard: 6.0,
    Premium: 7.0,
    Pro: 8.0,
    'Zero (ECN)': 2.0,
  };

  // Dynamic calculations for Top Purple Card
  const cashbackPerLot = broker.cashbackPerLot || 8.0;
  const calculatedMonthly = Math.round(lotsPerMonth * cashbackPerLot * 0.6);
  const calculatedAnnual = calculatedMonthly * 12;

  // Dynamic calculations for Cashback tab metrics
  const numDailyLots = parseFloat(dailyLotsInput) || 0;
  const currentBaseRate = accountTypeRates[selectedAccountType] || 6.0;
  const currentMultiplier = tierMultipliers[selectedMemberLevel] || 1.0;
  const effectiveRate = currentBaseRate * currentMultiplier;

  const dailyCashback = (numDailyLots * effectiveRate).toFixed(2);
  const weeklyCashback = (numDailyLots * effectiveRate * 5).toFixed(2);
  const monthlyCashback = (numDailyLots * effectiveRate * 22).toFixed(2);
  const annualCashback = (numDailyLots * effectiveRate * 260).toFixed(2);

  const accountTypesList = ['Bonus', 'Standard', 'Premium', 'Pro', 'Zero (ECN)'];

  // Render stylized SVG/Logo
  const renderBrokerLogo = () => {
    const name = broker.name.toLowerCase();
    if (name.includes('hfm')) {
      return (
        <div className="w-16 h-16 rounded-2xl bg-black flex flex-col items-center justify-center text-white shrink-0 p-1 shadow-md">
          <span className="font-extrabold text-lg tracking-tighter leading-none">HFM</span>
          <span className="text-[8px] text-red-500 font-bold tracking-widest mt-0.5">HF MARKETS</span>
        </div>
      );
    }
    if (name.includes('xm')) {
      return (
        <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center text-white shrink-0 shadow-md relative overflow-hidden">
          <div className="absolute w-2.5 h-2.5 rounded-full bg-red-600 top-2.5 right-2.5" />
          <span className="font-black text-2xl tracking-tight">XM</span>
        </div>
      );
    }
    if (name.includes('exness')) {
      return (
        <div className="w-16 h-16 rounded-2xl bg-[#FEE600] flex items-center justify-center text-black shrink-0 shadow-md">
          <span className="font-black text-3xl tracking-tighter lowercase font-mono">ex</span>
        </div>
      );
    }
    return (
      <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-md font-black text-xl">
        {broker.name.slice(0, 3).toUpperCase()}
      </div>
    );
  };

  return (
    <div id="broker-detail-page" className="w-full space-y-8 pb-20">
      {/* ─────────────────────────────────────────────────────────────
          TOP CONTROLS & SCENARIO TOGGLE BAR
         ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 border-b border-slate-200/80 pb-4">
        {/* Back Button */}
        <button
          type="button"
          onClick={onBackToBrokers}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#5945F1] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Partner Brokers</span>
        </button>

        {/* Interactive Scenario Switcher (Allows testing both scenarios directly as requested) */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <span className="text-slate-500 font-semibold px-2 hidden md:inline">Preview Mode:</span>
          <button
            type="button"
            onClick={() => {
              setHasCashbackScenario(true);
              setActiveTab('cashback');
              onShowToast?.('Switched to Scenario: Partner with Cashback');
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              hasCashbackScenario
                ? 'bg-white text-[#5945F1] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Partner with Cashback
          </button>
          <button
            type="button"
            onClick={() => {
              setHasCashbackScenario(false);
              setActiveTab('account');
              onShowToast?.('Switched to Scenario: Partner with No Cashback');
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              !hasCashbackScenario
                ? 'bg-white text-[#5945F1] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Partner with No Cashback
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TOP SECTION: 2-COLUMN HEADER CARDS
          Left Card: Broker Overview with Pink Border
          Right Card: Cashback with MarketSyde (Purple Card)
         ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT CARD: BROKER SPECS & SUMMARY (7 COLS ON LG) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border-2 border-[#FD02B0]/80 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-5">
            {/* Top Identity Row: Logo, Name, Badge, Founded */}
            <div className="flex items-start gap-4">
              {renderBrokerLogo()}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5">
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-[#0b1c30]">
                    {broker.name}
                  </h2>
                  {broker.verified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#CAEB0E] text-black text-xs font-extrabold tracking-tight">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Headquarter: {broker.headquarters || 'Cyprus'} | Founded: {broker.founded || 2009}
                </p>
              </div>
            </div>

            {/* Highlights Banner */}
            <div className="bg-[#f8fafc] border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs text-slate-700 font-medium">
              <span className="font-bold text-slate-900">Highlights:</span>{' '}
              {broker.highlights || `${broker.name} is popular for its account flexibility and execution quality.`}
            </div>

            {/* Summary Section */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#0b1c30]">Summary</h4>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#F0EDFF] text-[#5945F1] text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#5945F1]" />
                  <span>Tier 1 Regulated</span>
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex items-start gap-3">
                  <span className="w-40 text-slate-500 shrink-0">• Min Deposit</span>
                  <span className="font-bold text-slate-900">: From {broker.minDeposit || '$10'}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-40 text-slate-500 shrink-0">• Max Leverage</span>
                  <span className="font-bold text-slate-900">: Up to {broker.maxLeverage || '1:1000'}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-40 text-slate-500 shrink-0">• Platforms</span>
                  <span className="font-bold text-slate-900">: MT4, MT5, Web, App</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-40 text-slate-500 shrink-0">• Spread Type</span>
                  <span className="font-bold text-slate-900">
                    : {broker.spreadType || 'Standard, Ultra-Low, Zero Accounts'}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-40 text-slate-500 shrink-0">• Supported Currencies</span>
                  <span className="font-bold text-slate-900">
                    : {broker.supportedCurrencies?.join(', ') || 'EUR, JPY, THB, USD, IDR, NGN'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT CARD: CASHBACK WITH MARKETSYDE (5 COLS ON LG) */}
        <div className="lg:col-span-5 bg-[#5945F1] rounded-3xl p-6 sm:p-7 text-white shadow-xl flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <h3 className="font-display font-black text-xl sm:text-2xl tracking-tight">
                Cashback with <span className="text-[#CAEB0E]">MarketSyde</span>
              </h3>
            </div>

            {/* Estimated Cashback Metric */}
            <div>
              <div className="text-xs text-white/80 font-medium">Estimated cashback</div>
              <div className="font-display font-black text-3xl sm:text-4xl text-[#CAEB0E] tracking-tight mt-0.5">
                ${cashbackPerLot.toFixed(2)}/lot
              </div>
            </div>

            {/* Lots Slider */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs text-white/90 font-semibold">
                <span>Lots trade per month</span>
                <span className="px-3 py-0.5 rounded-md bg-white text-black font-extrabold text-sm shadow-xs">
                  {lotsPerMonth}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={lotsPerMonth}
                onChange={(e) => setLotsPerMonth(parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#CAEB0E]"
              />
            </div>

            {/* Monthly & Annual Projected Rewards */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-white/80">
                  <Calendar className="w-3.5 h-3.5 text-[#CAEB0E]" />
                  <span>Your monthly rewards</span>
                </div>
                <div className="text-xl sm:text-2xl font-black font-display text-white mt-1">
                  ${calculatedMonthly}
                  <span className="text-xs font-normal text-white/70">/mth.</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs text-white/80">
                  <Calendar className="w-3.5 h-3.5 text-[#CAEB0E]" />
                  <span>Your annual total</span>
                </div>
                <div className="text-xl sm:text-2xl font-black font-display text-white mt-1">
                  ${calculatedAnnual.toLocaleString()}
                  <span className="text-xs font-normal text-white/70">/yr.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button: Connect Now (Scenario 1) or Get Cashback (Scenario 2) */}
          <button
            type="button"
            onClick={() => onNavigateToConnectBroker(broker)}
            className="w-full py-3.5 rounded-xl bg-[#CAEB0E] hover:bg-[#b8d60d] text-black font-black text-sm transition-all shadow-md active:scale-95 cursor-pointer text-center"
          >
            {hasCashbackScenario ? 'Connect Now' : 'Get Cashback'}
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TABS NAVIGATION
          - Scenario 1 (With Cashback): 3 Tabs (Cashback, Account, Company)
          - Scenario 2 (No Cashback): 2 Tabs (Account, Company)
         ───────────────────────────────────────────────────────────── */}
      <div className="space-y-6">
        <div className="flex items-center gap-8 border-b border-slate-200">
          {/* TAB 1: Cashback (ONLY in Scenario 1) */}
          {hasCashbackScenario && (
            <button
              type="button"
              onClick={() => setActiveTab('cashback')}
              className={`flex items-center gap-2 pb-3 font-bold text-sm transition-colors relative cursor-pointer ${
                activeTab === 'cashback'
                  ? 'text-[#5945F1]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs border ${
                  activeTab === 'cashback'
                    ? 'border-[#5945F1] text-[#5945F1]'
                    : 'border-slate-400 text-slate-500'
                }`}
              >
                $
              </div>
              <span>Cashback</span>
              {activeTab === 'cashback' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5945F1]" />
              )}
            </button>
          )}

          {/* TAB 2: Account (Visible in both scenarios) */}
          <button
            type="button"
            onClick={() => setActiveTab('account')}
            className={`flex items-center gap-2 pb-3 font-bold text-sm transition-colors relative cursor-pointer ${
              activeTab === 'account'
                ? 'text-[#5945F1]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Account</span>
            {activeTab === 'account' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5945F1]" />
            )}
          </button>

          {/* TAB 3: Company (Visible in both scenarios) */}
          <button
            type="button"
            onClick={() => setActiveTab('company')}
            className={`flex items-center gap-2 pb-3 font-bold text-sm transition-colors relative cursor-pointer ${
              activeTab === 'company'
                ? 'text-[#5945F1]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Company</span>
            {activeTab === 'company' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5945F1]" />
            )}
          </button>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            TAB CONTENT: 1. CASHBACK (Scenario 1)
           ───────────────────────────────────────────────────────────── */}
        {hasCashbackScenario && activeTab === 'cashback' && (
          <div className="space-y-10 animate-in fade-in duration-200">
            {/* Interactive Calculator Section */}
            <div className="space-y-4">
              <div>
                <h3 className="font-display font-black text-xl text-[#0b1c30]">
                  See Your Cashback
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Estimate your cashback based on account type, membership level and trading volume.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
                {/* Left Form: Account Type, Member Level, Lots per Day */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Account Type Pills */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">Account Type</label>
                    <div className="flex flex-wrap items-center gap-2">
                      {accountTypesList.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setSelectedAccountType(type)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            selectedAccountType === type
                              ? 'bg-[#F0EDFF] text-[#5945F1] border border-[#5945F1]/40 shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Member Level Selector & Lots per day input */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Member Level Dropdown */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Member Level</label>
                      <div className="relative">
                        <select
                          value={selectedMemberLevel}
                          onChange={(e) => setSelectedMemberLevel(e.target.value)}
                          className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#5945F1] shadow-2xs pr-8 cursor-pointer"
                        >
                          <option value="Rookie">Rookie</option>
                          <option value="Climber">Climber (+15%)</option>
                          <option value="Pro">Pro (+25%)</option>
                          <option value="Master">Master (+35%)</option>
                          <option value="Boss">Boss (+50%)</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Number of Lots per day */}
                    <div className="space-y-1.5">
                      <label htmlFor={lotsInputId} className="text-xs font-bold text-slate-700">Number of Lot</label>
                      <div>
                        <input
                          id={lotsInputId}
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="0"
                          value={dailyLotsInput}
                          onChange={(e) => setDailyLotsInput(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#5945F1] shadow-2xs"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">per day</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Metric Boxes: 2x2 Grid (Lime and Purple Tiles matching design) */}
                <div className="lg:col-span-5 space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Tile 1: Daily (Lime #CAEB0E) */}
                    <div className="bg-[#CAEB0E] rounded-2xl p-5 flex flex-col justify-center text-center shadow-xs">
                      <div className="font-display font-black text-xl sm:text-2xl text-black">
                        $ {dailyCashback} <span className="text-xs font-semibold text-black/80">/day</span>
                      </div>
                    </div>

                    {/* Tile 2: Weekly (Purple #5945F1) */}
                    <div className="bg-[#5945F1] rounded-2xl p-5 flex flex-col justify-center text-center shadow-xs text-white">
                      <div className="font-display font-black text-xl sm:text-2xl">
                        $ {weeklyCashback} <span className="text-xs font-normal text-white/80">/week</span>
                      </div>
                    </div>

                    {/* Tile 3: Monthly (Purple #5945F1) */}
                    <div className="bg-[#5945F1] rounded-2xl p-5 flex flex-col justify-center text-center shadow-xs text-white">
                      <div className="font-display font-black text-xl sm:text-2xl">
                        $ {monthlyCashback} <span className="text-xs font-normal text-white/80">/month</span>
                      </div>
                    </div>

                    {/* Tile 4: Annual (Purple #5945F1) */}
                    <div className="bg-[#5945F1] rounded-2xl p-5 flex flex-col justify-center text-center shadow-xs text-white">
                      <div className="font-display font-black text-xl sm:text-2xl">
                        $ {annualCashback} <span className="text-xs font-normal text-white/80">/annual</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 text-center pt-1">
                    Based on standard forex lot rate
                  </p>
                </div>
              </div>
            </div>

            {/* Cashback Breakdown Table Section */}
            <div className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-display font-black text-xl text-[#0b1c30]">
                  {broker.name} Cashback Breakdown
                </h3>
                <button
                  type="button"
                  onClick={() => onOpenViewPlan?.()}
                  className="text-xs font-bold text-[#5945F1] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Rates shown are for &apos;Boss&apos; level members. View for all levels →</span>
                </button>
              </div>

              {/* Table Container with Light Purple Border */}
              <div className="overflow-x-auto rounded-2xl border border-indigo-200/80 bg-white shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-indigo-100 text-slate-700">
                      <th className="py-4 px-6 font-bold w-44"></th>
                      <th className="py-4 px-6 font-bold text-center text-[#5945F1]">Bonus</th>
                      <th className="py-4 px-6 font-bold text-center text-[#5945F1]">Standard</th>
                      <th className="py-4 px-6 font-bold text-center text-[#5945F1]">Premium</th>
                      <th className="py-4 px-6 font-bold text-center text-[#5945F1]">Pro</th>
                      <th className="py-4 px-6 font-bold text-center text-[#5945F1]">Zero (ECN)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold">
                    <tr>
                      <td className="py-5 px-6 font-bold text-slate-900">Forex</td>
                      <td className="py-5 px-6 text-center font-black text-[#5945F1] text-base">
                        $5.00<span className="text-xs text-slate-500 font-normal">/Lot</span>
                      </td>
                      <td className="py-5 px-6 text-center font-black text-[#5945F1] text-base">
                        $6.00<span className="text-xs text-slate-500 font-normal">/Lot</span>
                      </td>
                      <td className="py-5 px-6 text-center font-black text-[#5945F1] text-base">
                        $7.00<span className="text-xs text-slate-500 font-normal">/Lot</span>
                      </td>
                      <td className="py-5 px-6 text-center font-black text-[#5945F1] text-base relative">
                        <div>
                          $8.00<span className="text-xs text-slate-500 font-normal">/Lot</span>
                        </div>
                        <span className="inline-block px-2 py-0.5 rounded-full bg-[#FD02B0] text-white text-[9px] font-bold mt-1">
                          Highest
                        </span>
                      </td>
                      <td className="py-5 px-6 text-center font-black text-[#5945F1] text-base">
                        $2.00<span className="text-xs text-slate-500 font-normal">/Lot</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB CONTENT: 2. ACCOUNT (Accounts & Conditions - Image 2)
           ───────────────────────────────────────────────────────────── */}
        {activeTab === 'account' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="font-display font-black text-xl text-[#0b1c30]">
                Accounts &amp; Conditions
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Explore the account types available and find the right match for your trading approach.
              </p>
            </div>

            {/* Accounts Conditions Table (Matching Screenshot 2) */}
            <div className="overflow-x-auto rounded-2xl border border-indigo-200/80 bg-white shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-indigo-100 text-[#5945F1] bg-slate-50/50">
                    <th className="py-4 px-6 font-bold w-48 text-slate-700"></th>
                    <th className="py-4 px-6 font-bold text-center">Bonus</th>
                    <th className="py-4 px-6 font-bold text-center">Standard</th>
                    <th className="py-4 px-6 font-bold text-center">Premium</th>
                    <th className="py-4 px-6 font-bold text-center">Pro</th>
                    <th className="py-4 px-6 font-bold text-center">Zero (ECN)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {/* Row 1: Spread type */}
                  <tr>
                    <td className="py-4 px-6 font-semibold text-slate-900">Spread type</td>
                    <td className="py-4 px-6 text-center">Wide</td>
                    <td className="py-4 px-6 text-center">Standard</td>
                    <td className="py-4 px-6 text-center">Tight</td>
                    <td className="py-4 px-6 text-center">Tighter</td>
                    <td className="py-4 px-6 text-center font-bold text-[#5945F1]">Raw 0.0–0.2</td>
                  </tr>

                  {/* Row 2: Commission */}
                  <tr>
                    <td className="py-4 px-6 font-semibold text-slate-900">Commission</td>
                    <td className="py-4 px-6 text-center text-slate-400">✕</td>
                    <td className="py-4 px-6 text-center text-slate-400">✕</td>
                    <td className="py-4 px-6 text-center text-slate-400">✕</td>
                    <td className="py-4 px-6 text-center text-slate-400">✕</td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#CAEB0E] text-black font-extrabold text-[11px]">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>$3/lot/side</span>
                      </span>
                    </td>
                  </tr>

                  {/* Row 3: Min deposit */}
                  <tr>
                    <td className="py-4 px-6 font-semibold text-slate-900">Min deposit</td>
                    <td className="py-4 px-6 text-center">$10</td>
                    <td className="py-4 px-6 text-center">$10</td>
                    <td className="py-4 px-6 text-center">$50</td>
                    <td className="py-4 px-6 text-center">$100</td>
                    <td className="py-4 px-6 text-center font-bold">$200</td>
                  </tr>

                  {/* Row 4: Min trade volume */}
                  <tr>
                    <td className="py-4 px-6 font-semibold text-slate-900">Min trade volume</td>
                    <td className="py-4 px-6 text-center">0.01 lot</td>
                    <td className="py-4 px-6 text-center">0.01 lot</td>
                    <td className="py-4 px-6 text-center">0.01 lot</td>
                    <td className="py-4 px-6 text-center">0.10 lot</td>
                    <td className="py-4 px-6 text-center">0.10 lot</td>
                  </tr>

                  {/* Row 5: Max leverage */}
                  <tr>
                    <td className="py-4 px-6 font-semibold text-slate-900">Max leverage</td>
                    <td className="py-4 px-6 text-center">1:1000</td>
                    <td className="py-4 px-6 text-center">1:1000</td>
                    <td className="py-4 px-6 text-center">1:500</td>
                    <td className="py-4 px-6 text-center">1:500</td>
                    <td className="py-4 px-6 text-center">1:200</td>
                  </tr>

                  {/* Row 6: Trading platforms */}
                  <tr>
                    <td className="py-4 px-6 font-semibold text-slate-900">Trading platforms</td>
                    <td className="py-4 px-6 text-center">MT4, MT5</td>
                    <td className="py-4 px-6 text-center">MT4, MT5</td>
                    <td className="py-4 px-6 text-center">MT4, MT5</td>
                    <td className="py-4 px-6 text-center">MT4, MT5</td>
                    <td className="py-4 px-6 text-center">MT4, MT5</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB CONTENT: 3. COMPANY (Company Information & Safety)
           ───────────────────────────────────────────────────────────── */}
        {activeTab === 'company' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="font-display font-black text-xl text-[#0b1c30]">
                Company Profile &amp; Regulatory Safety
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Verified background and fund security measures of {broker.name}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Regulatory Credentials */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 text-[#5945F1]">
                  <ShieldCheck className="w-5 h-5" />
                  <h4 className="font-bold text-sm text-[#0b1c30]">Regulations &amp; Licenses</h4>
                </div>
                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <span className="text-slate-500">Tier 1 Authority:</span>
                    <span className="font-bold text-slate-900">CySEC (Cyprus Securities &amp; Exchange)</span>
                  </div>
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <span className="text-slate-500">UK Authorization:</span>
                    <span className="font-bold text-slate-900">FCA (Financial Conduct Authority)</span>
                  </div>
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <span className="text-slate-500">Africa Region:</span>
                    <span className="font-bold text-slate-900">FSCA (Financial Sector Conduct Authority)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Institutional Safety:</span>
                    <span className="font-bold text-emerald-600">Tier 1 Segregated Accounts</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Fund Protection & Banking */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 text-[#5945F1]">
                  <Lock className="w-5 h-5" />
                  <h4 className="font-bold text-sm text-[#0b1c30]">Safety of Client Funds</h4>
                </div>
                <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                  <p>
                    • <strong>Segregated Bank Accounts:</strong> Client funds are held completely separate from operational corporate funds in top-tier global banks.
                  </p>
                  <p>
                    • <strong>Negative Balance Protection:</strong> Retail client balances are legally guaranteed to never drop below zero during extreme market volatility.
                  </p>
                  <p>
                    • <strong>Investor Compensation Fund:</strong> Eligible accounts are protected up to €20,000 under applicable regulatory schemes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
