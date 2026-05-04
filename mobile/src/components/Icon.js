import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const glyphs = {
  arrowLeft: '<',
  calendar: '##',
  checkCircle: 'OK',
  chevronRight: '>',
  clipboardList: '[]',
  heartHandshake: 'CF',
  lock: '#',
  logOut: '->',
  mail: '@',
  messageSquare: '...',
  user: 'U',
  xCircle: 'X',
};

const Icon = ({ name, color = '#1E293B', size = 24, style }) => {
  const fontSize = Math.max(10, Math.round(size * 0.42));
  const label = glyphs[name] || '?';

  return (
    <View
      style={[
        styles.icon,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: color,
        },
        style,
      ]}
    >
      <Text style={[styles.label, { color, fontSize }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '800',
    includeFontPadding: false,
    textAlign: 'center',
  },
});

export default Icon;
