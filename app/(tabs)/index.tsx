import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const { width: SW } = Dimensions.get('window');

// ─── Palette ──────────────────────────────────────────────────────────────────
const BG       = '#050508';
const ORANGE   = '#FF8C00';
const CARD_BG  = '#0a0a14';
const MEM_BG   = '#0d0814';

// ─── Mock data ────────────────────────────────────────────────────────────────
const USER_NAME  = 'Rajiv';
const STREAK     = 12;

const FESTIVAL = {
  emoji:    '🪔',
  name:     'అక్షయ తృతీయ',
  sub:      'Auspicious for new beginnings · sunset 6:42 PM',
  dateLabel:'Today',
};

function daysUntil(date: Date): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((d.getTime() - now.getTime()) / 86_400_000));
}

const COUNTDOWNS = [
  { id: 1, label: 'Diwali',      date: new Date(2026, 9, 19), accent: '#22c55e', dim: '#052e16' },
  { id: 2, label: "Mom's B'day", date: new Date(2026, 5, 15), accent: '#3b82f6', dim: '#1e3a5f' },
  { id: 3, label: 'IPL Final',   date: new Date(2026, 4, 25), accent: '#a855f7', dim: '#2e1065' },
  { id: 4, label: 'New Year',    date: new Date(2027, 0,  1), accent: '#f59e0b', dim: '#1c1400' },
];

const MEMORY = {
  title: '28 years ago today',
  text:  'నాన్న first stepped into Hyderabad — May 4, 1998. The move that changed everything for our family.',
};

const FEED = [
  {
    id: 1, strip: '#22c55e', iconBg: '#071f0b', icon: '🏏',
    title: 'IPL Playoffs · Today',
    reason: 'Rajasthan Royals vs Mumbai Indians · 7:30 PM IST · D/N match',
    action: 'Set Alert',
  },
  {
    id: 2, strip: '#3b82f6', iconBg: '#071428', icon: '🚀',
    title: 'ISRO Launch Window',
    reason: 'Chandrayaan-4 orbital insertion burn · 14:22 UTC · Watch ISRO live stream',
    action: 'Watch Live',
  },
  {
    id: 3, strip: '#ec4899', iconBg: '#1a0510', icon: '🪔',
    title: 'అక్షయ తృతీయ History',
    reason: '3 family milestones happened on this date across generations.',
    action: 'Explore',
  },
];

// ─── Cricket score hook ───────────────────────────────────────────────────────
function useCricketScore() {
  const [score, setScore] = useState({
    batting: 'IND', runs: 287, wkts: 6, overs: '42.3', bowling: 'AUS', live: true,
  });

  useEffect(() => {
    const tick = () => {
      // TODO: swap mock for real endpoint:
      // fetch(`https://api.sportradar.com/cricket/trial/v2/en/matches/live/summaries.json?api_key=YOUR_KEY`)
      setScore(p => ({
        ...p,
        runs:  p.runs  + Math.floor(Math.random() * 4),
        overs: (parseFloat(p.overs) + 1).toFixed(1),
      }));
    };
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return score;
}

// ─── 1. Fire streak badge ─────────────────────────────────────────────────────
function FireBadge({ days }: { days: number }) {
  const s = useSharedValue(1);
  useEffect(() => {
    s.value = withRepeat(
      withSequence(
        withTiming(1.35, { duration: 600, easing: Easing.out(Easing.ease) }),
        withTiming(1,    { duration: 600, easing: Easing.in(Easing.ease) }),
      ), -1, false,
    );
  }, []);
  const fireStyle = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));

  return (
    <View style={b.badge}>
      <Animated.Text style={[b.fire, fireStyle]}>🔥</Animated.Text>
      <Text style={b.days}>{days} days</Text>
    </View>
  );
}
const b = StyleSheet.create({
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderWidth: 1, borderColor: ORANGE, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4,
    backgroundColor: 'rgba(255,140,0,0.07)',
  },
  fire: { fontSize: 15 },
  days: { color: ORANGE, fontSize: 13, fontWeight: '700' },
});

// ─── 2. Live score strip ──────────────────────────────────────────────────────
function LiveScoreStrip() {
  const sc = useCricketScore();
  const dot = useSharedValue(1);
  useEffect(() => {
    dot.value = withRepeat(
      withSequence(
        withTiming(1.8, { duration: 700 }),
        withTiming(1,   { duration: 700 }),
      ), -1, false,
    );
  }, []);
  const dotStyle = useAnimatedStyle(() => ({ transform: [{ scale: dot.value }] }));

  return (
    <View style={ls.strip}>
      <Animated.View style={[ls.dot, dotStyle]} />
      <Text style={ls.label} numberOfLines={1}>
        {sc.batting} {sc.runs}/{sc.wkts} · {sc.overs} ov vs {sc.bowling} · LIVE
      </Text>
      <Text style={ls.badge}>LIVE</Text>
    </View>
  );
}
const ls = StyleSheet.create({
  strip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#051209', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
    borderLeftWidth: 3, borderLeftColor: '#22c55e', marginBottom: 20,
  },
  dot:   { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e' },
  label: { flex: 1, color: '#d1fae5', fontSize: 13, fontWeight: '600' },
  badge: {
    color: '#22c55e', fontSize: 10, fontWeight: '800', letterSpacing: 0.8,
    borderWidth: 1, borderColor: '#22c55e', borderRadius: 6,
    paddingHorizontal: 5, paddingVertical: 1,
  },
});

