import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SW } = Dimensions.get('window');

// ─── Palette ──────────────────────────────────────────────────────────────────
const BG     = '#050508';
const CARD   = '#0a0a14';
const ORANGE = '#FF8C00';
const DIM    = 'rgba(255,255,255,0.28)';
const MID    = 'rgba(255,255,255,0.55)';

// ─── Mock data ────────────────────────────────────────────────────────────────
const USER = {
  name:      'Rajiv Nagula',
  initials:  'RN',
  handle:    '@rajiv.worldcal',
  region:    'Andhra Pradesh',
  language:  'Telugu',
  deity:     'Lord Venkateswara',
  native:    'Vijayawada',
  calendar:  'Panchanga (Lunar)',
  joined:    'May 2026',
};

const STATS = [
  { value: '12',  label: 'Day streak',       icon: '🔥' },
  { value: '47',  label: 'Festivals tracked', icon: '📅' },
  { value: '8',   label: 'Memories saved',    icon: '💜' },
];

const FAMILY: { id: number; name: string; role: string; color: string; emoji: string }[] = [
  { id: 1, name: 'Ravi',    role: 'Father',  color: '#1e3a5f', emoji: '👨' },
  { id: 2, name: 'Padma',   role: 'Mother',  color: '#2d0a1f', emoji: '👩' },
  { id: 3, name: 'Priya',   role: 'Sister',  color: '#160b2e', emoji: '👧' },
  { id: 4, name: 'Arjun',   role: 'Son',     color: '#052e16', emoji: '👦' },
];

const HERITAGE = [
  { icon: '🗺️', label: 'Region',    value: USER.region   },
  { icon: '🗣️', label: 'Language',  value: USER.language  },
  { icon: '📅', label: 'Calendar',  value: USER.calendar  },
  { icon: '🛕', label: 'Deity',     value: USER.deity     },
  { icon: '🏘️', label: 'Hometown',  value: USER.native    },
];

// ─── Toggle component ─────────────────────────────────────────────────────────
function Toggle({ on, onPress }: { on: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[tg.track, on && tg.trackOn]}>
      <View style={[tg.thumb, on && tg.thumbOn]} />
    </TouchableOpacity>
  );
}
const tg = StyleSheet.create({
  track:   { width: 42, height: 24, borderRadius: 12, backgroundColor: '#1c1c30', justifyContent: 'center', paddingHorizontal: 3 },
  trackOn: { backgroundColor: ORANGE },
  thumb:   { width: 18, height: 18, borderRadius: 9, backgroundColor: '#555577' },
  thumbOn: { backgroundColor: '#fff', alignSelf: 'flex-end' },
});

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ title }: { title: string }) {
  return <Text style={sh.text}>{title}</Text>;
}
const sh = StyleSheet.create({
  text: {
    color: DIM, fontSize: 11, fontWeight: '700',
    letterSpacing: 1.3, textTransform: 'uppercase',
    marginTop: 28, marginBottom: 10, paddingHorizontal: 20,
  },
});

