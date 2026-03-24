"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, Shield, Star, User, Car, Briefcase, Wallet, Zap, Calendar, Route, ArrowRight } from "lucide-react";
import dynamic from 'next/dynamic';
import { useState } from "react";


// ─────────────────────────────────────────────
// 1. HERO SECTION
// ─────────────────────────────────────────────
const HeroSection = () => {

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white min-h-[85vh] flex items-center">
      {/* Animated blobs */}
      <div className="absolute top-[-10%] left-[10%] w-72 h-72 md:w-96 md:h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob pointer-events-none" />
      <div className="absolute top-[20%] right-[5%] w-72 h-72 md:w-96 md:h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[30%] w-72 h-72 md:w-80 md:h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 md:px-6 py-20 md:py-32">


        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 backdrop-blur-sm rounded-full px-4 py-1.5 text-blue-200 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            India&apos;s Smart Ride Platform — Now Live
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-blue-100 to-blue-300">
            Cargo
          </h1>
          <p className="mt-3 text-xl sm:text-2xl md:text-3xl font-semibold text-blue-200">
            Book. Drive. Own. Earn.
          </p>
          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            India&apos;s first hybrid ride platform where Passengers book instantly or in advance,
            Drivers earn per hour, Owners earn per km — and Self Drivers do it all.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4">
            <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base rounded-full bg-blue-500 hover:bg-blue-400 text-white shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-200 hover:scale-105 font-semibold">
              <Zap size={18} className="mr-2" /> Find a Ride
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base rounded-full border-white/40 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-200 hover:scale-105 font-semibold">
              Join as Driver / Owner <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>

          {/* Quick stats */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mx-auto">
            {[
              { label: "Booking Types", value: "2" },
              { label: "User Roles", value: "4" },
              { label: "Platform Fee", value: "₹1/km" },
              { label: "Instant Window", value: "5 min" },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-white">{s.value}</div>
                <div className="text-xs sm:text-sm text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};



// ─────────────────────────────────────────────
// 3. FEATURES SECTION — accurate from rulebook
// ─────────────────────────────────────────────
const features = [
  {
    icon: <Zap size={28} className="text-blue-500" />,
    bg: "bg-blue-50 dark:bg-blue-500/10",
    title: "Instant Booking",
    description:
      "Real-time ride matching. Send requests to up to 10 Self Drivers simultaneously — 5-minute window per batch. First to accept wins.",
  },
  {
    icon: <Calendar size={28} className="text-violet-500" />,
    bg: "bg-violet-50 dark:bg-violet-500/10",
    title: "Prebooking",
    description:
      "Schedule rides hours or days in advance. Requests go to Driver+Owner pairs; both must accept before the trip is confirmed.",
  },
  {
    icon: <Route size={28} className="text-emerald-500" />,
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    title: "Smart Pair Matching",
    description:
      "System auto-pairs the best Driver+Vehicle combos — sorted by distance (nearest first) and then price (cheapest first).",
  },
  {
    icon: <Wallet size={28} className="text-amber-500" />,
    bg: "bg-amber-50 dark:bg-amber-500/10",
    title: "Dual Wallet System",
    description:
      "Added Balance for payments (top-up via UPI). Generated Balance for your trip earnings — fully withdrawable to your bank.",
  },
  {
    icon: <MapPin size={28} className="text-rose-500" />,
    bg: "bg-rose-50 dark:bg-rose-500/10",
    title: "Live Tracking",
    description:
      "Track your driver in real-time via Socket.io. Know exactly when they leave, where they are, and when they arrive.",
  },
  {
    icon: <Shield size={28} className="text-cyan-500" />,
    bg: "bg-cyan-50 dark:bg-cyan-500/10",
    title: "Verified & Secure",
    description:
      "License type is matched to vehicle type (e.g. LMV → Car, MCWG → Bike). All users are KYC-verified before going live.",
  },
];

const FeaturesSection = () => (
  <section className="py-16 md:py-24 bg-white dark:bg-slate-900">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 dark:text-white">
          Why Cargo is Different
        </h2>
        <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full" />
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto mt-4 text-base md:text-lg">
          Built for everyone — passengers who need flexibility and providers who want to earn fairly.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {features.map((f, i) => (
          <Card key={i} className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-slate-800 overflow-hidden group">
            <CardContent className="p-7">
              <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                {f.icon}
              </div>
              <h3 className="text-lg font-bold mb-2 dark:text-white">{f.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{f.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────
// 4. USER ROLES — 4 correct roles from rulebook
// ─────────────────────────────────────────────
const roles = [
  {
    icon: <User size={28} className="text-blue-500" />,
    bg: "bg-blue-50 dark:bg-blue-500/10",
    badge: "🟢 Passenger",
    title: "Passenger",
    accent: "border-blue-400",
    bookingTypes: "Instant + Prebooking",
    items: [
      "Default role — every user starts as a Passenger",
      "Book a ride now (Instant) or schedule it in advance (Prebooking)",
      "Pays via Added Balance wallet — UPI / bank top-up",
      "Rate Driver and Vehicle after every trip",
    ],
  },
  {
    icon: <Briefcase size={28} className="text-emerald-500" />,
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    badge: "🔵 Driver",
    title: "Driver",
    accent: "border-emerald-400",
    bookingTypes: "Prebooking only",
    items: [
      "Has a license — no vehicle of their own",
      "Pairs with an Owner's vehicle for each trip",
      "Earns hourly Driver Rate from every trip",
      "License type auto-matched to vehicle type (e.g. LMV → Car)",
    ],
  },
  {
    icon: <Car size={28} className="text-orange-500" />,
    bg: "bg-orange-50 dark:bg-orange-500/10",
    badge: "🟠 Owner",
    title: "Vehicle Owner",
    accent: "border-orange-400",
    bookingTypes: "Prebooking only",
    items: [
      "Owns vehicle(s) — doesn't drive them personally",
      "Rents vehicle to verified Drivers via the platform",
      "Earns per-km Vehicle Rate from every trip",
      "Can manage multiple vehicles independently",
    ],
  },
  {
    icon: <Star size={28} className="text-purple-500" />,
    bg: "bg-purple-50 dark:bg-purple-500/10",
    badge: "🟣 Self Driver",
    title: "Self Driver",
    accent: "border-purple-400",
    bookingTypes: "Instant + Prebooking",
    items: [
      "Has a license AND owns the vehicle — drives it personally",
      "Unlocks Instant Booking (real-time) and Prebooking both",
      "Earns Driver Rate + Vehicle Rate from every trip",
      "Vehicle is permanently reserved — only they can use it",
    ],
  },
];

const UserRolesSection = () => (
  <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-950">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 dark:text-white">Who is Cargo For?</h2>
        <p className="text-slate-500 dark:text-slate-400">4 roles, each designed for a specific way to participate.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {roles.map((role, i) => (
          <Card key={i} className={`border-t-4 ${role.accent} hover:shadow-xl transition-all duration-300 dark:bg-slate-900 bg-white`}>
            <CardHeader className="flex flex-col items-center gap-3 text-center pt-7 pb-3">
              <div className={`w-14 h-14 rounded-2xl ${role.bg} flex items-center justify-center`}>
                {role.icon}
              </div>
              <CardTitle className="text-xl font-bold dark:text-white">{role.title}</CardTitle>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {role.bookingTypes}
              </span>
            </CardHeader>
            <CardContent className="pb-7">
              <ul className="space-y-2.5 mt-2">
                {role.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <span className="mt-0.5 text-green-500 shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────
// 5. HOW IT WORKS — Instant Booking flow
// ─────────────────────────────────────────────
const steps = [
  {
    step: 1,
    title: "Sign Up & Get Verified",
    description:
      "Create your account. Passengers can book immediately. Drivers upload license; Owners list their vehicle. KYC ensures safety for all.",
  },
  {
    step: 2,
    title: "Find Your Match",
    description:
      "Select vehicle type, pickup, and destination. Cargo's system finds the best nearby Self Drivers (Instant) or Driver+Owner pairs (Prebooking), sorted by distance & price.",
  },
  {
    step: 3,
    title: "Send Requests & Confirm",
    description:
      "Select up to 10 options and send requests simultaneously. The first Driver to accept appears on your screen — approve to confirm, or wait for more offers.",
  },
  {
    step: 4,
    title: "Ride & Pay Securely",
    description:
      "Driver arrives, trip starts with live tracking. After completion, fare is split automatically: Driver Rate → Driver, Vehicle Rate → Owner, ₹1/km → Cargo.",
  },
];

const HowItWorksSection = () => (
  <section className="py-16 md:py-24 bg-white dark:bg-slate-900">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 dark:text-white">How Cargo Works</h2>
        <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full" />
      </div>

      {/* Mobile: vertical numbered list | Desktop: alternating timeline */}
      <div className="relative max-w-4xl mx-auto">
        {/* Desktop centre line */}
        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 opacity-20" />

        <div className="space-y-10 md:space-y-16">
          {steps.map((item, index) => (
            <div
              key={item.step}
              className={`relative flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-0 ${
                index % 2 === 0 ? "" : "md:flex-row-reverse"
              }`}
            >
              {/* Card */}
              <div className="w-full md:w-[calc(50%-2.5rem)]">
                <div
                  className={`bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow ${
                    index % 2 === 0 ? "md:mr-10" : "md:ml-10"
                  }`}
                >
                  <div className="text-blue-600 dark:text-blue-400 font-bold text-xs tracking-widest uppercase mb-1">
                    Step {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2 dark:text-white">{item.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Desktop Circle badge */}
              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-14 h-14 rounded-full bg-white dark:bg-slate-900 border-4 border-blue-500 text-blue-600 dark:text-blue-400 font-extrabold text-xl items-center justify-center shadow-lg">
                {item.step}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────
// 6. PRICING SECTION — real fare formula
// ─────────────────────────────────────────────
const fareComponents = [
  { label: "Driver Rate", formula: "hourlyRate × estimated hours", goes: "Driver", color: "text-blue-600 dark:text-blue-400" },
  { label: "Vehicle Rate", formula: "perKmRate × estimated km", goes: "Owner", color: "text-emerald-600 dark:text-emerald-400" },
  { label: "Platform Fee", formula: "₹1 × km (pickup → destination)", goes: "Cargo", color: "text-orange-600 dark:text-orange-400" },
  { label: "Pickup Charge", formula: "distance(home→pickup) × ₹1 × 2", goes: "Driver 60% + Owner 40%", color: "text-purple-600 dark:text-purple-400" },
];

const PricingSection = () => (
  <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-950">
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 dark:text-white">Transparent Pricing</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
          Every rupee is accounted for. No surge pricing. No hidden fees.
        </p>
      </div>

      {/* Fare formula cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-12">
        {fareComponents.map((c, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className={`text-2xl font-extrabold mb-3 ${c.color}`}>{c.label}</div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 font-mono leading-relaxed">{c.formula}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Goes to</span>
              <span className={`text-sm font-bold ${c.color}`}>{c.goes}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Example calculation from rulebook */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-lg overflow-hidden">
        <div className="bg-slate-800 dark:bg-slate-950 px-6 py-4 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-400" />
          <span className="text-slate-400 text-sm ml-3 font-mono">fare-example.calc</span>
        </div>
        <div className="p-6 md:p-8 overflow-x-auto">
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
            <strong className="text-slate-700 dark:text-slate-200">Scenario:</strong> 40km car trip, Driver lives 30km from pickup, hourlyRate ₹100/hr, perKmRate ₹12/km, trip time 1.5 hrs
          </p>
          <pre className="font-mono text-sm text-slate-700 dark:text-slate-300 leading-8 whitespace-pre-wrap">
{`Driver Rate    = ₹100/hr × 1.5 hr       = ₹150   → Driver
Vehicle Rate   = ₹12/km × 40 km          = ₹480   → Owner
Platform Fee   = ₹1 × 40 km             = ₹40    → Cargo
Pickup Charge  = 30km × ₹1 × 2          = ₹60    → Driver 60% + Owner 40%
                                         ─────────
Total Fare                               = ₹730`}
          </pre>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl px-4 py-2">
              <span className="font-semibold text-blue-600 dark:text-blue-400">Driver earns</span>
              <span className="text-slate-700 dark:text-slate-300 font-bold">₹150 + ₹36 = ₹186</span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl px-4 py-2">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Owner earns</span>
              <span className="text-slate-700 dark:text-slate-300 font-bold">₹480 + ₹24 = ₹504</span>
            </div>
            <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-500/10 rounded-xl px-4 py-2">
              <span className="font-semibold text-orange-600 dark:text-orange-400">Cargo earns</span>
              <span className="text-slate-700 dark:text-slate-300 font-bold">₹40</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-slate-400 mt-6">
        *Self Driver earns both Driver Rate + Vehicle Rate. Cancellation charges may apply as per platform policy.
      </p>
    </div>
  </section>
);

// ─────────────────────────────────────────────
// ROOT PAGE
// ─────────────────────────────────────────────
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 antialiased selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-blue-100">
      <HeroSection />
      <FeaturesSection />
      <UserRolesSection />
      <HowItWorksSection />
      <PricingSection />
    </main>
  );
}
