import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import AppHeaderDrawer from "@/components/app-header-drawer";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";

type Supplier = {
  id: string;
  name: string;
  deliveries: number;
  balance: string;
  status: "Active" | "Inactive";
  initials: string;
};

const SUPPLIERS: Supplier[] = [
  {
    id: "s1",
    name: "Sahara Gaz",
    deliveries: 12,
    balance: "$1,287",
    status: "Active",
    initials: "SG",
  },
  {
    id: "s2",
    name: "Petro Hub",
    deliveries: 9,
    balance: "$964",
    status: "Active",
    initials: "PH",
  },
  {
    id: "s3",
    name: "Delta Energy",
    deliveries: 5,
    balance: "$408",
    status: "Inactive",
    initials: "DE",
  },
  {
    id: "s4",
    name: "Global Fuel",
    deliveries: 7,
    balance: "$733",
    status: "Active",
    initials: "GF",
  },
];

export default function FournisseursScreen() {
  const scheme = useColorScheme() ?? "light";
  const isDark = scheme === "dark";

  const pageBackground = isDark ? "#11131A" : "#F4F4F7";
  const cardBackground = isDark ? "#1B1E28" : "#FFFFFF";
  const softBlock = isDark ? "#242735" : "#F2F3F8";
  const mutedText = isDark ? "#A8AEC7" : "#8B90A5";

  return (
    <ThemedView style={[styles.container, { backgroundColor: pageBackground }]}>
      <View style={styles.headerWrap}>
        <AppHeaderDrawer title="Fournisseurs" />
      </View>

      <View style={[styles.searchBar, { backgroundColor: cardBackground }]}>
        <ThemedText style={[styles.searchPlaceholder, { color: mutedText }]}>
          Rechercher un fournisseur
        </ThemedText>
        <MaterialIcons name="search" size={18} color={mutedText} />
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.totalRow}>
          <ThemedText style={styles.totalLabel}>Total fournisseurs</ThemedText>
          <View style={styles.countBadge}>
            <ThemedText style={styles.countText}>{SUPPLIERS.length}</ThemedText>
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
              color={isDark ? "#FFFFFF" : "#69708A"}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {SUPPLIERS.map((item) => {
          const isActive = item.status === "Active";

          return (
            <View
              key={item.id}
              style={[
                styles.card,
                {
                  backgroundColor: cardBackground,
                  shadowColor: "#10131F",
                  shadowOffset: { width: 0, height: 7 },
                  shadowOpacity: isDark ? 0.24 : 0.08,
                  shadowRadius: 16,
                  elevation: 3,
                },
              ]}
            >
              <View style={styles.cardTop}>
                <View style={styles.companyRow}>
                  <View style={[styles.logo, { borderColor: "#E6E8F1" }]}>
                    <ThemedText style={styles.logoText}>
                      {item.initials}
                    </ThemedText>
                  </View>
                  <View>
                    <ThemedText
                      type="defaultSemiBold"
                      style={styles.companyName}
                    >
                      {item.name}
                    </ThemedText>
                    <ThemedText
                      style={[styles.companyMeta, { color: mutedText }]}
                    >
                      Livraisons : {item.deliveries}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.cardActions}>
                  <Pressable
                    style={[styles.actionIcon, { backgroundColor: softBlock }]}
                  >
                    <MaterialIcons
                      name="visibility"
                      size={15}
                      color={isDark ? "#DCE0F8" : "#707792"}
                    />
                  </Pressable>
                  <Pressable
                    style={[styles.actionIcon, { backgroundColor: softBlock }]}
                  >
                    <MaterialIcons
                      name="edit"
                      size={15}
                      color={isDark ? "#DCE0F8" : "#707792"}
                    />
                  </Pressable>
                  <Pressable
                    style={[styles.actionIcon, { backgroundColor: softBlock }]}
                  >
                    <MaterialIcons
                      name="delete-outline"
                      size={15}
                      color={isDark ? "#DCE0F8" : "#707792"}
                    />
                  </Pressable>
                </View>
              </View>

              <View style={styles.cardBottom}>
                <View
                  style={[styles.balancePill, { backgroundColor: "#FFECE8" }]}
                >
                  <ThemedText style={styles.balanceText}>
                    Balance : {item.balance}
                  </ThemedText>
                </View>

                <View style={styles.invoiceAction}>
                  <MaterialIcons
                    name="local-shipping"
                    size={14}
                    color="#2E334A"
                  />
                  <ThemedText style={styles.invoiceActionText}>
                    Nouvelle reception
                  </ThemedText>
                </View>

                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: isActive ? "#4CBF1F" : "#E8382D" },
                  ]}
                >
                  <ThemedText style={styles.statusText}>
                    {item.status}
                  </ThemedText>
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
    paddingHorizontal: 12,
  },
  headerWrap: {
    marginTop: -16,
    marginHorizontal: -12,
    marginBottom: 14,
  },
  searchBar: {
    height: 42,
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  searchPlaceholder: {
    fontSize: 13,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  countBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#50C52A",
  },
  countText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  summaryActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    borderRadius: 14,
    padding: 12,
    gap: 10,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  companyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  logoText: {
    fontSize: 14,
    fontWeight: "700",
  },
  companyName: {
    fontSize: 16,
  },
  companyMeta: {
    fontSize: 12,
    marginTop: 1,
  },
  cardActions: {
    flexDirection: "row",
    gap: 6,
  },
  actionIcon: {
    width: 28,
    height: 28,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  balancePill: {
    height: 24,
    borderRadius: 7,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  balanceText: {
    fontSize: 12,
    color: "#FF5A3B",
    fontWeight: "700",
  },
  invoiceAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  invoiceActionText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusPill: {
    minWidth: 68,
    height: 24,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});
