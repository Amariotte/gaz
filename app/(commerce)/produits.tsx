import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import AppHeaderDrawer from "@/components/app-header-drawer";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuthContext } from "@/hooks/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { usePaginatedCachedResource } from "@/hooks/use-paginated-cached-resource";
import { getfetchProduits } from "@/services/api-service";
import { PRODUITS_LIST_CACHE_KEY } from "@/services/cache-service";
import { formatNumber } from "@/tools/tools";
import { listProduits } from "@/types/produits.type";
import { useMemo, useState } from "react";

const PRODUCT_TABS = ["Produits", "Categories", "Unites"] as const;

export default function ProduitsScreen() {
  const scheme = useColorScheme() ?? "light";
  const isDark = scheme === "dark";
  const [activeTab, setActiveTab] =
    useState<(typeof PRODUCT_TABS)[number]>("Produits");

  const pageBackground = isDark ? "#11131A" : "#F7F7FB";
  const cardBackground = isDark ? "#1B1E28" : "#FFFFFF";
  const softBlock = isDark ? "#242735" : "#F2F3F8";
  const mutedText = isDark ? "#9EA3BA" : "#868A9F";

  const initialProduits = useMemo<listProduits>(
    () => ({
      meta: { page: 1, next: 1, totalPages: 1, total: 0, size: 0 },
      data: [],
    }),
    [],
  );

  const { userToken } = useAuthContext();
  const { data: produits } = usePaginatedCachedResource<
    listProduits["data"][number],
    listProduits
  >({
    cacheKey: PRODUITS_LIST_CACHE_KEY,
    initialData: initialProduits,
    enabled: Boolean(userToken),
    fetchPage: async (page, size) =>
      getfetchProduits(userToken ?? "", { page, size }),
    getItemKey: (item) => item.id,
    hasUsableCachedData: (cachedData) =>
      Boolean(
        cachedData &&
        Array.isArray(cachedData.data) &&
        cachedData.data.length > 0,
      ),
  });

  return (
    <ThemedView style={[styles.container, { backgroundColor: pageBackground }]}>
      <View style={styles.headerWrap}>
        <AppHeaderDrawer title="Products" />
      </View>

      <View style={styles.tabsRow}>
        {PRODUCT_TABS.map((tab) => {
          const isActive = tab === activeTab;

          return (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tabButton,
                {
                  backgroundColor: isActive
                    ? "#6B3CFF"
                    : isDark
                      ? "#262B3B"
                      : "#F6F6FA",
                  borderColor: isDark ? "#32384D" : "#E5E7F1",
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.tabText,
                  {
                    color: isActive
                      ? "#FFFFFF"
                      : isDark
                        ? "#C8CDE7"
                        : "#4F556D",
                  },
                ]}
              >
                {tab}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryLabelRow}>
          <ThemedText style={styles.summaryText}>Total Products</ThemedText>
          <View style={styles.countBadge}>
            <ThemedText style={styles.countBadgeText}>
              {produits?.data?.length ?? 0}
            </ThemedText>
          </View>
        </View>

        <View style={styles.summaryActions}>
          <Pressable style={styles.primaryAction}>
            <MaterialIcons name="add" size={18} color="#FFFFFF" />
          </Pressable>
          <Pressable
            style={[
              styles.secondaryAction,
              { backgroundColor: cardBackground },
            ]}
          >
            <MaterialIcons
              name="tune"
              size={17}
              color={isDark ? "#FFFFFF" : "#4A4F69"}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {produits?.data?.map((item, index) => {
          const oldPrice =
            item.prixVenteTTC + Math.round(item.prixVenteTTC * 0.08);
          const hasDiscount = index % 2 === 1;

          return (
            <View
              key={item.id}
              style={[
                styles.card,
                {
                  backgroundColor: cardBackground,
                  shadowColor: "#10131F",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: isDark ? 0.22 : 0.08,
                  shadowRadius: 18,
                  elevation: 3,
                },
              ]}
            >
              <View style={styles.cardTop}>
                <View style={styles.productRow}>
                  <View
                    style={[
                      styles.productIconWrap,
                      { backgroundColor: softBlock },
                    ]}
                  >
                    <MaterialIcons
                      name="propane-tank"
                      size={18}
                      color={isDark ? "#D8DCF7" : "#6D728B"}
                    />
                  </View>

                  <View style={styles.productInfo}>
                    <ThemedText style={styles.referenceText}>
                      #{item.reference}
                    </ThemedText>
                    <ThemedText
                      type="defaultSemiBold"
                      style={styles.productName}
                    >
                      {item.designation}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.cardActions}>
                  <Pressable
                    style={[
                      styles.smallIconButton,
                      { backgroundColor: softBlock },
                    ]}
                  >
                    <MaterialIcons
                      name="edit"
                      size={15}
                      color={isDark ? "#D8DCF7" : "#6D728B"}
                    />
                  </Pressable>
                  <Pressable
                    style={[
                      styles.smallIconButton,
                      { backgroundColor: softBlock },
                    ]}
                  >
                    <MaterialIcons
                      name="delete-outline"
                      size={15}
                      color={isDark ? "#D8DCF7" : "#6D728B"}
                    />
                  </Pressable>
                </View>
              </View>

              <View
                style={[
                  styles.metaStrip,
                  { borderTopColor: isDark ? "#34384A" : "#EAECF5" },
                ]}
              >
                <View style={styles.leftMetaRow}>
                  <View style={styles.familyPill}>
                    <ThemedText style={styles.familyText}>
                      {item.nomfamille}
                    </ThemedText>
                  </View>
                  <ThemedText style={[styles.alertText, { color: mutedText }]}>
                    Alert Quantity : 10
                  </ThemedText>
                </View>

                <View style={styles.priceRow}>
                  {hasDiscount ? (
                    <>
                      <ThemedText style={styles.oldPriceText}>
                        ${formatNumber(oldPrice)}
                      </ThemedText>
                      <ThemedText style={styles.currentPriceDanger}>
                        ${formatNumber(item.prixVenteTTC)}
                      </ThemedText>
                    </>
                  ) : (
                    <ThemedText
                      type="defaultSemiBold"
                      style={styles.currentPriceText}
                    >
                      ${formatNumber(item.prixVenteTTC)}
                    </ThemedText>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  headerWrap: {
    marginTop: -16,
    marginBottom: 10,
  },
  tabsRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  tabButton: {
    flex: 1,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "700",
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  summaryLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: "700",
  },
  countBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#87D66B",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  countBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  summaryActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  primaryAction: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6B3CFF",
  },
  secondaryAction: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  productIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  productInfo: {
    flex: 1,
  },
  referenceText: {
    color: "#8C74FF",
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 2,
  },
  productName: {
    fontSize: 16,
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  smallIconButton: {
    width: 28,
    height: 28,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  metaStrip: {
    paddingTop: 10,
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  familyPill: {
    backgroundColor: "#FFEAE4",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  familyText: {
    color: "#FF7B55",
    fontSize: 10,
    fontWeight: "700",
  },
  alertText: {
    fontSize: 12,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  oldPriceText: {
    fontSize: 12,
    color: "#FF5A3B",
    textDecorationLine: "line-through",
    fontWeight: "700",
  },
  currentPriceDanger: {
    fontSize: 14,
    color: "#1F2438",
    fontWeight: "700",
  },
  currentPriceText: {
    fontSize: 16,
  },
});
