import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRoutes } from '../src/hooks/useRoutes';
import { useAuthStore } from '../src/hooks/useStore';
import { useTranslation } from '../src/hooks/useTranslation';
import { useRouter } from 'expo-router';
import { Route } from '@uniride/core';

export default function DiscoveryPage() {
  const { routes, isLoading, error, refetch } = useRoutes();
  const { role, profile } = useAuthStore();
  const { t, isRTL } = useTranslation();
  const router = useRouter();

  const renderItem = ({ item }: { item: Route }) => (
    <TouchableOpacity
      style={[styles.card, isRTL && styles.cardRTL]}
      onPress={() => router.push({ pathname: '/booking', params: { routeId: item.id } })}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.title, isRTL && styles.textRTL]}>{item.title}</Text>
        <Text style={styles.price}>{item.price.toLocaleString()} IQD</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={[styles.location, isRTL && styles.textRTL]}>
          {t('from')}: {item.start_location}
        </Text>
        <Text style={[styles.location, isRTL && styles.textRTL]}>
          {t('to')}: {item.end_location}
        </Text>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.seats}>
          {item.available_seats} {t('seats_available')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading && routes.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {t('error_generic')}: {error}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryText}>{t('retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[styles.header, isRTL && styles.textRTL]}>{t('welcome')}</Text>
        {profile?.full_name ? (
          <Text style={[styles.subHeader, isRTL && styles.textRTL]}>{profile.full_name}</Text>
        ) : null}
      </View>
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabActive} onPress={() => router.push('/')}>
          <Text style={styles.tabTextActive}>{t('available_routes')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => router.push('/subscriptions')}>
          <Text style={styles.tabText}>{t('my_subscriptions')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => router.push('/profile')}>
          <Text style={styles.tabText}>{t('profile')}</Text>
        </TouchableOpacity>
      </View>
      {routes.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>{t('no_seats')}</Text>
        </View>
      ) : (
        <FlatList
          data={routes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  headerContainer: {
    padding: 20,
    backgroundColor: '#007AFF',
    borderBottomWidth: 1,
    borderBottomColor: '#0066D6',
  },
  header: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  subHeader: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  tabActive: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#007AFF',
  },
  tabText: { fontSize: 13, color: '#888', fontWeight: '500' },
  tabTextActive: { fontSize: 13, color: '#007AFF', fontWeight: '700' },
  listContent: { padding: 15 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardRTL: { direction: 'rtl' },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: { fontSize: 18, fontWeight: 'bold', flex: 1 },
  price: { fontSize: 18, fontWeight: 'bold', color: '#2e7d32' },
  cardBody: { marginBottom: 10 },
  location: { fontSize: 14, color: '#424242', marginBottom: 4 },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    alignItems: 'flex-end',
  },
  seats: { fontSize: 14, fontWeight: '600', color: '#1976d2' },
  textRTL: { textAlign: 'right' },
  errorText: { color: '#FF3B30', fontSize: 16, textAlign: 'center', marginBottom: 16 },
  emptyText: { fontSize: 16, color: '#666', textAlign: 'center' },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: { color: '#fff', fontWeight: 'bold' },
});
