import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useCasContext } from './cas.context';

export const LoggerTerminal = () => {
  const [logs, setLogs] = useState<Array<string>>([]);
  const { setCasLogger } = useCasContext();
  const ref = useRef<ScrollView | null>(null);

  const logger = useCallback((...data: any[]) => {
    const line = data
      .filter((x) => x !== undefined && x !== null)
      .map((d) => {
        if (typeof d === 'string') return d;
        try { return JSON.stringify(d); } catch { return String(d); }
      })
      .join(' ');
    if (!line) return;
    setLogs((s) => [...s, line]);
    setTimeout(() => ref.current?.scrollToEnd({ animated: true }), 50);
  }, []);

  useEffect(() => {
    setCasLogger(logger);
  }, [logger, setCasLogger]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>Logger terminal:</Text>
        <Button title="clear" onPress={() => setLogs([])} />
      </View>
      <ScrollView ref={ref} contentContainerStyle={styles.scroll}>
        {logs.map((log, i) => (
          <Text key={i} style={styles.text}>{log}</Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', backgroundColor: 'black', height: 200, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  text: { color: 'white', marginVertical: 4 },
  scroll: { paddingTop: 16 },
});
