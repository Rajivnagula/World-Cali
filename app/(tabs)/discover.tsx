import React, { useState, useMemo } from 'react';
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

// ─── Palette (matches home screen) ───────────────────────────────────────────
const BG     = '#050508';
const ORANGE = '#FF8C00';
const CARD   = '#0a0a14';
const DIM    = 'rgba(255,255,255,0.28)';

// ─── Types ────────────────────────────────────────────────────────────────────
type Category = 'All' | 'Religious' | 'Cultural' | 'Family' | 'Sports' | 'Space';

interface Festival {
  id: number;
  month: number;   // 1–12
  day: number;
  emoji: string;
  nameEn: string;
  nameTe: string;
  category: Exclude<Category, 'All'>;
  desc: string;
  accent: string;
}

// ─── Static data ──────────────────────────────────────────────────────────────
const MONTHS = [
  'Jan','Feb','Mar','Apr','May','Jun',
  'Jul','Aug','Sep','Oct','Nov','Dec',
];

const MONTH_FULL = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const CATEGORIES: Category[] = [
  'All','Religious','Cultural','Family','Sports','Space',
];

const CAT_COLOR: Record<Exclude<Category,'All'>, string> = {
  Religious: '#FF8C00',
  Cultural:  '#3b82f6',
  Family:    '#ec4899',
  Sports:    '#22c55e',
  Space:     '#a855f7',
};

const CAT_BG: Record<Exclude<Category,'All'>, string> = {
  Religious: '#1a0d00',
  Cultural:  '#071428',
  Family:    '#1a0510',
  Sports:    '#071f0b',
  Space:     '#160b2e',
};

