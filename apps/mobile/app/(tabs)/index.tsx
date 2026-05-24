import React, { useState, useCallback, useRef, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoutes } from '../../src/hooks/useRoutes';
import { useSubscriptions, SubscriptionWithRoute } from '../../src/hooks/useTrips';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../../src/hooks/useStore';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useRouter, useFocusEffect } from 'expo-router';
import { Route } from '@sair/core';
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
import { useUnreadCount } from '../../src/hooks/useUnreadCount';
import CustomAlert, { AlertButton } from '../../src/components/CustomAlert';

export default function DiscoveryPage() {
  const { profile, role } = useAuthStore();
  const { top } = useSafeAreaInsets();
  const {
    routes,
    isLoading: routesLoading,
    error,
    refetch: refetchRoutes,
  } = useRoutes(profile?.institution_id);
  const { subscriptions, isLoading: subsLoading, refetch: refetchSubs } = useSubscriptions();
  const { t, isRTL, language } = useTranslation();
  const router = useRouter();
  const unreadCount = useUnreadCount();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(['جامعة بغداد', 'باب المعظم', 'الجادرية']);
  const [driverRatings, setDriverRatings] = useState<Record<string, number>>({});

  // Alert states
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | 'question'>(
    'info',
  );
  const [alertButtons, setAlertButtons] = useState<AlertButton[]>([]);

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

  // Fetch driver ratings when routes load
  React.useEffect(() => {
    if (!routes || routes.length === 0) return;

    const fetchDriverRatings = async () => {
      try {
        const driverIds = [...new Set(routes.map((r: Route) => r.driver_id).filter(Boolean))];
        if (driverIds.length === 0) return;

        const { data, error } = await supabase.rpc('get_drivers_avg_rating', {
          p_driver_ids: driverIds,
        });

        if (error) {
          logger.error('Failed to fetch driver ratings', { error: error.message });
          return;
        }

        const ratingsMap: Record<string, number> = {};
        if (data && Array.isArray(data)) {
          data.forEach((row: { driver_id: string; avg_rating: number }) => {
            ratingsMap[row.driver_id] = Number(row.avg_rating);
          });
        }
        setDriverRatings(ratingsMap);
      } catch (err) {
        logger.error('Failed to fetch driver ratings', err);
      }
    };

    fetchDriverRatings();
  }, [routes]);

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
      return (
        <RouteCard
          item={item}
          isSubscribed={isSubscribed}
          driverRating={driverRatings[item.driver_id] ?? null}
        />
      );
    },
    [subscriptions, driverRatings],
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

  const routeKeyExtractor = useCallback((item: Route) => item.id, []);

  const subKeyExtractor = useCallback((item: SubscriptionWithRoute) => item.id, []);

  const renderActiveSubscription = useCallback(
    ({ item }: { item: SubscriptionWithRoute }) => {
      const handleTrack = () => handleTrackActiveTrip(item.route_id);
      return (
        <View style={{ width: 300 }}>
          <ActiveSubscriptionCard activeSub={item} onTrackTrip={handleTrack} />
        </View>
      );
    },
    [handleTrackActiveTrip],
  );

  interface NominatimResult {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
    type: string;
  }
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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
          { headers: { 'User-Agent': 'Sair-App' } },
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
      <StatusBar style="dark" translucent />
      {/* Background Decorative Glass Blobs */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      {/* Branded Header Banner (Fixed at the top) */}
      <View style={[styles.headerBanner, { paddingTop: top + Spacing.sm }]}>
        <View style={[styles.headerTopRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <View style={[styles.brandLogoContainer, isRTL && { flexDirection: 'row-reverse' }]}>
            <Text style={styles.brandLogoText}>{isRTL ? 'سير' : 'Sair'}</Text>
            <Text style={styles.brandLogoTextDot}>.</Text>
          </View>

          <View style={[styles.headerActions, isRTL && { flexDirection: 'row-reverse' }]}>
            {/* Notification Button */}
            <TouchableOpacity
              style={styles.notificationHeaderButton}
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/notifications');
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={22} color={Colors.text} />
              {unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Avatar Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/profile');
              }}
              style={styles.avatarButton}
            >
              <View style={styles.avatarInner}>
                <Ionicons name="person" size={18} color={Colors.white} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar sits inside the header banner */}
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
            onFocus={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSearchFocused(true);
            }}
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
                  onPress={() => {
                    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    handleRemoveFavorite(searchQuery);
                  }}
                  style={styles.favoriteActionButton}
                >
                  <Ionicons name="star" size={18} color={Colors.warning} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    handleAddFavorite(searchQuery);
                  }}
                  style={styles.favoriteActionButton}
                >
                  <Ionicons name="star-outline" size={18} color={Colors.primary} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => {
                  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* mainContent containing the two main cards */}
        <View style={styles.mainContent}>
          {/* Container 1: Widgets Dashboard Card */}
          <View style={styles.widgetsMainContainer}>
            {/* Quick Stats Strip (Interactive, flat inside widgetsMainContainer) */}
            <View style={[styles.statsRow, isRTL && { flexDirection: 'row-reverse' }]}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSearchQuery('');
                }}
                style={styles.statItem}
              >
                <View style={[styles.statIcon, { backgroundColor: Colors.primarySurface }]}>
                  <Ionicons name="bus" size={20} color={Colors.primary} />
                </View>
                <Text style={styles.statValue}>{routes.length}</Text>
                <Text style={styles.statLabel} numberOfLines={1}>
                  {t('available_routes')}
                </Text>
              </TouchableOpacity>

              <View style={styles.statDivider} />

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/subscriptions');
                }}
                style={styles.statItem}
              >
                <View style={[styles.statIcon, { backgroundColor: Colors.successSurface }]}>
                  <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                </View>
                <Text style={styles.statValue}>{activeSubs.length}</Text>
                <Text style={styles.statLabel} numberOfLines={1}>
                  {t('my_subscriptions')}
                </Text>
              </TouchableOpacity>

              <View style={styles.statDivider} />

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setAlertTitle(t('seats_available'));
                  setAlertMessage(
                    isRTL
                      ? 'يتم تخصيص المقاعد تلقائياً للمشتركين الفعالين في الرحلة فور حضورك.'
                      : 'Seats are dynamically allocated to active subscribers once you board the vehicle.',
                  );
                  setAlertType('info');
                  setAlertButtons([{ text: t('ok'), style: 'default' }]);
                  setAlertVisible(true);
                }}
                style={styles.statItem}
              >
                <View style={[styles.statIcon, { backgroundColor: Colors.warningSurface }]}>
                  <Ionicons name="car" size={20} color={Colors.warning} />
                </View>
                <Text style={styles.statValue}>
                  {routes.reduce((sum, r) => sum + r.available_seats, 0)}
                </Text>
                <Text style={styles.statLabel} numberOfLines={1}>
                  {t('seats_available')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.widgetDivider} />

            {/* Saved Locations Strip (Favorites) */}
            <View style={[styles.favoritesHeaderRow, isRTL && { flexDirection: 'row-reverse' }]}>
              <Ionicons name="star" size={14} color={Colors.warning} />
              <Text style={styles.favoritesHeaderTitle}>{t('favorites')}</Text>
            </View>
            <View style={styles.favoritesContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                  styles.favoritesScroll,
                  isRTL && { flexDirection: 'row-reverse' },
                ]}
              >
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
                        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setSearchQuery(isActive ? '' : fav);
                      }}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={isActive ? 'location' : 'location-outline'}
                        size={13}
                        color={isActive ? Colors.primary : Colors.textMuted}
                        style={isRTL ? { marginLeft: 4 } : { marginRight: 4 }}
                      />
                      <Text
                        style={[styles.favoriteChipText, isActive && styles.favoriteChipTextActive]}
                      >
                        {fav}
                      </Text>
                      {isActive && (
                        <Ionicons
                          name="close-circle"
                          size={13}
                          color={Colors.primary}
                          style={isRTL ? { marginRight: 4 } : { marginLeft: 4 }}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Subscriptions / License Section */}
            {!subsLoading && (
              <View style={styles.subscriptionSection}>
                {activeSubs.length > 0 ? (
                  <View style={{ gap: Spacing.xs }}>
                    <Text
                      style={[styles.nestedSectionHeader, { textAlign: isRTL ? 'right' : 'left' }]}
                    >
                      {t('my_subscriptions')}
                    </Text>
                    <FlatList
                      horizontal
                      data={activeSubs}
                      keyExtractor={subKeyExtractor}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ paddingHorizontal: Spacing.md, gap: 12 }}
                      renderItem={renderActiveSubscription}
                      inverted={isRTL}
                      initialNumToRender={2}
                      windowSize={3}
                    />
                  </View>
                ) : role === 'student' ? (
                  <View style={{ paddingHorizontal: Spacing.xs }}>
                    <View style={styles.widgetDivider} />
                    <TouchableOpacity
                      style={[styles.flatActivationRow, isRTL && { flexDirection: 'row-reverse' }]}
                      onPress={() => {
                        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.push('/activate');
                      }}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.activationContent,
                          isRTL && { flexDirection: 'row-reverse' },
                        ]}
                      >
                        <View style={styles.activationIconWrapper}>
                          <Ionicons name="card" size={20} color={Colors.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text
                            style={[
                              styles.activationTitle,
                              { textAlign: isRTL ? 'right' : 'left' },
                            ]}
                          >
                            {t('activate_new_license')}
                          </Text>
                          <Text
                            style={[
                              styles.activationSubtitle,
                              { textAlign: isRTL ? 'right' : 'left' },
                            ]}
                          >
                            {t('activate_license_description')}
                          </Text>
                        </View>
                      </View>
                      <Ionicons
                        name={isRTL ? 'chevron-back' : 'chevron-forward'}
                        size={20}
                        color={Colors.textMuted}
                      />
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            )}
          </View>

          {/* Container 2: Available Routes Container */}
          <View style={styles.routesMainContainer}>
            <View style={[styles.routesContainerHeader, isRTL && { flexDirection: 'row-reverse' }]}>
              <Text style={styles.routesContainerTitle}>{t('available_routes')}</Text>
              <View style={styles.routesBadge}>
                <Text style={styles.routesBadgeText}>
                  {filteredRoutes.length} {t('route')}
                </Text>
              </View>
            </View>

            {/* List of Routes */}
            {isLoading ? (
              <LoadingList count={3} variant="route" />
            ) : error ? (
              <ListError />
            ) : filteredRoutes.length === 0 ? (
              <ListEmpty />
            ) : (
              <View style={styles.routesListWrapper}>
                {filteredRoutes.map((route) => {
                  const isSubscribed = subscriptions.some(
                    (sub) =>
                      sub.route_id === route.id &&
                      (sub.status === 'active' || sub.status === 'pending'),
                  );
                  return (
                    <RouteCard
                      key={route.id}
                      item={route}
                      isSubscribed={isSubscribed}
                      driverRating={driverRatings[route.driver_id] ?? null}
                      flat={true}
                    />
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Search Results Dropdown (floating absolute outside header to prevent clipping) */}
      {searchResults.length > 0 && (
        <View style={[styles.searchResults, { top: top + 112 }]}>
          {searchResults.map((result, index) => {
            const parts = result.display_name.split(',');
            const mainName = parts[0]?.trim();
            const subName = parts
              .slice(1)
              .map((p) => p.trim())
              .join(', ');
            return (
              <TouchableOpacity
                key={index}
                style={[styles.searchResultItem, isRTL && { flexDirection: 'row-reverse' }]}
                onPress={() => {
                  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSearchQuery(mainName);
                  setSearchResults([]);
                  setSearchFocused(false);
                }}
              >
                <View style={[styles.searchResultIconWrapper, isRTL && { marginLeft: Spacing.xs }]}>
                  <Ionicons name="location" size={16} color={Colors.primary} />
                </View>
                <View style={{ flex: 1, paddingVertical: 2 }}>
                  <Text
                    style={[styles.searchResultText, { textAlign: isRTL ? 'right' : 'left' }]}
                    numberOfLines={1}
                  >
                    {mainName}
                  </Text>
                  {subName ? (
                    <Text
                      style={[styles.searchResultSubtext, { textAlign: isRTL ? 'right' : 'left' }]}
                      numberOfLines={1}
                    >
                      {subName}
                    </Text>
                  ) : null}
                </View>
                <Ionicons
                  name={isRTL ? 'chevron-back' : 'chevron-forward'}
                  size={14}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
        buttons={alertButtons}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    position: 'relative',
    overflow: 'hidden',
  },
  // Blobs
  blob1: {
    position: 'absolute',
    top: -40,
    left: -40,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(194, 112, 62, 0.16)', // warm earthy orange tint
    zIndex: 0,
  },
  blob2: {
    position: 'absolute',
    top: 420,
    right: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(45, 45, 45, 0.08)', // charcoal neutral tint
    zIndex: 0,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: 'transparent',
  },
  mainContent: {
    flex: 1,
    paddingTop: Spacing.sm,
  },
  // Branded Header
  headerBanner: {
    backgroundColor: 'rgba(255, 255, 255, 0.45)', // Translucent glass banner
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.6)', // Glowing border
    ...Shadow.sm,
    zIndex: 10,
    overflow: 'hidden',
  },

  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  brandLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  brandLogoText: {
    fontFamily: FontFamily.logo,
    fontSize: 26,
    color: Colors.text,
  },
  brandLogoTextDot: {
    fontFamily: FontFamily.bold,
    fontSize: 26,
    color: Colors.primary,
  },
  greetingEmoji: {
    fontSize: 18,
  },
  greetingText: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.text,
  },
  brandSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  notificationHeaderButton: {
    position: 'relative',
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    ...Shadow.sm,
  },
  unreadBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.error,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  unreadBadgeText: {
    color: Colors.white,
    fontSize: 9,
    fontFamily: FontFamily.bold,
    lineHeight: 11,
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    ...Shadow.sm,
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.white,
  },
  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: Spacing.md,
    height: 44,
    borderRadius: BorderRadius.pill,
    ...Shadow.sm,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  searchBarFocused: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  searchResults: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: Spacing.sm,
    ...Shadow.md,
    zIndex: 101,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  searchResultIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(253, 240, 232, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  searchResultText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.text,
  },
  searchResultSubtext: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: 15,
    color: Colors.text,
    paddingHorizontal: Spacing.sm,
  },
  // Widgets Container
  widgetsMainContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)', // Translucent glass card
    borderRadius: 20,
    padding: Spacing.md,
    marginTop: Spacing.lg, // Safe gap below the header curtain instead of negative overlap
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    ...Shadow.md,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: Spacing.xs,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: Spacing.xs,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
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
    height: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginHorizontal: Spacing.xs,
  },
  widgetDivider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginVertical: Spacing.sm,
  },
  favoritesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  favoritesHeaderTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  favoritesContainer: {
    backgroundColor: 'transparent',
    marginHorizontal: -Spacing.md,
    paddingBottom: Spacing.xs,
    marginTop: Spacing.xs,
  },
  favoritesScroll: {
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  favoriteChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    ...Shadow.sm,
  },
  favoriteChipActive: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.primary,
  },
  favoriteChipText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
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
  subscriptionSection: {
    marginHorizontal: -Spacing.md,
    marginTop: Spacing.xs,
  },
  nestedSectionHeader: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
  },
  flatActivationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  activationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  activationIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(253, 240, 232, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  activationTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.text,
  },
  activationSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 11.5,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  // Routes Container
  routesMainContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)', // Translucent glass card
    borderRadius: 20,
    padding: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xxl,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    ...Shadow.md,
  },
  routesContainerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  routesContainerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.text,
  },
  routesBadge: {
    backgroundColor: 'rgba(253, 240, 232, 0.8)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  routesBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: Colors.primary,
  },
  routesListWrapper: {
    marginTop: Spacing.xs,
  },
  routeItemDivider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginVertical: Spacing.sm,
  },
  // Empty State override inside container
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  emptyTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.textSecondary,
  },
  emptySubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.textMuted,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  retryText: {
    fontFamily: FontFamily.bold,
    color: Colors.white,
    fontSize: 13,
  },
});