// ─── 3. Hero festival card ────────────────────────────────────────────────────
function HeroFestivalCard() {
  const r1 = useSharedValue(0);
  const r2 = useSharedValue(0);
  useEffect(() => {
    r1.value = withRepeat(withTiming(360, { duration: 16000, easing: Easing.linear }), -1, false);
    r2.value = withRepeat(withTiming(360, { duration: 10000, easing: Easing.linear }), -1, false);
  }, []);
  const ring1Style = useAnimatedStyle(() => ({ transform: [{ rotate: `${r1.value}deg` }] }));
  const ring2Style = useAnimatedStyle(() => ({ transform: [{ rotate: `${r2.value}deg` }] }));

  const CX = (SW - 40) / 2;   // card center X relative to card
  const CY = 75;               // card center Y (150/2)

  return (
    <View style={hf.card}>
      {/* Rotating rings */}
      <Animated.View style={[hf.ring, { width: 200, height: 200, borderRadius: 100, left: CX - 100, top: CY - 100 }, ring1Style]} />
      <Animated.View style={[hf.ring, { width: 300, height: 300, borderRadius: 150, left: CX - 150, top: CY - 150, borderColor: 'rgba(255,140,0,0.07)' }, ring2Style]} />
      <Animated.View style={[hf.ring, { width: 380, height: 380, borderRadius: 190, left: CX - 190, top: CY - 190, borderColor: 'rgba(255,215,0,0.04)' }, ring1Style]} />

      {/* Decorative emoji top-right */}
      <Text style={hf.decoEmoji}>{FESTIVAL.emoji}</Text>

      {/* Content */}
      <View style={hf.content}>
        <Text style={hf.dateLabel}>{FESTIVAL.dateLabel}</Text>
        <Text style={hf.name}>{FESTIVAL.name}</Text>
        <Text style={hf.sub}>{FESTIVAL.sub}</Text>
      </View>
    </View>
  );
}
const hf = StyleSheet.create({
  card: {
    height: 150, borderRadius: 20, backgroundColor: CARD_BG,
    marginBottom: 20, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,140,0,0.18)',
  },
  ring: {
    position: 'absolute',
    borderWidth: 1, borderColor: 'rgba(255,140,0,0.12)',
  },
  decoEmoji: {
    position: 'absolute', top: 10, right: 14,
    fontSize: 64, opacity: 0.18,
  },
  content: { position: 'absolute', bottom: 18, left: 18 },
  dateLabel: {
    color: ORANGE, fontSize: 11, fontWeight: '700',
    letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 4,
  },
  name: { color: '#ffffff', fontSize: 20, fontWeight: '800', marginBottom: 4 },
  sub:  { color: 'rgba(255,255,255,0.55)', fontSize: 12 },
});

// ─── 4. Countdown card ────────────────────────────────────────────────────────
function CountdownCard({ item }: { item: typeof COUNTDOWNS[number] }) {
  const days = daysUntil(item.date);
  return (
    <View style={[cc.card, { backgroundColor: item.dim, borderColor: item.accent + '55' }]}>
      <Text style={[cc.num, { color: item.accent }]}>{days}</Text>
      <Text style={cc.unit}>days</Text>
      <Text style={cc.label}>{item.label}</Text>
    </View>
  );
}
const CARD_W = (SW - 40 - 12 * 3) / 4;
const cc = StyleSheet.create({
  card: {
    width: CARD_W, borderRadius: 14, paddingVertical: 14,
    alignItems: 'center', borderWidth: 1,
  },
  num:   { fontSize: 22, fontWeight: '800', lineHeight: 26 },
  unit:  { color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: 1 },
  label: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '600', marginTop: 6, textAlign: 'center' },
});

