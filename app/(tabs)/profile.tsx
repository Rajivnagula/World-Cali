import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.center}>
        <Text style={s.emoji}>👤</Text>
        <Text style={s.title}>Profile</Text>
        <Text style={s.sub}>Your identity, family tree & settings — coming soon</Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0d0d1a' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emoji: { fontSize: 52, marginBottom: 16 },
  title: { color: '#ffffff', fontSize: 26, fontWeight: '700', marginBottom: 8 },
  sub: { color: '#9090b8', fontSize: 14, textAlign: 'center', lineHeight: 22 },
});
