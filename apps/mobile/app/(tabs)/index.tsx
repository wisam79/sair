import React, { useState, useCallback, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  ActivityIndicator,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useRoutes } from '../../src/hooks/useRoutes';
import { useSubscriptions } from '../../src/hooks/useTrips';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../../src/hooks/useStore';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useRouter, useFocusEffect } from 'expo-router';
import { Route } from '@uniride/core';
import { Colors, Typography, Spacing, BorderRadius, Shadow, FontFamily } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { logger } from '../../src/lib/logger';
import { supabase } from '../../src/lib/supabase';
import * as Haptics from 'expo-haptics';
import { RouteCard } from '../../src/components/RouteCard';
import { ActiveSubscriptionCard } from '../../src/components/ActiveSubscriptionCard';
import { LicenseActivationBanner } from '../../src/components/LicenseActivationBanner';
import { LoadingList } from '../../src/components/LoadingSkeleton';
import { EmptyState } from '../../src/components/EmptyState';

export default function DiscoveryPage() {
  const { profile, role } = useAuthStore();
  const {
    routes,
    isLoading: routesLoading,
    error,
    refetch: refetchRoutes,
  } = useRoutes(profile?.institution_id);
  const { subscriptions, isLoading: subsLoading, refetch: refetchSubs } = useSubscriptions();
  const { t, isRTL, language } = useTranslation();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(['جامعة بغداد', 'باب المعظم', 'الجادرية']);

  // Load favorites from AsyncStorage on mount
  React.useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem('saved_locations');
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      } catch (err) {
        logger.error('Failed to load saved locations', err);
      }
    };
    loadFavorites();
  }, []);

  const saveFavorites = async (updated: string[]) => {
    try {
      await AsyncStorage.setItem('saved_locations', JSON.stringify(updated));
    } catch (err) {
      logger.error('Failed to save saved locations', err);
    }
  };

  const handleAddFavorite = (loc: string) => {
    if (!loc.trim()) return;
    const clean = loc.trim();
    if (favorites.includes(clean)) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const updated = [...favorites, clean];
    setFavorites(updated);
    saveFavorites(updated);
  };

  const handleRemoveFavorite = (loc: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    const updated = favorites.filter((f) => f !== loc);
    setFavorites(updated);
    saveFavorites(updated);
  };

  useFocusEffect(
    useCallback(() => {
      refetchSubs();
    }, [refetchSubs]),
  );

  const activeSubs = subscriptions.filter((s) => s.status === 'active');
  const isLoading = routesLoading || subsLoading;

  const filteredRoutes = React.useMemo(() => {
    if (!searchQuery.trim()) return routes;
    const query = searchQuery.toLowerCase();
    return routes.filter((r) => {
      return (
        r.title?.toLowerCase().includes(query) ||
        r.start_location?.toLowerCase().includes(query) ||
        r.end_location?.toLowerCase().includes(query)
      );
    });
  }, [routes, searchQuery]);

  const onRefresh = async () => {
    await Promise.all([refetchRoutes(), refetchSubs()]);
  };

  const handleTrackActiveTrip = async (routeId: string) => {
    try {
      const { data: activeTrip } = await supabase
        .from('trips')
        .select('id')
        .eq('route_id', routeId)
        .in('status', ['driver_waiting', 'in_transit'])
        .order('scheduled_at', { ascending: false })
        .limit(1)
        .single();

      if (activeTrip) {
        router.push({
          pathname: '/tracking/[tripId]',
          params: { tripId: activeTrip.id },
        });
      } else {
        router.push('/subscriptions');
      }
    } catch {
      router.push('/subscriptions');
    }
  };

  const renderRoute = useCallback(
    ({ item }: { item: Route }) => {
      const isSubscribed = subscriptions.some(
        (sub) => sub.route_id === item.id && (sub.status === 'active' || sub.status === 'pending'),
      );
      return <RouteCard item={item} isSubscribed={isSubscribed} driverRating={4.8} />;
    },
    [subscriptions],
  );

  const ListEmpty = useCallback(
    () => (
      <EmptyState
        icon="bus-outline"
        title={t('no_available_routes')}
        subtitle={t('pull_to_refresh')}
        iconColor={Colors.primary}
      />
    ),
    [t],
  );

  const ListError = useCallback(
    () => (
      <EmptyState
        icon="wifi-outline"
        title={t('failed_to_load_routes')}
        ctaLabel={t('retry')}
        onCta={onRefresh}
        iconColor={Colors.error}
      />
    ),
    [t, onRefresh],
  );

  const keyExtractor = useCallback((item: any) => item.id, []);

  const renderActiveSubscription = useCallback(
    ({ item }: { item: any }) => {
      const handleTrack = () => handleTrackActiveTrip(item.route_id);
      return (
        <View style={{ width: 300 }}>
          <ActiveSubscriptionCard activeSub={item} onTrackTrip={handleTrack} />
        </View>
      );
    },
    [handleTrackActiveTrip],
  );

  const renderRoutesHeader = useCallback(() => {
    if (filteredRoutes.length === 0) return null;
    return (
      <View style={[styles.routesHeader, isRTL && { flexDirection: 'row-reverse' }]}>
        <Text style={[styles.sectionHeader, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t('available_routes')}
        </Text>
        <Text style={styles.routesCount}>
          {filteredRoutes.length} {t('route')}
        </Text>
      </View>
    );
  }, [filteredRoutes.length, isRTL, t]);

  interface NominatimResult {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
    type: string;
  }
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = async (text: string) => {
    setSearchQuery(text);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(async () => {
      if (text.length < 3) {
        setSearchResults([]);
        return;
      }

      try {
        setIsSearching(true);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&countrycodes=iq&limit=5`,
          { headers: { 'User-Agent': 'UniRide-App' } },
        );
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        logger.warn('Geocoding search failed', {
          error: error instanceof Error ? error.message : String(error),
          query: text,
        });
      } finally {
        setIsSearching(false);
      }
    }, 500);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={styles.content}>
        {/* Welcome Header */}
        <View style={[styles.welcomeHeader, isRTL && { flexDirection: 'row-reverse' }]}>
          <View style={styles.welcomeTextContainer}>
            <Text style={[styles.greetingText, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('hello')}, {profile?.full_name || t('student')} 👋
            </Text>
            <Text style={[styles.subGreetingText, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('welcome')}
            </Text>
          </View>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {(profile?.full_name || 'S').charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, searchFocused && styles.searchContainerFocused]}>
          <View
            style={[
              styles.searchBar,
              searchFocused && styles.searchBarFocused,
              isRTL && { flexDirection: 'row-reverse' },
            ]}
          >
            <Ionicons
              name="search-outline"
              size={18}
              color={searchFocused ? Colors.primary : Colors.textMuted}
            />
            <TextInput
              style={[styles.searchInput, { textAlign: isRTL ? 'right' : 'left' }]}
              placeholder={t('search_routes_placeholder')}
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={handleSearch}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            {isSearching ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : searchQuery.length > 0 ? (
              <View
                style={[styles.favoriteActionContainer, isRTL && { flexDirection: 'row-reverse' }]}
              >
                {favorites.includes(searchQuery.trim()) ? (
                  <TouchableOpacity
                    onPress={() => handleRemoveFavorite(searchQuery)}
                    style={styles.favoriteActionButton}
                  >
                    <Ionicons name="star" size={18} color={Colors.warning} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleAddFavorite(searchQuery)}
                    style={styles.favoriteActionButton}
                  >
                    <Ionicons name="star-outline" size={18} color={Colors.primary} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  style={{ marginLeft: 6 }}
                >
                  <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <View style={styles.searchResults}>
              {searchResults.map((result, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.searchResultItem, isRTL && { flexDirection: 'row-reverse' }]}
                  onPress={() => {
                    setSearchQuery(result.display_name.split(',')[0]);
                    setSearchResults([]);
                    setSearchFocused(false);
                  }}
                >
                  <Ionicons name="location-outline" size={16} color={Colors.textMuted} />
                  <Text
                    style={[styles.searchResultText, { textAlign: isRTL ? 'right' : 'left' }]}
                    numberOfLines={1}
                  >
                    {result.display_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Saved Locations Strip */}
        <View style={styles.favoritesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.favoritesScroll,
              isRTL && { flexDirection: 'row-reverse' },
            ]}
          >
            <View
              style={[styles.favoriteLabelContainer, isRTL && { flexDirection: 'row-reverse' }]}
            >
              <Ionicons name="star" size={14} color={Colors.warning} />
              <Text style={styles.favoriteLabelText}>{t('favorites')}</Text>
            </View>
            {favorites.map((fav) => {
              const isActive = searchQuery === fav;
              return (
                <TouchableOpacity
                  key={fav}
                  style={[
                    styles.favoriteChip,
                    isActive && styles.favoriteChipActive,
                    isRTL && { flexDirection: 'row-reverse' },
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSearchQuery(isActive ? '' : fav);
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[styles.favoriteChipText, isActive && styles.favoriteChipTextActive]}
                  >
                    {fav}
                  </Text>
                  {isActive && (
                    <Ionicons
                      name="close"
                      size={12}
                      color={Colors.primary}
                      style={{ marginLeft: 4 }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Quick Stats Strip */}
        {!isLoading && (
          <View style={[styles.statsStrip, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: Colors.primarySurface }]}>
                <Ionicons name="bus" size={16} color={Colors.primary} />
              </View>
              <Text style={styles.statValue}>{routes.length}</Text>
              <Text style={styles.statLabel} numberOfLines={1}>
                {t('available_routes')}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: Colors.successSurface }]}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
              </View>
              <Text style={styles.statValue}>{activeSubs.length}</Text>
              <Text style={styles.statLabel} numberOfLines={1}>
                {t('my_subscriptions')}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: Colors.warningSurface }]}>
                <Ionicons name="car" size={16} color={Colors.warning} />
              </View>
              <Text style={styles.statValue}>
                {routes.reduce((sum, r) => sum + r.available_seats, 0)}
              </Text>
              <Text style={styles.statLabel} numberOfLines={1}>
                {t('seats_available')}
              </Text>
            </View>
          </View>
        )}

        {/* Subscription / License Section */}
        {!subsLoading && (
          <View style={styles.subscriptionSection}>
            {activeSubs.length > 0 ? (
              <>
                <Text style={[styles.sectionHeader, { textAlign: isRTL ? 'right' : 'left' }]}>
                  {t('my_subscriptions')}
                </Text>
                <FlatList
                  horizontal
                  data={activeSubs}
                  keyExtractor={keyExtractor}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: Spacing.lg, gap: 12 }}
                  renderItem={renderActiveSubscription}
                  inverted={isRTL}
                  initialNumToRender={2}
                  windowSize={3}
                />
              </>
            ) : role === 'student' ? (
              <View style={{ paddingHorizontal: Spacing.lg }}>
                <LicenseActivationBanner />
              </View>
            ) : null}
          </View>
        )}

        {/* Routes List */}
        {isLoading ? (
          <LoadingList count={4} variant="route" />
        ) : (
          <FlatList
            data={error ? [] : filteredRoutes}
            keyExtractor={keyExtractor}
            renderItem={renderRoute}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={onRefresh}
                colors={[Colors.primary]}
                tintColor={Colors.primary}
              />
            }
            ListEmptyComponent={error ? ListError : ListEmpty}
            ListHeaderComponent={renderRoutesHeader}
            showsVerticalScrollIndicator={false}
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  // Welcome Header
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.white,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  greetingText: {
    fontFamily: FontFamily.bold,
    fontSize: 20,
    color: Colors.text,
  },
  subGreetingText: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  avatarText: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.primary,
  },
  // Search
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    zIndex: 10,
  },
  searchContainerFocused: {
    zIndex: 100,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    height: 50,
    borderRadius: BorderRadius.pill,
    ...Shadow.sm,
    borderWidth: 1.5,
    borderColor: Colors.transparent,
  },
  searchBarFocused: {
    borderColor: Colors.primary,
    ...Shadow.md,
  },
  searchResults: {
    position: 'absolute',
    top: 66,
    left: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.sm,
    ...Shadow.md,
    zIndex: 101,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  searchResultText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: 15,
    color: Colors.text,
    paddingHorizontal: Spacing.sm,
  },
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: 16,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: '#EFECE9',
    ...Shadow.sm,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  statIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.text,
  },
  statLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.xs,
  },
  // Sections
  subscriptionSection: {
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.textMuted,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  routesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  routesCount: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.primary,
    backgroundColor: Colors.primarySurface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
  // List
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  // Empty / Error
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.section,
    gap: Spacing.md,
  },
  emptyTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    color: Colors.textSecondary,
  },
  emptySubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.textMuted,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  retryText: {
    fontFamily: FontFamily.bold,
    color: Colors.white,
    fontSize: 14,
  },
  favoritesContainer: {
    backgroundColor: 'transparent',
    paddingBottom: Spacing.md,
  },
  favoritesScroll: {
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  favoriteLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 4,
  },
  favoriteLabelText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: Colors.textMuted,
  },
  favoriteChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  favoriteChipActive: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.primary,
  },
  favoriteChipText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  favoriteChipTextActive: {
    color: Colors.primary,
    fontFamily: FontFamily.bold,
  },
  favoriteActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteActionButton: {
    padding: Spacing.xs,
  },
});