// ─── 5. Memory card ───────────────────────────────────────────────────────────
function MemoryCard() {
  return (
    <View style={mc.card}>
      <View style={mc.strip} />
      <View style={mc.body}>
        <Text style={mc.tag}>✦ MEMORY UNLOCKED</Text>
        <Text style={mc.title}>{MEMORY.title}</Text>
        <Text style={mc.text}>{MEMORY.text}</Text>
      </View>
    </View>
  );
}
const mc = StyleSheet.create({
  card: {
    flexDirection: 'row', backgroundColor: MEM_BG, borderRadius: 16,
    marginBottom: 20, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(168,85,247,0.2)',
  },
  strip: { width: 4, backgroundColor: '#a855f7' },
  body:  { flex: 1, padding: 16 },
  tag:   {
    color: '#a855f7', fontSize: 9, fontWeight: '800',
    letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 6,
  },
  title: { color: '#ffffff', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  text:  { color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 19 },
});

// ─── 6. Feed card ─────────────────────────────────────────────────────────────
function FeedCard({ item }: { item: typeof FEED[number] }) {
  return (
    <View style={[fc.card, { borderLeftColor: item.strip }]}>
      <View style={[fc.iconBox, { backgroundColor: item.iconBg }]}>
        <Text style={fc.icon}>{item.icon}</Text>
      </View>
      <View style={fc.body}>
        <Text style={fc.title}>{item.title}</Text>
        <Text style={fc.reason}>{item.reason}</Text>
        <TouchableOpacity style={[fc.btn, { borderColor: item.strip + 'aa' }]}>
          <Text style={[fc.btnText, { color: item.strip }]}>{item.action}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const fc = StyleSheet.create({
  card: {
    flexDirection: 'row', backgroundColor: CARD_BG,
    borderRadius: 16, padding: 14, marginBottom: 10,
    gap: 12, borderLeftWidth: 3,
    borderWidth: 1, borderColor: '#0f0f20',
  },
  iconBox: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  icon:    { fontSize: 22 },
  body:    { flex: 1 },
  title:   { color: '#ffffff', fontSize: 14, fontWeight: '700', marginBottom: 3 },
  reason:  { color: 'rgba(255,255,255,0.45)', fontSize: 12, lineHeight: 18, marginBottom: 10 },
  btn:     {
    alignSelf: 'flex-start', borderRadius: 8, borderWidth: 1,
    paddingHorizontal: 12, paddingVertical: 5,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  btnText: { fontSize: 12, fontWeight: '700' },
});

// ─── 7. Cali FAB ─────────────────────────────────────────────────────────────
function CaliFab() {
  const floatY = useSharedValue(0);
  const glow   = useSharedValue(0.4);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-9, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
        withTiming( 0, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
      ), -1, false,
    );
    glow.value = withRepeat(
      withSequence(
        withTiming(0.85, { duration: 1400 }),
        withTiming(0.4,  { duration: 1400 }),
      ), -1, false,
    );
  }, []);

  const fabStyle  = useAnimatedStyle(() => ({ transform: [{ translateY: floatY.value }] }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glow.value }));

  return (
    <Animated.View style={[fab.wrapper, fabStyle]}>
      <Animated.View style={[fab.glow, glowStyle]} />
      <TouchableOpacity style={fab.btn} activeOpacity={0.8}>
        <Text style={fab.icon}>🔮</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
const fab = StyleSheet.create({
  wrapper: {
    position: 'absolute', bottom: 28, right: 22,
    width: 58, height: 58, alignItems: 'center', justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 74, height: 74, borderRadius: 37,
    backgroundColor: ORANGE, opacity: 0.4,
  },
  btn: {
    width: 58, height: 58, borderRadius: 29,
    backgroundColor: ORANGE,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: ORANGE, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8, shadowRadius: 12, elevation: 10,
  },
  icon: { fontSize: 26 },
});

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function CalendarScreen() {
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}>

        {/* 1 · Top bar */}
        <View style={s.topBar}>
          <Text style={s.greeting}>Hey {USER_NAME} 👋</Text>
          <FireBadge days={STREAK} />
        </View>

        {/* 2 · Live score strip */}
        <LiveScoreStrip />

        {/* 3 · Hero festival card */}
        <HeroFestivalCard />

        {/* 4 · Countdown row */}
        <Text style={s.sectionLabel}>Countdown</Text>
        <View style={s.countdownRow}>
          {COUNTDOWNS.map(item => <CountdownCard key={item.id} item={item} />)}
        </View>

        {/* 5 · Memory card */}
        <MemoryCard />

        {/* 6 · Smart feed */}
        <Text style={s.sectionLabel}>Today's Feed</Text>
        {FEED.map(item => <FeedCard key={item.id} item={item} />)}

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* 7 · Cali FAB */}
      <CaliFab />
    </SafeAreaView>
  );
}

// ─── Screen-level styles ──────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: BG },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 16 },

  topBar: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 18,
  },
  greeting: { color: '#ffffff', fontSize: 22, fontWeight: '800' },

  sectionLabel: {
    color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: '700',
    letterSpacing: 1.3, textTransform: 'uppercase', marginBottom: 10,
  },
  countdownRow: {
    flexDirection: 'row', gap: 12, marginBottom: 20,
  },
});
