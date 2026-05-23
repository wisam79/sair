import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontFamily, Spacing, BorderRadius, Shadow } from '../src/theme';
import { useTranslation } from '../src/hooks/useTranslation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FAQItem {
  id: string;
  category: 'general' | 'booking' | 'driver';
  questionKey: string;
  answerKey: string;
}

export default function HelpScreen() {
  const { t, isRTL } = useTranslation();
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'general' | 'booking' | 'driver'
  >('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const faqData = useMemo<FAQItem[]>(
    () => [
      {
        id: '1',
        category: 'general',
        questionKey: 'how_to_book_title',
        answerKey: 'how_to_book_answer',
      },
      {
        id: '2',
        category: 'general',
        questionKey: 'how_to_pay_title',
        answerKey: 'how_to_pay_answer',
      },
      {
        id: '3',
        category: 'booking',
        questionKey: 'cancel_sub_info_title',
        answerKey: 'cancel_sub_info_answer',
      },
      {
        id: '4',
        category: 'booking',
        questionKey: 'sos_usage_title',
        answerKey: 'sos_usage_answer',
      },
      {
        id: '5',
        category: 'driver',
        questionKey: 'driver_payout_title',
        answerKey: 'driver_payout_answer',
      },
    ],
    [],
  );

  const categories: { key: 'all' | 'general' | 'booking' | 'driver'; label: string }[] = useMemo(
    () => [
      { key: 'all', label: t('all') },
      { key: 'general', label: t('faq_general') },
      { key: 'booking', label: t('faq_booking') },
      { key: 'driver', label: t('faq_driver') },
    ],
    [t],
  );

  const toggleExpand = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredFaqs = useMemo(() => {
    return faqData.filter((item) => {
      const question = t(item.questionKey).toLowerCase();
      const answer = t(item.answerKey).toLowerCase();
      const matchesSearch =
        question.includes(searchQuery.toLowerCase()) || answer.includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [faqData, searchQuery, selectedCategory, t]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: top + Spacing.md },
          isRTL && { flexDirection: 'row-reverse' },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('help_center')}</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBox, isRTL && { flexDirection: 'row-reverse' }]}>
          <Ionicons
            name="search-outline"
            size={20}
            color={Colors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={t('search_placeholder')}
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={(text) => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setSearchQuery(text);
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSearchQuery('');
              }}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories Horizontal Scroll */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.categoriesScroll,
            isRTL && { flexDirection: 'row-reverse' },
          ]}
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                style={[styles.categoryTab, isActive && styles.categoryTabActive]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                  setSelectedCategory(cat.key);
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.categoryTabText, isActive && styles.categoryTabTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* FAQs List */}
      <ScrollView
        style={styles.faqList}
        contentContainerStyle={{ padding: Spacing.lg, paddingBottom: bottom + Spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        {filteredFaqs.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="help-circle-outline" size={64} color={Colors.border} />
            <Text style={styles.emptyStateText}>{t('no_matching_questions')}</Text>
          </View>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <View key={faq.id} style={[styles.faqCard, isExpanded && styles.faqCardExpanded]}>
                <TouchableOpacity
                  style={[styles.faqQuestionRow, isRTL && { flexDirection: 'row-reverse' }]}
                  onPress={() => toggleExpand(faq.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.faqQuestion, { textAlign: isRTL ? 'right' : 'left' }]}>
                    {t(faq.questionKey)}
                  </Text>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={isExpanded ? Colors.primary : Colors.textMuted}
                  />
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.faqAnswerContainer}>
                    <Text style={[styles.faqAnswer, { textAlign: isRTL ? 'right' : 'left' }]}>
                      {t(faq.answerKey)}
                    </Text>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: '#EFECE9',
    borderBottomWidth: 1,
    borderBottomColor: '#E6E2DE',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...Shadow.sm,
    zIndex: 10,
  },
  backButton: {
    padding: Spacing.xs,
    width: 40,
    zIndex: 11,
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.text,
    zIndex: 1,
  },
  searchContainer: {
    padding: Spacing.lg,
    backgroundColor: Colors.white,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginHorizontal: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.text,
    paddingVertical: 0,
  },
  clearButton: {
    padding: Spacing.xs,
  },
  categoriesContainer: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: Spacing.md,
  },
  categoriesScroll: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  categoryTab: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm - 2,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  categoryTabActive: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.primary,
  },
  categoryTabText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  categoryTabTextActive: {
    color: Colors.primary,
    fontFamily: FontFamily.bold,
  },
  faqList: {
    flex: 1,
  },
  faqCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  faqCardExpanded: {
    borderColor: Colors.primaryLight,
    ...Shadow.md,
  },
  faqQuestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  faqQuestion: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.text,
    flex: 1,
    marginHorizontal: Spacing.md,
  },
  faqAnswerContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceMuted,
  },
  faqAnswer: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginTop: Spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
    gap: Spacing.md,
  },
  emptyStateText: {
    fontFamily: FontFamily.medium,
    fontSize: 15,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
