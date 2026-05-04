import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
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

// ── Mock data ──────────────────────────────────────────────────────────────────

const TODAY_EN = 'Saturday, May 3';
const TODAY_TE = 'శనివారం, 3 మే 2026';

const CHIPS = [
  { id: 1, label: 'తిథి: పంచమి' },
  { id: 2, label: 'నక్షత్రం: పుష్యమి' },
  { id: 3, label: 'రాహుకాలం: 7:30–9:00' },
];

const FESTIVAL = {
  emoji: '🪔',
  name: 'అక్షయ తృతీయ',
  subtitle: 'కొత్త పనులు ప్రారంభించడానికి శుభ సమయం · సూర్యాస్తమయం వరకు',
};

const FEED = [
  {
    id: 1,
    icon: '✨',
    title: 'అక్షయ తృతీయ Special',
    reason:
      'Today is an auspicious day for starting new ventures, gold purchases, and charitable giving.',
    action: 'Explore',
  },
  {
    id: 2,
    icon: '📖',
    title: 'నాన్న జ్ఞాపకం',
    reason:
      'Your grandfather visited the Tirumala temple on this day in 1994 — 32 years ago today.',
    action: 'Remember',
  },
  {
    id: 3,
    icon: '🛕',
    title: 'లక్ష్మీ పూజ Reminder',
    reason: 'Lakshmi Puja is recommended at sunset (6:42 PM) on Akshaya Tritiya.',
    action: 'Set Reminder',
  },
];

// ── Floating mic with pulse animation ─────────────────────────────────────────

function MicButton() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.6, { duration: 900, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 900, easing: Easing.in(Easing.ease) }),
      ),
      -1,
      false,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 900, easing: Easing.out(Easing.ease) }),
        withTiming(0.6, { duration: 900, easing: Easing.in(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <TouchableOpacity style={s.micWrapper} activeOpacity={0.85}>
      <Animated.View style={[s.micPulse, pulseStyle]} />
      <View style={s.micBtn}>
        <Text style={s.micIcon}>🎙️</Text>
      </View>
    </TouchableOpacity>
  );
}

// ── Screen ─────────────────────────────────────────────────────────────────────

export default function CalendarScreen() {
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.dateEn}>{TODAY_EN}</Text>
          <Text style={s.dateTe}>{TODAY_TE}</Text>
        </View>

        {/* Panchang chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.chipsRow}>
          {CHIPS.map((chip) => (
            <View key={chip.id} style={s.chip}>
              <Text style={s.chipText}>{chip.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Festival card */}
        <View style={s.festivalCard}>
          <Text style={s.festivalEmoji}>{FESTIVAL.emoji}</Text>
          <Text style={s.festivalName}>{FESTIVAL.name}</Text>
          <Text style={s.festivalSub}>{FESTIVAL.subtitle}</Text>
        </View>

        {/* Smart feed */}
        <Text style={s.sectionLabel}>Today for You</Text>
        {FEED.map((item) => (
          <View key={item.id} style={s.feedCard}>
            <Text style={s.feedIcon}>{item.icon}</Text>
            <View style={s.feedBody}>
              <Text style={s.feedTitle}>{item.title}</Text>
              <Text style={s.feedReason}>{item.reason}</Text>
              <TouchableOpacity style={s.feedBtn}>
                <Text style={s.feedBtnText}>{item.action}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      <MicButton />
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const ORANGE = '#FF8C00';
const GOLD = '#FFD700';
const BG = '#0d0d1a';
const CARD = '#14142a';
const SURFACE = '#1c1c35';

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 24 },

  // Header
  header: { marginBottom: 20 },
  dateEn: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  dateTe: { color: GOLD, fontSize: 15, marginTop: 4, opacity: 0.85 },

  // Chips
  chipsRow: { flexDirection: 'row', gap: 8, paddingRight: 20, marginBottom: 24 },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  chipText: { color: '#e0e0ff', fontSize: 13, fontWeight: '500' },

  // Festival card
  festivalCard: {
    height: 160,
    borderRadius: 20,
    backgroundColor: ORANGE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    borderWidth: 1.5,
    borderColor: GOLD,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  festivalEmoji: { fontSize: 40, marginBottom: 6 },
  festivalName: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  festivalSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 24,
  },

  // Section label
  sectionLabel: {
    color: '#aaaacc',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },

  // Feed cards
  feedCard: {
    flexDirection: 'row',
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#22224a',
    gap: 14,
  },
  feedIcon: { fontSize: 26, paddingTop: 2 },
  feedBody: { flex: 1 },
  feedTitle: { color: '#ffffff', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  feedReason: { color: '#9090b8', fontSize: 13, lineHeight: 19, marginBottom: 10 },
  feedBtn: {
    alignSelf: 'flex-start',
    backgroundColor: SURFACE,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: ORANGE,
  },
  feedBtnText: { color: ORANGE, fontSize: 12, fontWeight: '600' },

  // Floating mic button
  micWrapper: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micPulse: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: ORANGE,
  },
  micBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 8,
  },
  micIcon: { fontSize: 26 },
});
