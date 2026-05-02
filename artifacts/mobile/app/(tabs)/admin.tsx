import FeatherIcon from "@/components/FeatherIcon";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useCallback } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Platform, RefreshControl, Alert, TextInput, Modal, ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { api } from "@/lib/api";

type AdminTab = "dashboard" | "cards" | "users" | "subscriptions";

interface Stats {
  students: number; drivers: number; activeSubscriptions: number;
  completedTrips: number; totalRevenue: number;
  cards: { total: number; unused: number; used: number };
}
interface AdminUser { id: string; name: string; phone: string; role: string; isAdmin: boolean; isOnline: boolean; totalTrips: number; rating: string; createdAt: string; }
interface AdminCard { id: string; code: string; plan: string; durationMonths: number; status: string; batchId?: string; activatedAt?: string; createdAt: string; }
interface AdminSub { id: string; studentId: string; driverId: string; driverName: string; plan: string; startDate: string; endDate: string; isActive: boolean; monthlyFare: string; tripsUsed: number; tripsPerMonth: number; }

const PLAN_LABELS: Record<string, string> = { basic: "أساسي", standard: "قياسي", premium: "مميز" };
const PLAN_COLORS: Record<string, string> = { basic: "#4A90D9", standard: "#1A3C6E", premium: "#FF6B35" };

