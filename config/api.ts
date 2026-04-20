const resolvedBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

const apiConfig = {
  baseURL: resolvedBaseUrl ? resolvedBaseUrl : undefined,
  endpoints: {
    login: "/auth/login",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
    currentUser: "/auth/me",
    profilePhoto: "/auth/photos",
    soldes: "/soldes",
    mouvements: "/mouvements",
    changePassword: "/auth/update-password",
    ventes: "/ventes",
    stats: "/stats",
    produits: "/produits",
    reglementsClients: "/reglements-clients",
    reglementsFournisseurs: "/reglements-fournisseurs",
    commissions: "/commissions",
    operations: "/operations",
    fournisseurs: "/fournisseurs",
    devis: "/devis",
    bonLivraisons: "/bon-livraisons",
    clients: "/clients",
    statistiques: "/statistiques",
  },
};

export function getApiUrl(endpoint: string): string {
  if (!apiConfig.baseURL) {
    throw new Error(
      "EXPO_PUBLIC_API_BASE_URL is missing. Set it before creating a production build.",
    );
  }

  return `${apiConfig.baseURL}${endpoint}`;
}

export default apiConfig;