// ─── Avatar section ───────────────────────────────────────────────────────────
function AvatarSection() {
  return (
    <View style={av.wrap}>
      {/* Glow ring */}
      <View style={av.glowRing}>
        <View style={av.circle}>
          <Text style={av.initials}>{USER.initials}</Text>
        </View>
      </View>

      <Text style={av.name}>{USER.name}</Text>
      <Text style={av.handle}>{USER.handle}</Text>

      {/* Heritage tag */}
      <View style={av.tagRow}>
        <View style={av.tag}>
          <Text style={av.tagText}>🇮🇳 {USER.region}</Text>
        </View>
        <View style={av.tag}>
          <Text style={av.tagText}>🗣️ {USER.language}</Text>
        </View>
      </View>

      <TouchableOpacity style={av.editBtn}>
        <Text style={av.editText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
}
const av = StyleSheet.create({
  wrap: { alignItems: 'center', paddingTop: 20, paddingBottom: 8 },
  glowRing: {
    width: 92, height: 92, borderRadius: 46,
    borderWidth: 2, borderColor: ORANGE + '66',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
    shadowColor: ORANGE, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4, shadowRadius: 14, elevation: 8,
  },
  circle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: ORANGE,
    alignItems: 'center', justifyContent: 'center',
  },
  initials: { color: '#fff', fontSize: 26, fontWeight: '800' },
  name:     { color: '#ffffff', fontSize: 20, fontWeight: '800', marginBottom: 3 },
  handle:   { color: DIM, fontSize: 13, marginBottom: 12 },
  tagRow:   { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tag: {
    backgroundColor: '#0f0f1e', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 5,
    borderWidth: 1, borderColor: '#1a1a30',
  },
  tagText:  { color: MID, fontSize: 12, fontWeight: '600' },
  editBtn: {
    borderWidth: 1, borderColor: ORANGE + '88', borderRadius: 20,
    paddingHorizontal: 24, paddingVertical: 8,
    backgroundColor: ORANGE + '11',
  },
  editText: { color: ORANGE, fontSize: 13, fontWeight: '700' },
});

// ─── Stats row ────────────────────────────────────────────────────────────────
function StatsRow() {
  const W = (SW - 40 - 16) / 3;
  return (
    <View style={st.row}>
      {STATS.map((item, i) => (
        <View key={i} style={[st.card, { width: W }]}>
          <Text style={st.icon}>{item.icon}</Text>
          <Text style={st.value}>{item.value}</Text>
          <Text style={st.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}
const st = StyleSheet.create({
  row:   { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginTop: 20 },
  card:  { backgroundColor: CARD, borderRadius: 16, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: '#12122a' },
  icon:  { fontSize: 20, marginBottom: 6 },
  value: { color: '#ffffff', fontSize: 22, fontWeight: '800', lineHeight: 26 },
  label: { color: DIM, fontSize: 10, fontWeight: '600', marginTop: 3, textAlign: 'center' },
});

// ─── Family tree ──────────────────────────────────────────────────────────────
function FamilyTree() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={ft.row}>
      {FAMILY.map(m => (
        <TouchableOpacity key={m.id} style={ft.member}>
          <View style={[ft.avatar, { backgroundColor: m.color }]}>
            <Text style={ft.emoji}>{m.emoji}</Text>
          </View>
          <Text style={ft.name}>{m.name}</Text>
          <Text style={ft.role}>{m.role}</Text>
        </TouchableOpacity>
      ))}
      {/* Add member */}
      <TouchableOpacity style={ft.addBtn}>
        <View style={ft.addCircle}>
          <Text style={ft.addPlus}>+</Text>
        </View>
        <Text style={ft.addLabel}>Add</Text>
        <Text style={ft.addLabel}>Member</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const ft = StyleSheet.create({
  row:       { flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingVertical: 4 },
  member:    { alignItems: 'center', width: 72 },
  avatar:    { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 7, borderWidth: 1, borderColor: '#2a2a44' },
  emoji:     { fontSize: 26 },
  name:      { color: '#ffffff', fontSize: 12, fontWeight: '700', textAlign: 'center' },
  role:      { color: DIM, fontSize: 10, textAlign: 'center', marginTop: 1 },
  addBtn:    { alignItems: 'center', width: 72 },
  addCircle: { width: 56, height: 56, borderRadius: 28, borderWidth: 1.5, borderColor: '#2a2a44', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginBottom: 7 },
  addPlus:   { color: DIM, fontSize: 22, fontWeight: '300' },
  addLabel:  { color: DIM, fontSize: 10, textAlign: 'center' },
});

// ─── Heritage card ────────────────────────────────────────────────────────────
function HeritageCard() {
  return (
    <View style={hc.card}>
      {HERITAGE.map((item, i) => (
        <View key={i} style={[hc.row, i < HERITAGE.length - 1 && hc.rowBorder]}>
          <Text style={hc.icon}>{item.icon}</Text>
          <Text style={hc.label}>{item.label}</Text>
          <Text style={hc.value}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}
const hc = StyleSheet.create({
  card:      { marginHorizontal: 20, backgroundColor: CARD, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: '#12122a' },
  row:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13, gap: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#0d0d20' },
  icon:      { fontSize: 17, width: 24, textAlign: 'center' },
  label:     { color: DIM, fontSize: 13, flex: 1 },
  value:     { color: '#ffffff', fontSize: 13, fontWeight: '600' },
});

// ─── Notification settings ────────────────────────────────────────────────────
function NotificationSettings() {
  const [states, setStates] = useState({
    festivals: true,
    memories:  true,
    scores:    true,
    weekly:    false,
  });
  const toggle = (key: keyof typeof states) =>
    setStates(p => ({ ...p, [key]: !p[key] }));

  const rows: { key: keyof typeof states; icon: string; label: string; sub: string }[] = [
    { key: 'festivals', icon: '🪔', label: 'Festival Alerts',   sub: 'Day-of reminders for upcoming festivals' },
    { key: 'memories',  icon: '💜', label: 'Memory Reminders',  sub: 'On-this-day notifications from your history' },
    { key: 'scores',    icon: '🏏', label: 'Live Score Updates', sub: 'Cricket score alerts every 60 seconds' },
    { key: 'weekly',    icon: '📊', label: 'Weekly Summary',     sub: 'Your streak, festivals, and insights recap' },
  ];

  return (
    <View style={ns.card}>
      {rows.map((row, i) => (
        <View key={row.key} style={[ns.row, i < rows.length - 1 && ns.rowBorder]}>
          <Text style={ns.icon}>{row.icon}</Text>
          <View style={ns.mid}>
            <Text style={ns.label}>{row.label}</Text>
            <Text style={ns.sub}>{row.sub}</Text>
          </View>
          <Toggle on={states[row.key]} onPress={() => toggle(row.key)} />
        </View>
      ))}
    </View>
  );
}
const ns = StyleSheet.create({
  card:      { marginHorizontal: 20, backgroundColor: CARD, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: '#12122a' },
  row:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#0d0d20' },
  icon:      { fontSize: 18, width: 24, textAlign: 'center' },
  mid:       { flex: 1 },
  label:     { color: '#ffffff', fontSize: 13, fontWeight: '600', marginBottom: 2 },
  sub:       { color: DIM, fontSize: 11, lineHeight: 15 },
});

// ─── App settings ─────────────────────────────────────────────────────────────
function AppSettings() {
  const rows = [
    { icon: '🌐', label: 'App Language',   value: 'English',   chevron: true },
    { icon: '📅', label: 'Calendar Type',  value: 'Panchanga', chevron: true },
    { icon: '⭐', label: 'Rate WorldCal',  value: '',          chevron: true },
    { icon: '🔗', label: 'Share with Friends', value: '',      chevron: true },
    { icon: 'ℹ️', label: 'About',          value: 'v1.0.0',    chevron: false },
  ];
  return (
    <View style={as.card}>
      {rows.map((row, i) => (
        <TouchableOpacity
          key={row.label}
          activeOpacity={0.7}
          style={[as.row, i < rows.length - 1 && as.rowBorder]}>
          <Text style={as.icon}>{row.icon}</Text>
          <Text style={as.label}>{row.label}</Text>
          {row.value ? <Text style={as.value}>{row.value}</Text> : null}
          {row.chevron && <Text style={as.chevron}>›</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
}
const as = StyleSheet.create({
  card:      { marginHorizontal: 20, backgroundColor: CARD, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: '#12122a' },
  row:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#0d0d20' },
  icon:      { fontSize: 17, width: 24, textAlign: 'center' },
  label:     { color: '#ffffff', fontSize: 13, fontWeight: '600', flex: 1 },
  value:     { color: DIM, fontSize: 13 },
  chevron:   { color: DIM, fontSize: 20, lineHeight: 22 },
});

// ─── Sign out ─────────────────────────────────────────────────────────────────
function SignOutButton() {
  return (
    <TouchableOpacity
      style={so.btn}
      activeOpacity={0.7}
      onPress={() => alert('Sign out tapped')}>
      <Text style={so.text}>Sign Out</Text>
    </TouchableOpacity>
  );
}
const so = StyleSheet.create({
  btn: {
    marginHorizontal: 20, marginTop: 28, borderRadius: 16,
    paddingVertical: 15, alignItems: 'center',
    backgroundColor: '#12060a',
    borderWidth: 1, borderColor: '#ef4444' + '44',
  },
  text: { color: '#ef4444', fontSize: 15, fontWeight: '700' },
});

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <View style={fo.wrap}>
      <Text style={fo.text}>WorldCal · Built with ❤️ for Telugu culture</Text>
      <Text style={fo.joined}>Member since {USER.joined}</Text>
    </View>
  );
}
const fo = StyleSheet.create({
  wrap:   { alignItems: 'center', marginTop: 24, paddingBottom: 40 },
  text:   { color: DIM, fontSize: 12 },
  joined: { color: DIM, fontSize: 11, marginTop: 4, opacity: 0.6 },
});

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        style={s.scroll}
        showsVerticalScrollIndicator={false}>

        <AvatarSection />
        <StatsRow />

        <SectionHeader title="Family Tree" />
        <FamilyTree />

        <SectionHeader title="My Heritage" />
        <HeritageCard />

        <SectionHeader title="Notifications" />
        <NotificationSettings />

        <SectionHeader title="App" />
        <AppSettings />

        <SignOutButton />
        <Footer />

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: BG },
  scroll: { flex: 1 },
});