const ALL_FESTIVALS: Festival[] = [
  // January
  { id: 1,  month: 1,  day: 13, emoji: '🔥', nameEn: 'Bhogi',           nameTe: 'భోగి',            category: 'Cultural',  desc: 'Bonfire of old belongings to welcome the new season. Celebrated the day before Sankranti.', accent: '#ef4444' },
  { id: 2,  month: 1,  day: 14, emoji: '🪁', nameEn: 'Sankranti',       nameTe: 'సంక్రాంతి',       category: 'Religious', desc: 'The great harvest festival. Kite flying, Haridasu songs, Bhogi Pallu, and Muggu art.', accent: '#f59e0b' },
  // March
  { id: 3,  month: 3,  day: 31, emoji: '🌸', nameEn: 'Ugadi',           nameTe: 'ఉగాది',            category: 'Religious', desc: 'Telugu & Kannada New Year. Ugadi Pachadi with six tastes symbolises life\'s full journey.', accent: '#22c55e' },
  // April
  { id: 4,  month: 4,  day: 6,  emoji: '🏹', nameEn: 'Rama Navami',     nameTe: 'రామ నవమి',         category: 'Religious', desc: 'Birth of Lord Rama. Temple Kalyanotsavam, chariot processions, and Ramayana recitations.', accent: '#f59e0b' },
  { id: 5,  month: 4,  day: 14, emoji: '💧', nameEn: 'Vishu',           nameTe: 'విషు',              category: 'Cultural',  desc: 'New-year celebration. Vishukkani ritual — first sight of gold, rice, fruits, and mirrors.', accent: '#22c55e' },
  // May
  { id: 6,  month: 5,  day: 3,  emoji: '🪔', nameEn: 'Akshaya Tritiya', nameTe: 'అక్షయ తృతీయ',    category: 'Religious', desc: 'Auspicious for gold, new ventures, and charity. Believed to bring eternal prosperity.', accent: '#FF8C00' },
  { id: 7,  month: 5,  day: 11, emoji: '🌹', nameEn: 'Mother\'s Day',   nameTe: 'అమ్మ దినం',        category: 'Family',    desc: 'Celebrate the mothers in your life. Share a memory, a meal, or a heartfelt call.', accent: '#ec4899' },
  // June
  { id: 8,  month: 6,  day: 27, emoji: '🎡', nameEn: 'Rath Yatra',      nameTe: 'రథ యాత్ర',         category: 'Cultural',  desc: 'Grand chariot procession of Lord Jagannath. Decorated raths pulled through streets.', accent: '#3b82f6' },
  // August
  { id: 9,  month: 8,  day: 9,  emoji: '🐍', nameEn: 'Nag Panchami',    nameTe: 'నాగ పంచమి',        category: 'Religious', desc: 'Worship of serpent deities with milk offerings. Blessings sought for family protection.', accent: '#22c55e' },
  { id: 10, month: 8,  day: 19, emoji: '🤝', nameEn: 'Raksha Bandhan',  nameTe: 'రక్షా బంధన్',      category: 'Family',    desc: 'Sacred thread between siblings. Sisters tie rakhis; brothers pledge lifelong protection.', accent: '#ec4899' },
  { id: 11, month: 8,  day: 23, emoji: '🦚', nameEn: 'Krishnashtami',   nameTe: 'కృష్ణాష్టమి',     category: 'Religious', desc: 'Midnight birth of Lord Krishna. Dahi Handi, devotional singing, and moonrise fasting.', accent: '#3b82f6' },
  // September
  { id: 12, month: 9,  day: 11, emoji: '🐘', nameEn: 'Ganesh Chaturthi',nameTe: 'వినాయక చవితి',    category: 'Religious', desc: '10-day festival of Lord Ganesha. Clay idols installed, modak offered, immersed on day 10.', accent: '#f59e0b' },
  // October
  { id: 13, month: 10, day: 2,  emoji: '🌺', nameEn: 'Navratri',        nameTe: 'నవరాత్రి',          category: 'Religious', desc: 'Nine nights of Devi worship. Garba, Dandiya Raas, and Kolu doll display traditions.', accent: '#a855f7' },
  { id: 14, month: 10, day: 11, emoji: '⚔️', nameEn: 'Vijayadasami',    nameTe: 'విజయదశమి',         category: 'Cultural',  desc: 'Victory of truth over evil. Ayudha Puja and auspicious day to begin learning anything new.', accent: '#ef4444' },
  { id: 15, month: 10, day: 19, emoji: '✨', nameEn: 'Diwali',           nameTe: 'దీపావళి',           category: 'Religious', desc: 'Festival of lights. Lakshmi Puja, diyas lit, sweets exchanged, and fireworks at midnight.', accent: '#FF8C00' },
  // November
  { id: 16, month: 11, day: 5,  emoji: '☀️', nameEn: 'Chhath Puja',     nameTe: 'ఛఠ్ పూజ',          category: 'Religious', desc: 'Worship of Surya (Sun god). Devotees fast and offer prayers at sunrise and sunset.', accent: '#f59e0b' },
  { id: 17, month: 11, day: 16, emoji: '🌕', nameEn: 'Karthika Purnima',nameTe: 'కార్తీక పౌర్ణమి',  category: 'Religious', desc: 'Full moon of Karthika. River dips at dawn, Tulsi Puja, and lamps lit at Shiva temples.', accent: '#22c55e' },
  // December
  { id: 18, month: 12, day: 25, emoji: '🎄', nameEn: 'Christmas',       nameTe: 'క్రిస్మస్',          category: 'Cultural',  desc: 'Celebrated across Telugu communities. Church services, carol singing, and family feasts.', accent: '#ef4444' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function ordinal(n: number): string {
  const s = ['th','st','nd','rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

// ─── Month strip ──────────────────────────────────────────────────────────────
function MonthStrip({
  selected, onSelect,
}: {
  selected: number;
  onSelect: (m: number) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={ms.row}>
      {MONTHS.map((label, i) => {
        const month = i + 1;
        const active = month === selected;
        return (
          <TouchableOpacity
            key={month}
            onPress={() => onSelect(month)}
            style={[ms.pill, active && ms.pillActive]}>
            <Text style={[ms.label, active && ms.labelActive]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
const ms = StyleSheet.create({
  row:        { flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingVertical: 4 },
  pill:       { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: '#0f0f1e', borderWidth: 1, borderColor: '#1a1a30' },
  pillActive: { backgroundColor: ORANGE, borderColor: ORANGE },
  label:      { color: DIM, fontSize: 13, fontWeight: '600' },
  labelActive:{ color: '#fff', fontWeight: '700' },
});

// ─── Category chips ───────────────────────────────────────────────────────────
function CategoryChips({
  selected, onSelect,
}: {
  selected: Category;
  onSelect: (c: Category) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={ch.row}>
      {CATEGORIES.map(cat => {
        const active = cat === selected;
        const color  = cat === 'All' ? ORANGE : CAT_COLOR[cat as Exclude<Category,'All'>];
        return (
          <TouchableOpacity
            key={cat}
            onPress={() => onSelect(cat)}
            style={[
              ch.chip,
              active && { backgroundColor: color + '22', borderColor: color + 'aa' },
            ]}>
            <Text style={[ch.label, active && { color }]}>{cat}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
const ch = StyleSheet.create({
  row:   { flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingVertical: 2 },
  chip:  { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#1a1a30', backgroundColor: '#0c0c18' },
  label: { color: DIM, fontSize: 12, fontWeight: '600' },
});

// ─── Festival card ────────────────────────────────────────────────────────────
function FestivalCard({ item }: { item: Festival }) {
  const catColor = CAT_COLOR[item.category];
  const catBg    = CAT_BG[item.category];
  const isToday  = item.month === 5 && item.day === 3; // mock "today" = May 3

  return (
    <View style={[fc.card, { borderLeftColor: item.accent }]}>
      {/* Emoji box */}
      <View style={[fc.emojiBox, { backgroundColor: catBg }]}>
        <Text style={fc.emoji}>{item.emoji}</Text>
      </View>

      {/* Body */}
      <View style={fc.body}>
        {/* Top row: date chip + TODAY badge */}
        <View style={fc.topRow}>
          <View style={fc.dateChip}>
            <Text style={fc.dateText}>
              {ordinal(item.day)} {MONTHS[item.month - 1]}
            </Text>
          </View>
          {isToday && (
            <View style={fc.todayChip}>
              <Text style={fc.todayText}>TODAY</Text>
            </View>
          )}
          <View style={[fc.catChip, { backgroundColor: catColor + '18', borderColor: catColor + '55' }]}>
            <Text style={[fc.catText, { color: catColor }]}>{item.category}</Text>
          </View>
        </View>

        {/* Names */}
        <Text style={fc.nameEn}>{item.nameEn}</Text>
        <Text style={fc.nameTe}>{item.nameTe}</Text>

        {/* Description */}
        <Text style={fc.desc} numberOfLines={2}>{item.desc}</Text>

        {/* Action */}
        <TouchableOpacity style={[fc.btn, { borderColor: item.accent + '88' }]}>
          <Text style={[fc.btnText, { color: item.accent }]}>Learn More →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const fc = StyleSheet.create({
  card: {
    flexDirection: 'row', backgroundColor: CARD,
    borderRadius: 18, padding: 14, marginBottom: 12,
    borderLeftWidth: 3, borderWidth: 1, borderColor: '#0f0f20',
    gap: 13,
  },
  emojiBox: {
    width: 52, height: 52, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  emoji: { fontSize: 26 },
  body:  { flex: 1 },
  topRow:{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 5 },

  dateChip: { backgroundColor: '#14142a', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  dateText: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '600' },

  todayChip: { backgroundColor: ORANGE + '22', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2, borderWidth: 1, borderColor: ORANGE + '66' },
  todayText: { color: ORANGE, fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },

  catChip: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2, borderWidth: 1 },
  catText: { fontSize: 10, fontWeight: '700' },

  nameEn: { color: '#ffffff', fontSize: 15, fontWeight: '800', marginBottom: 1 },
  nameTe: { color: 'rgba(255,255,255,0.38)', fontSize: 12, marginBottom: 5 },
  desc:   { color: 'rgba(255,255,255,0.48)', fontSize: 12, lineHeight: 18, marginBottom: 10 },

  btn: {
    alignSelf: 'flex-start', borderRadius: 8, borderWidth: 1,
    paddingHorizontal: 12, paddingVertical: 5,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  btnText: { fontSize: 12, fontWeight: '700' },
});

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ month, category }: { month: number; category: Category }) {
  return (
    <View style={es.wrap}>
      <Text style={es.emoji}>🔍</Text>
      <Text style={es.title}>Nothing here</Text>
      <Text style={es.sub}>
        No {category === 'All' ? '' : category.toLowerCase() + ' '}
        festivals recorded for {MONTH_FULL[month - 1]}.{'\n'}
        Try another month or category.
      </Text>
    </View>
  );
}
const es = StyleSheet.create({
  wrap:  { alignItems: 'center', paddingTop: 48, paddingHorizontal: 32 },
  emoji: { fontSize: 40, marginBottom: 12 },
  title: { color: '#ffffff', fontSize: 17, fontWeight: '700', marginBottom: 6 },
  sub:   { color: DIM, fontSize: 13, lineHeight: 20, textAlign: 'center' },
});

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function DiscoverScreen() {
  const now = new Date();
  const [month, setMonth]       = useState<number>(now.getMonth() + 1);
  const [category, setCategory] = useState<Category>('All');

  const visible = useMemo(() => {
    return ALL_FESTIVALS.filter(f => {
      const monthMatch = f.month === month;
      const catMatch   = category === 'All' || f.category === category;
      return monthMatch && catMatch;
    }).sort((a, b) => a.day - b.day);
  }, [month, category]);

  const totalInMonth = ALL_FESTIVALS.filter(f => f.month === month).length;

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        style={s.scroll}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1, 2]}>   {/* month strip + chips stay pinned */}

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <View style={s.header}>
          <Text style={s.title}>Discover</Text>
          <Text style={s.sub}>Telugu festivals & milestones</Text>
        </View>

        {/* ── Month strip (sticky) ────────────────────────────────────────── */}
        <View style={s.stickyWrap}>
          <MonthStrip selected={month} onSelect={m => { setMonth(m); setCategory('All'); }} />
        </View>

        {/* ── Category chips (sticky) ─────────────────────────────────────── */}
        <View style={s.stickyWrap}>
          <CategoryChips selected={category} onSelect={setCategory} />
        </View>

        {/* ── Count line ──────────────────────────────────────────────────── */}
        <View style={s.countRow}>
          <Text style={s.countText}>
            {visible.length} of {totalInMonth} festival{totalInMonth !== 1 ? 's' : ''} in{' '}
            <Text style={s.countMonth}>{MONTH_FULL[month - 1]}</Text>
          </Text>
        </View>

        {/* ── Festival list ────────────────────────────────────────────────── */}
        <View style={s.list}>
          {visible.length === 0
            ? <EmptyState month={month} category={category} />
            : visible.map(f => <FestivalCard key={f.id} item={f} />)
          }
          <View style={{ height: 100 }} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Screen-level styles ──────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: BG },
  scroll: { flex: 1 },

  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  title:  { color: '#ffffff', fontSize: 28, fontWeight: '800' },
  sub:    { color: DIM, fontSize: 13, marginTop: 2 },

  stickyWrap: { backgroundColor: BG, paddingBottom: 10 },

  countRow:   { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 12 },
  countText:  { color: DIM, fontSize: 12, fontWeight: '500' },
  countMonth: { color: ORANGE, fontWeight: '700' },

  list: { paddingHorizontal: 20 },
});
