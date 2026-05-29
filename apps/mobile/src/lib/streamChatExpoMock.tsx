import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  stubContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
    borderWidth: 1,
    borderColor: '#e6e3de',
  },
  stubTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a202c',
    textAlign: 'center',
  },
  stubText: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
});

export const Chat = ({ children }: any) => <>{children}</>;
export const Channel = ({ children }: any) => <>{children}</>;

export const ChannelList = () => (
  <View style={styles.stubContainer}>
    <Text style={styles.stubTitle}>المحادثات غير متاحة على نسخة الويب</Text>
    <Text style={styles.stubText}>
      يرجى استخدام تطبيق الهاتف لتصفح المحادثات والدردشة الحية مع السائق.
    </Text>
  </View>
);

export const MessageList = () => (
  <View style={styles.stubContainer}>
    <Text style={styles.stubText}>عرض الرسائل غير مدعوم على المتصفح.</Text>
  </View>
);

export const MessageComposer = () => (
  <View style={styles.stubContainer}>
    <Text style={styles.stubText}>صندوق إرسال الرسائل معطل.</Text>
  </View>
);

export const WithComponents = ({ children }: any) => <>{children}</>;
export const OverlayProvider = ({ children }: any) => <>{children}</>;

export default {
  Chat,
  Channel,
  ChannelList,
  MessageList,
  MessageComposer,
  WithComponents,
  OverlayProvider,
};