export default function AdminScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useApp();
  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);

  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [cards, setCards] = useState<AdminCard[]>([]);
  const [subs, setSubs] = useState<AdminSub[]>([]);
  const [loadingTab, setLoadingTab] = useState(false);

  const [showGenModal, setShowGenModal] = useState(false);
  const [genPlan, setGenPlan] = useState<"basic" | "standard" | "premium">("standard");
  const [genCount, setGenCount] = useState("10");
  const [genMonths, setGenMonths] = useState("1");
  const [generating, setGenerating] = useState(false);
  const [newCards, setNewCards] = useState<AdminCard[]>([]);

  const [userFilter, setUserFilter] = useState<"all" | "student" | "driver">("all");
  const [cardFilter, setCardFilter] = useState<"all" | "unused" | "activated">("all");

  const fetchStats = useCallback(async () => {
    try {
      const data = await api.get<Stats>("/admin/stats");
      setStats(data);
    } catch { }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await api.get<AdminUser[]>("/admin/users");
      setUsers(data);
    } catch { }
  }, []);

  const fetchCards = useCallback(async () => {
    try {
      const data = await api.get<AdminCard[]>("/admin/cards");
      setCards(data);
    } catch { }
  }, []);

  const fetchSubs = useCallback(async () => {
    try {
      const data = await api.get<AdminSub[]>("/admin/subscriptions");
      setSubs(data);
    } catch { }
  }, []);

  useEffect(() => { fetchStats(); }, []);

  useEffect(() => {
    setLoadingTab(true);
    const fetch = async () => {
      if (activeTab === "dashboard") await fetchStats();
      else if (activeTab === "users") await fetchUsers();
      else if (activeTab === "cards") await fetchCards();
      else if (activeTab === "subscriptions") await fetchSubs();
      setLoadingTab(false);
    };
    fetch();
  }, [activeTab]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchStats(), activeTab === "users" ? fetchUsers() : activeTab === "cards" ? fetchCards() : activeTab === "subscriptions" ? fetchSubs() : Promise.resolve()]);
    setRefreshing(false);
  }, [activeTab]);

  const handleGenerateCards = async () => {
    const count = parseInt(genCount);
    const months = parseInt(genMonths);
    if (isNaN(count) || count < 1 || count > 500) { Alert.alert("خطأ", "العدد يجب أن يكون بين 1 و 500"); return; }
    if (isNaN(months) || months < 1 || months > 12) { Alert.alert("خطأ", "المدة بين 1 و 12 شهراً"); return; }
    setGenerating(true);
    try {
      const data = await api.post<{ cards: AdminCard[]; message: string }>("/admin/cards/generate", { plan: genPlan, count, durationMonths: months });
      setNewCards(data.cards);
      await fetchCards();
      await fetchStats();
    } catch (err: any) {
      Alert.alert("خطأ", err?.response?.data?.error ?? "فشل إنشاء البطاقات");
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteCard = (id: string) => {
    Alert.alert("حذف البطاقة", "هل أنت متأكد؟", [
      { text: "تراجع", style: "cancel" },
      {
        text: "حذف", style: "destructive", onPress: async () => {
          try {
            await api.delete(`/admin/cards/${id}`);
            await fetchCards();
            await fetchStats();
          } catch (err: any) {
            Alert.alert("خطأ", err?.response?.data?.error ?? "فشل الحذف");
          }
        }
      }
    ]);
  };

  const filteredUsers = userFilter === "all" ? users : users.filter(u => u.role === userFilter);
  const filteredCards = cardFilter === "all" ? cards : cards.filter(c => c.status === cardFilter);

  if (!user?.isAdmin) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }]}>
        <FeatherIcon name="lock" size={48} color={colors.mutedForeground} />
        <Text style={[styles.noAccessText, { color: colors.mutedForeground }]}>غير مصرح بالوصول</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={["#0D2847", "#1A3C6E"]} style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View style={styles.headerTop}>
          <View style={[styles.adminBadge, { backgroundColor: "#FF6B35" }]}>
            <FeatherIcon name="shield" size={12} color="#fff" />
            <Text style={styles.adminBadgeText}>مدير</Text>
          </View>
          <Text style={styles.headerTitle}>لوحة الإدارة</Text>
        </View>
        {stats && (
          <View style={styles.headerStats}>
            <View style={styles.headerStat}>
              <Text style={styles.headerStatVal}>{stats.students}</Text>
              <Text style={styles.headerStatLabel}>طالب</Text>
            </View>
            <View style={styles.headerStatDiv} />
            <View style={styles.headerStat}>
              <Text style={styles.headerStatVal}>{stats.drivers}</Text>
              <Text style={styles.headerStatLabel}>سائق</Text>
            </View>
            <View style={styles.headerStatDiv} />
            <View style={styles.headerStat}>
              <Text style={styles.headerStatVal}>{stats.activeSubscriptions}</Text>
              <Text style={styles.headerStatLabel}>اشتراك نشط</Text>
            </View>
            <View style={styles.headerStatDiv} />
            <View style={styles.headerStat}>
              <Text style={styles.headerStatVal}>{(stats.totalRevenue / 1000).toFixed(0)}k</Text>
              <Text style={styles.headerStatLabel}>إيراد</Text>
            </View>
          </View>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
          {(["dashboard", "cards", "users", "subscriptions"] as AdminTab[]).map((t) => {
            const labels: Record<AdminTab, string> = { dashboard: "📊 الإحصاء", cards: "🎫 البطاقات", users: "👥 المستخدمون", subscriptions: "📋 الاشتراكات" };
            return (
              <TouchableOpacity key={t} style={[styles.tab, activeTab === t && styles.tabActive]} onPress={() => setActiveTab(t)}>
                <Text style={[styles.tabText, { color: activeTab === t ? "#fff" : "rgba(255,255,255,0.6)" }]}>{labels[t]}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </LinearGradient>

      {loadingTab && !refreshing ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        >
          {activeTab === "dashboard" && stats && (
            <>
              <View style={styles.statsGrid}>
                {[
                  { icon: "users", label: "إجمالي الطلاب", val: stats.students, color: "#4A90D9" },
                  { icon: "truck", label: "إجمالي السائقين", val: stats.drivers, color: "#22C55E" },
                  { icon: "check-circle", label: "رحلات مكتملة", val: stats.completedTrips, color: "#8B5CF6" },
                  { icon: "credit-card", label: "اشتراكات نشطة", val: stats.activeSubscriptions, color: "#FF6B35" },
                  { icon: "dollar-sign", label: "إيراد التطبيق (د.ع)", val: `${(stats.totalRevenue / 1000).toFixed(0)}k`, color: "#F59E0B" },
                  { icon: "tag", label: "بطاقات غير مستخدمة", val: stats.cards.unused, color: "#06B6D4" },
                ].map((s, i) => (
                  <View key={i} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={[styles.statIcon, { backgroundColor: s.color + "20" }]}>
                      <FeatherIcon name={s.icon as any} size={20} color={s.color} />
                    </View>
                    <Text style={[styles.statVal, { color: colors.foreground }]}>{s.val}</Text>
                    <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
                  </View>
                ))}
              </View>

              <View style={[styles.cardsSummary, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>حالة البطاقات</Text>
                <View style={styles.cardsBar}>
                  {stats.cards.total > 0 && (
                    <>
                      <View style={[styles.cardsBarUsed, { flex: stats.cards.used, backgroundColor: "#22C55E" }]} />
                      <View style={[styles.cardsBarUnused, { flex: stats.cards.unused, backgroundColor: "#E2E8F0" }]} />
                    </>
                  )}
                </View>
                <View style={styles.cardsLegend}>
                  <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: "#22C55E" }]} /><Text style={[styles.legendText, { color: colors.mutedForeground }]}>مفعّلة ({stats.cards.used})</Text></View>
                  <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: "#E2E8F0" }]} /><Text style={[styles.legendText, { color: colors.mutedForeground }]}>غير مستخدمة ({stats.cards.unused})</Text></View>
                  <Text style={[styles.legendText, { color: colors.mutedForeground }]}>المجموع: {stats.cards.total}</Text>
                </View>
              </View>

              <TouchableOpacity style={[styles.quickGenBtn, { backgroundColor: colors.accent }]} onPress={() => setShowGenModal(true)}>
                <FeatherIcon name="plus-circle" size={20} color="#fff" />
                <Text style={styles.quickGenBtnText}>إنشاء بطاقات اشتراك جديدة</Text>
              </TouchableOpacity>
            </>
          )}

          {activeTab === "cards" && (
            <>
              <View style={styles.filterRow}>
                <TouchableOpacity style={[styles.filterBtn, { backgroundColor: cardFilter === "all" ? colors.primary : colors.card, borderColor: colors.border }]} onPress={() => setCardFilter("all")}>
                  <Text style={[styles.filterBtnText, { color: cardFilter === "all" ? "#fff" : colors.foreground }]}>الكل ({cards.length})</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.filterBtn, { backgroundColor: cardFilter === "unused" ? colors.primary : colors.card, borderColor: colors.border }]} onPress={() => setCardFilter("unused")}>
                  <Text style={[styles.filterBtnText, { color: cardFilter === "unused" ? "#fff" : colors.foreground }]}>متاحة ({cards.filter(c => c.status === "unused").length})</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.filterBtn, { backgroundColor: cardFilter === "activated" ? colors.primary : colors.card, borderColor: colors.border }]} onPress={() => setCardFilter("activated")}>
                  <Text style={[styles.filterBtnText, { color: cardFilter === "activated" ? "#fff" : colors.foreground }]}>مفعّلة ({cards.filter(c => c.status === "activated").length})</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={[styles.genBtn, { backgroundColor: colors.accent }]} onPress={() => { setNewCards([]); setShowGenModal(true); }}>
                <FeatherIcon name="plus" size={16} color="#fff" />
                <Text style={styles.genBtnText}>إنشاء بطاقات جديدة</Text>
              </TouchableOpacity>

              {filteredCards.map((card) => (
                <View key={card.id} style={[styles.cardItem, { backgroundColor: colors.card, borderColor: card.status === "activated" ? "#22C55E40" : colors.border }]}>
                  <View style={styles.cardItemTop}>
                    <View style={styles.cardItemLeft}>
                      <Text style={[styles.cardCode, { color: colors.foreground }]}>{card.code}</Text>
                      <View style={styles.cardMeta}>
                        <View style={[styles.planTag, { backgroundColor: PLAN_COLORS[card.plan] + "20" }]}>
                          <Text style={[styles.planTagText, { color: PLAN_COLORS[card.plan] }]}>{PLAN_LABELS[card.plan]}</Text>
                        </View>
                        <Text style={[styles.cardDuration, { color: colors.mutedForeground }]}>{card.durationMonths} شهر</Text>
                      </View>
                    </View>
                    <View style={styles.cardItemRight}>
                      <View style={[styles.statusBadge, { backgroundColor: card.status === "activated" ? "#22C55E20" : "#F59E0B20" }]}>
                        <Text style={[styles.statusBadgeText, { color: card.status === "activated" ? "#22C55E" : "#F59E0B" }]}>
                          {card.status === "activated" ? "✓ مفعّلة" : "متاحة"}
                        </Text>
                      </View>
                      {card.status === "unused" && (
                        <TouchableOpacity onPress={() => handleDeleteCard(card.id)} style={styles.deleteBtn}>
                          <FeatherIcon name="trash-2" size={14} color="#EF4444" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  {card.activatedAt && (
                    <Text style={[styles.cardDate, { color: colors.mutedForeground }]}>
                      فُعِّلت: {new Date(card.activatedAt).toLocaleDateString("ar-IQ")}
                    </Text>
                  )}
                </View>
              ))}
              {filteredCards.length === 0 && (
                <View style={styles.emptyState}>
                  <FeatherIcon name="tag" size={32} color={colors.mutedForeground} />
                  <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>لا توجد بطاقات</Text>
                </View>
              )}
            </>
          )}

          {activeTab === "users" && (
            <>
              <View style={styles.filterRow}>
                {(["all", "student", "driver"] as const).map(f => (
                  <TouchableOpacity key={f} style={[styles.filterBtn, { backgroundColor: userFilter === f ? colors.primary : colors.card, borderColor: colors.border }]} onPress={() => setUserFilter(f)}>
                    <Text style={[styles.filterBtnText, { color: userFilter === f ? "#fff" : colors.foreground }]}>
                      {f === "all" ? `الكل (${users.length})` : f === "student" ? `طلاب (${users.filter(u => u.role === "student").length})` : `سائقون (${users.filter(u => u.role === "driver").length})`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {filteredUsers.map((u) => (
                <View key={u.id} style={[styles.userItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.userAvatar, { backgroundColor: u.role === "driver" ? "#5B8DEF20" : "#FF6B3520" }]}>
                    <FeatherIcon name={u.role === "driver" ? "truck" : "user"} size={18} color={u.role === "driver" ? "#5B8DEF" : "#FF6B35"} />
                  </View>
                  <View style={styles.userInfo}>
                    <View style={styles.userNameRow}>
                      <Text style={[styles.userName, { color: colors.foreground }]}>{u.name}</Text>
                      {u.isAdmin && (
                        <View style={[styles.adminTag, { backgroundColor: "#FF6B3520" }]}>
                          <Text style={[styles.adminTagText, { color: "#FF6B35" }]}>مدير</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.userPhone, { color: colors.mutedForeground }]}>{u.phone}</Text>
                    <Text style={[styles.userMeta, { color: colors.mutedForeground }]}>
                      {u.totalTrips} رحلة · ⭐ {Number(u.rating).toFixed(1)}
                    </Text>
                  </View>
                  <View style={[styles.onlineIndicator, { backgroundColor: u.isOnline ? "#22C55E" : colors.border }]} />
                </View>
              ))}
              {filteredUsers.length === 0 && (
                <View style={styles.emptyState}>
                  <FeatherIcon name="users" size={32} color={colors.mutedForeground} />
                  <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>لا يوجد مستخدمون</Text>
                </View>
              )}
            </>
          )}

          {activeTab === "subscriptions" && (
            <>
              <Text style={[styles.subCount, { color: colors.mutedForeground }]}>
                {subs.filter(s => s.isActive).length} اشتراك نشط من أصل {subs.length}
              </Text>
              {subs.map((s) => {
                const daysLeft = Math.max(0, Math.ceil((new Date(s.endDate).getTime() - Date.now()) / 86400000));
                return (
                  <View key={s.id} style={[styles.subItem, { backgroundColor: colors.card, borderColor: s.isActive ? colors.primary + "30" : colors.border }]}>
                    <View style={styles.subItemTop}>
                      <View style={[styles.planTag, { backgroundColor: PLAN_COLORS[s.plan] + "20" }]}>
                        <Text style={[styles.planTagText, { color: PLAN_COLORS[s.plan] }]}>{PLAN_LABELS[s.plan]}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: s.isActive ? "#22C55E20" : "#94A3B820" }]}>
                        <Text style={[styles.statusBadgeText, { color: s.isActive ? "#22C55E" : "#94A3B8" }]}>{s.isActive ? "نشط" : "منتهي"}</Text>
                      </View>
                    </View>
                    <Text style={[styles.subDriver, { color: colors.foreground }]}>مع السائق: {s.driverName}</Text>
                    <View style={styles.subMeta}>
                      <Text style={[styles.subMetaText, { color: colors.mutedForeground }]}>{s.tripsUsed}/{s.tripsPerMonth === 999 ? "∞" : s.tripsPerMonth} رحلة</Text>
                      <Text style={[styles.subMetaText, { color: s.isActive && daysLeft < 5 ? "#EF4444" : colors.mutedForeground }]}>
                        {s.isActive ? `${daysLeft} يوم متبقي` : `انتهى ${new Date(s.endDate).toLocaleDateString("ar-IQ")}`}
                      </Text>
                      <Text style={[styles.subMetaText, { color: colors.mutedForeground }]}>{(Number(s.monthlyFare) / 1000).toFixed(0)}k د.ع</Text>
                    </View>
                  </View>
                );
              })}
              {subs.length === 0 && (
                <View style={styles.emptyState}>
                  <FeatherIcon name="calendar" size={32} color={colors.mutedForeground} />
                  <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>لا توجد اشتراكات</Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
      )}

      <Modal visible={showGenModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowGenModal(false)}>
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => { setShowGenModal(false); setNewCards([]); }}>
              <FeatherIcon name="x" size={24} color={colors.foreground} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>إنشاء بطاقات اشتراك</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
            {newCards.length > 0 ? (
              <>
                <View style={[styles.successBanner, { backgroundColor: "#22C55E15", borderColor: "#22C55E30" }]}>
                  <FeatherIcon name="check-circle" size={20} color="#22C55E" />
                  <Text style={[styles.successBannerText, { color: "#22C55E" }]}>تم إنشاء {newCards.length} بطاقة بنجاح</Text>
                </View>
                {newCards.map((c) => (
                  <View key={c.id} style={[styles.newCardItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.newCardCode, { color: colors.foreground }]}>{c.code}</Text>
                    <Text style={[styles.newCardPlan, { color: PLAN_COLORS[c.plan] }]}>{PLAN_LABELS[c.plan]} · {c.durationMonths} شهر</Text>
                  </View>
                ))}
              </>
            ) : (
              <>
                <View>
                  <Text style={[styles.modalLabel, { color: colors.mutedForeground }]}>نوع الخطة</Text>
                  <View style={styles.planBtns}>
                    {(["basic", "standard", "premium"] as const).map(p => (
                      <TouchableOpacity key={p} style={[styles.planBtn, { backgroundColor: genPlan === p ? PLAN_COLORS[p] : colors.card, borderColor: PLAN_COLORS[p] + "40" }]} onPress={() => setGenPlan(p)}>
                        <Text style={[styles.planBtnText, { color: genPlan === p ? "#fff" : PLAN_COLORS[p] }]}>{PLAN_LABELS[p]}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <View>
                  <Text style={[styles.modalLabel, { color: colors.mutedForeground }]}>عدد البطاقات (1-500)</Text>
                  <TextInput style={[styles.modalInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} value={genCount} onChangeText={setGenCount} keyboardType="number-pad" textAlign="right" placeholder="10" placeholderTextColor={colors.mutedForeground} />
                </View>
                <View>
                  <Text style={[styles.modalLabel, { color: colors.mutedForeground }]}>مدة الاشتراك (شهور)</Text>
                  <View style={styles.monthsBtns}>
                    {["1", "2", "3", "6", "12"].map(m => (
                      <TouchableOpacity key={m} style={[styles.monthBtn, { backgroundColor: genMonths === m ? colors.primary : colors.card, borderColor: colors.border }]} onPress={() => setGenMonths(m)}>
                        <Text style={[styles.monthBtnText, { color: genMonths === m ? "#fff" : colors.foreground }]}>{m}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <TouchableOpacity style={[styles.genSubmitBtn, { backgroundColor: colors.accent, opacity: generating ? 0.7 : 1 }]} onPress={handleGenerateCards} disabled={generating}>
                  {generating ? <ActivityIndicator color="#fff" /> : (
                    <>
                      <FeatherIcon name="zap" size={18} color="#fff" />
                      <Text style={styles.genSubmitText}>إنشاء {genCount} بطاقة</Text>
                    </>
                  )}
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  noAccessText: { fontSize: 16, fontFamily: "Inter_500Medium", marginTop: 12 },
  header: { paddingHorizontal: 16, paddingBottom: 0 },
  headerTop: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 10, marginBottom: 12 },
  adminBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  adminBadgeText: { color: "#fff", fontSize: 11, fontFamily: "Inter_700Bold" },
  headerTitle: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#fff" },
  headerStats: { flexDirection: "row", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 12, padding: 12, marginBottom: 12 },
  headerStat: { flex: 1, alignItems: "center" },
  headerStatVal: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#fff" },
  headerStatLabel: { fontSize: 10, color: "rgba(255,255,255,0.6)", fontFamily: "Inter_400Regular" },
  headerStatDiv: { width: 1, backgroundColor: "rgba(255,255,255,0.15)" },
  tabsRow: { flexDirection: "row", gap: 8, paddingVertical: 12, paddingHorizontal: 2 },
  tab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  tabActive: { backgroundColor: "rgba(255,255,255,0.2)" },
  tabText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  loadingCenter: { flex: 1, alignItems: "center", justifyContent: "center" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 16 },
  statCard: { width: "47%", borderRadius: 14, borderWidth: 1, padding: 14, alignItems: "center", gap: 8 },
  statIcon: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  statVal: { fontSize: 22, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center" },
  cardsSummary: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 12, textAlign: "right" },
  cardsBar: { height: 10, borderRadius: 5, overflow: "hidden", flexDirection: "row", backgroundColor: "#E2E8F0", marginBottom: 8 },
  cardsBarUsed: { height: "100%" },
  cardsBarUnused: { height: "100%" },
  cardsLegend: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  quickGenBtn: { borderRadius: 14, padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8 },
  quickGenBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_700Bold" },
  filterRow: { flexDirection: "row", gap: 8, marginBottom: 12, flexWrap: "wrap" },
  filterBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  filterBtnText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  genBtn: { borderRadius: 12, padding: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 },
  genBtnText: { color: "#fff", fontSize: 14, fontFamily: "Inter_700Bold" },
  cardItem: { borderRadius: 12, borderWidth: 1, padding: 14, marginBottom: 8 },
  cardItemTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  cardItemLeft: { flex: 1 },
  cardItemRight: { alignItems: "flex-end", gap: 6 },
  cardCode: { fontSize: 16, fontFamily: "Inter_700Bold", letterSpacing: 2, marginBottom: 6 },
  cardMeta: { flexDirection: "row", alignItems: "center", gap: 8 },
  planTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  planTagText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  cardDuration: { fontSize: 12, fontFamily: "Inter_400Regular" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusBadgeText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  deleteBtn: { padding: 4 },
  cardDate: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 6, textAlign: "right" },
  userItem: { borderRadius: 12, borderWidth: 1, padding: 12, marginBottom: 8, flexDirection: "row", alignItems: "center", gap: 12 },
  userAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  userInfo: { flex: 1 },
  userNameRow: { flexDirection: "row", alignItems: "center", gap: 6, justifyContent: "flex-end" },
  userName: { fontSize: 15, fontFamily: "Inter_600SemiBold", textAlign: "right" },
  adminTag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  adminTagText: { fontSize: 10, fontFamily: "Inter_700Bold" },
  userPhone: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "right", marginTop: 2 },
  userMeta: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "right", marginTop: 2 },
  onlineIndicator: { width: 10, height: 10, borderRadius: 5 },
  subCount: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "right", marginBottom: 12 },
  subItem: { borderRadius: 12, borderWidth: 1, padding: 14, marginBottom: 8 },
  subItemTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  subDriver: { fontSize: 14, fontFamily: "Inter_600SemiBold", textAlign: "right", marginBottom: 6 },
  subMeta: { flexDirection: "row", justifyContent: "space-between" },
  subMetaText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  emptyState: { alignItems: "center", paddingVertical: 40, gap: 12 },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  modalContainer: { flex: 1 },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderBottomWidth: 1 },
  modalTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  modalLabel: { fontSize: 13, fontFamily: "Inter_500Medium", marginBottom: 8, textAlign: "right" },
  modalInput: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, fontFamily: "Inter_400Regular" },
  planBtns: { flexDirection: "row", gap: 8 },
  planBtn: { flex: 1, padding: 12, borderRadius: 10, alignItems: "center", borderWidth: 1 },
  planBtnText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  monthsBtns: { flexDirection: "row", gap: 8 },
  monthBtn: { flex: 1, padding: 10, borderRadius: 10, alignItems: "center", borderWidth: 1 },
  monthBtnText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  genSubmitBtn: { borderRadius: 14, padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  genSubmitText: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold" },
  successBanner: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderRadius: 12, borderWidth: 1 },
  successBannerText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  newCardItem: { borderRadius: 10, borderWidth: 1, padding: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  newCardCode: { fontSize: 14, fontFamily: "Inter_700Bold", letterSpacing: 2 },
  newCardPlan: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
});
