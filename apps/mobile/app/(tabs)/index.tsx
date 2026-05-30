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
  Animated,
  Platform,
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

interface FavoriteChipProps {
  fav: string;
  isActive: boolean;
  isRTL: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

const FavoriteChip = React.memo(
  ({ fav, isActive, isRTL, onPress, onLongPress }: FavoriteChipProps) => {
    const scale = React.useRef(new Animated.Value(1)).current;
    const starScale = React.useRef(new Animated.Value(isActive ? 1.25 : 1)).current;

    React.useEffect(() => {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: isActive ? 1.05 : 1,
          friction: 5,
          tension: 40,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.spring(starScale, {
          toValue: isActive ? 1.25 : 1,
          friction: 4,
          tension: 50,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    }, [isActive]);

    const handlePress = () => {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 0.92,
          duration: 80,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.spring(scale, {
          toValue: isActive ? 1 : 1.05,
          friction: 4,
          tension: 40,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
      onPress();
    };

    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={[
            styles.favoriteChip,
            isActive && styles.favoriteChipActive,
            isRTL && { flexDirection: 'row-reverse' },
          ]}
          onPress={handlePress}
          onLongPress={onLongPress}
          activeOpacity={0.9}
        >
          <Animated.View style={{ transform: [{ scale: starScale }] }}>
            <Ionicons
              name={isActive ? 'star' : 'star-outline'}
              size={14}
              color={isActive ? Colors.warning : Colors.textMuted}
            />
          </Animated.View>
          <Text style={[styles.favoriteChipLabel, isActive && styles.favoriteChipLabelActive]}>
            {fav}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  },
);

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

  const handleFavoriteLongPress = (loc: string) => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setAlertTitle(t('favorites'));
    setAlertMessage(
      isRTL
        ? `هل تريد إزالة "${loc}" من المواقع المفضلة؟`
        : `Do you want to remove "${loc}" from favorites?`,
    );
    setAlertType('question');
    setAlertButtons([
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: () => handleRemoveFavorite(loc),
      },
    ]);
    setAlertVisible(true);
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
        <View style={{ marginHorizontal: Spacing.lg }}>
          <RouteCard
            item={item}
            isSubscribed={isSubscribed}
            driverRating={driverRatings[item.driver_id] ?? null}
            flat={false}
          />
        </View>
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
  const ListHeader = useMemo(() => {
    return (
      <View style={styles.mainContent}>
        {/* Container 1: Widgets Dashboard Card */}
        <View style={styles.widgetsMainContainer}>
          {/* Quick Stats Strip */}
          <View style={[styles.statsRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSearchQuery('');
              }}
              style={styles.statItem}
            >
              <View style={[styles.statIcon, { backgroundColor: 'rgba(10, 92, 54, 0.05)' }]}>
                <Ionicons name="bus" size={20} color="#0A5C36" />
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
              <View style={[styles.statIcon, { backgroundColor: 'rgba(10, 92, 54, 0.05)' }]}>
                <Ionicons name="checkmark-circle" size={20} color="#0A5C36" />
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
              <View style={[styles.statIcon, { backgroundColor: 'rgba(10, 92, 54, 0.05)' }]}>
                <Ionicons name="car" size={20} color="#0A5C36" />
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.favoritesScrollContent,
              isRTL && { flexDirection: 'row-reverse' },
            ]}
          >
            {favorites.map((fav) => {
              const isActive = searchQuery === fav;
              return (
                <FavoriteChip
                  key={fav}
                  fav={fav}
                  isActive={isActive}
                  isRTL={isRTL}
                  onPress={() => {
                    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSearchQuery(isActive ? '' : fav);
                  }}
                  onLongPress={() => handleFavoriteLongPress(fav)}
                />
              );
            })}
          </ScrollView>

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
                      style={[styles.activationContent, isRTL && { flexDirection: 'row-reverse' }]}
                    >
                      <View style={styles.activationIconWrapper}>
                        <Ionicons name="card" size={20} color="#0A5C36" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[styles.activationTitle, { textAlign: isRTL ? 'right' : 'left' }]}
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

        {/* Section Header for Routes */}
        <View style={styles.routesHeaderWrapper}>
          <View style={[styles.routesContainerHeader, isRTL && { flexDirection: 'row-reverse' }]}>
            <Text style={styles.routesContainerTitle}>{t('available_routes')}</Text>
            <View style={styles.routesBadge}>
              <Text style={styles.routesBadgeText}>
                {filteredRoutes.length} {t('route')}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }, [
    routes,
    activeSubs,
    favorites,
    searchQuery,
    subsLoading,
    role,
    isRTL,
    t,
    filteredRoutes.length,
  ]);
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

      {/* Branded Header Banner (Fixed at the top) */}
      <View style={[styles.headerBanner, { paddingTop: top + Spacing.sm }]}>
        {/* Glassmorphic Background Effects */}
        <View style={styles.glassOverlay} />
        <View style={styles.glassHighlight} />

        <View style={styles.headerTopRow}>
          <View style={styles.brandLogoContainer}>
            <Text style={styles.brandLogoText}>{isRTL ? 'سير' : 'Sair'}</Text>
            <Text style={styles.brandLogoTextDot}>.</Text>
          </View>

          <View style={[styles.headerActions, isRTL && { flexDirection: 'row-reverse' }]}>
            {/* Help Button */}
            <TouchableOpacity
              style={styles.notificationHeaderButton}
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/help');
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="help-circle-outline" size={22} color={Colors.primaryDeep} />
            </TouchableOpacity>

            {/* Notification Button */}
            <TouchableOpacity
              style={styles.notificationHeaderButton}
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/notifications');
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={22} color={Colors.primaryDeep} />
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
                <Ionicons name="person" size={18} color={Colors.primaryDeep} />
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
            color={searchFocused ? '#0A5C36' : Colors.textMuted}
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
                  <Ionicons name="star-outline" size={18} color="#0A5C36" />
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

      <FlatList
        data={isLoading || error ? [] : filteredRoutes}
        renderItem={renderRoute}
        keyExtractor={routeKeyExtractor}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Spacing.xxl }]}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          isLoading ? (
            <LoadingList count={3} variant="route" />
          ) : error ? (
            <ListError />
          ) : (
            <ListEmpty />
          )
        }
      />

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
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: Colors.background,
  },
  mainContent: {
    flex: 1,
    paddingTop: Spacing.md,
  },
  // Branded Header
  headerBanner: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
    ...Shadow.sm,
    zIndex: 10,
    position: 'relative',
  },
  glassOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.white,
  },
  glassHighlight: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },

  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    zIndex: 2,
  },
  brandLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  brandLogoText: {
    fontFamily: FontFamily.logo,
    fontSize: 28,
    color: Colors.primaryDeep,
  },
  brandLogoTextDot: {
    fontFamily: FontFamily.bold,
    fontSize: 28,
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
    gap: Spacing.sm + 2,
    zIndex: 2,
  },
  notificationHeaderButton: {
    position: 'relative',
    padding: 9,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  unreadBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: Colors.error,
    borderRadius: 10,
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
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
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
    color: Colors.text,
  },
  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    paddingHorizontal: Spacing.md,
    height: 46,
    borderRadius: BorderRadius.lg,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    zIndex: 2,
  },
  searchBarFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
    ...Shadow.md,
  },
  searchResults: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingVertical: Spacing.sm,
    ...Shadow.lg,
    zIndex: 101,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 3,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  searchResultIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary + '15',
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
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
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
    gap: 6,
    paddingVertical: Spacing.xs,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primarySurface,
    borderWidth: 1,
    borderColor: Colors.primary + '12',
  },
  statValue: {
    fontFamily: FontFamily.bold,
    fontSize: 20,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.borderLight,
    marginHorizontal: Spacing.xs,
  },
  widgetDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.md,
  },
  favoritesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  favoritesHeaderTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  favoritesScrollContent: {
    paddingHorizontal: Spacing.xs,
    gap: Spacing.sm,
    paddingVertical: 4,
  },
  favoriteChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
  },
  favoriteChipActive: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.primary,
  },
  favoriteChipLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  favoriteChipLabelActive: {
    color: Colors.primaryDeep,
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
    paddingVertical: Spacing.sm + 2,
  },
  activationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  activationIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary + '15',
  },
  activationTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.text,
  },
  activationSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  // Routes Container
  routesMainContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.borderLight,
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
    fontSize: 16,
    color: Colors.text,
    letterSpacing: -0.2,
  },
  routesBadge: {
    backgroundColor: Colors.primarySurface,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.primary + '15',
  },
  routesBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: Colors.primaryDeep,
  },
  routesListWrapper: {
    marginTop: Spacing.xs,
  },
  routeItemDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
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
  routesHeaderWrapper: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
});
