import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import AppHeaderDrawer from "@/components/app-header-drawer";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";

type Proforma = {
  id: string;
  code: string;
  client: string;
  date: string;
  montant: string;
  statut: "Brouillon" | "Envoye";
};

const PROFORMAS: Proforma[] = [
  {
    id: "p1",
    code: "PF-2026-001",
    client: "Hotel Saphir",
    date: "20/04/2026",
    montant: "120 000",
    statut: "Brouillon",
  },
  {
    id: "p2",
    code: "PF-2026-002",
    client: "Restaurant Lagon",
    date: "19/04/2026",
    montant: "78 500",
    statut: "Envoye",
  },
];

export default function ProformasScreen() {
  const scheme = useColorScheme() ?? "light";
  const isDark = scheme === "dark";

  const pageBackground = isDark ? "#11131A" : "#F7F7FB";
  const cardBackground = isDark ? "#1B1E28" : "#FFFFFF";
  const softBlock = isDark ? "#242735" : "#F2F3F8";
  const mutedText = isDark ? "#9EA3BA" : "#868A9F";

  return (
    <ThemedView style={[styles.container, { backgroundColor: pageBackground }]}>
      <View style={styles.headerWrap}>
        <AppHeaderDrawer title="Proformas" />
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryLabelRow}>
          <ThemedText style={styles.summaryText}>Total proformas</ThemedText>
          <View style={styles.countBadge}>
            <ThemedText style={styles.countBadgeText}>
              {PROFORMAS.length}
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
              size={18}
              color={isDark ? "#FFFFFF" : "#4A4F69"}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {PROFORMAS.map((item) => {
          const isDraft = item.statut === "Brouillon";

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
                <View>
                  <ThemedText type="defaultSemiBold" style={styles.companyName}>
                    {item.client}
                  </ThemedText>
                  <ThemedText
                    style={[styles.companyMeta, { color: mutedText }]}
                  >
                    {item.code}
                  </ThemedText>
                </View>

                <View
                  style={[
                    styles.statusPill,
                    {
                      backgroundColor: isDraft ? "#F2B84B" : "#41B762",
                    },
                  ]}
                >
                  <ThemedText style={styles.statusText}>
                    {item.statut}
                  </ThemedText>
                </View>
              </View>

              <View style={[styles.metaStrip, { backgroundColor: softBlock }]}>
                <View style={styles.metaItem}>
                  <ThemedText style={[styles.metaLabel, { color: mutedText }]}>
                    Date
                  </ThemedText>
                  <ThemedText type="defaultSemiBold" style={styles.metaValue}>
                    {item.date}
                  </ThemedText>
                </View>
                <View style={styles.metaItem}>
                  <ThemedText style={[styles.metaLabel, { color: mutedText }]}>
                    Montant
                  </ThemedText>
                  <ThemedText type="defaultSemiBold" style={styles.metaValue}>
                    {item.montant} FCFA
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
  },
  headerWrap: {
    marginTop: -16,
    marginBottom: 10,
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
    padding: 12,
    gap: 10,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  companyName: {
    fontSize: 16,
  },
  companyMeta: {
    fontSize: 12,
    marginTop: 1,
  },
  statusPill: {
    minWidth: 78,
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
  metaStrip: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaItem: {
    minWidth: 120,
  },
  metaLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 13,
    lineHeight: 17,
  },
});
