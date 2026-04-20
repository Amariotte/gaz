import apiConfig from "@/config/api";
import {
  clientsFakeData,
  dataChartsFakeData,
  fournisseursFakeData,
  mouvementsFakeData,
  operationsFakeData,
  produitsFakeData,
  proformasFakeData,
  reglementsFakeData,
  soldeFake,
  statsFake,
  ventesFakeData,
} from "@/data/datas.fake";
import { isModeDemoEnabled } from "@/tools/tools";
import { listClients } from "@/types/client.type";
import {
  deleteDevisLigneEdit,
  devis,
  devisLigneEdit,
  listDevis,
} from "@/types/devis.type";
import { fournisseur, listFournisseurs } from "@/types/fournisseur.type";
import { listMouvements } from "@/types/mouvements.type";
import { listOperations, operation } from "@/types/operations.type";
import {
  dataChart,
  meta,
  PaginatedResponse,
  PaginationParams,
  stat,
} from "@/types/other.type";
import { listProduits } from "@/types/produits.type";
import { listReglements, reglement } from "@/types/reglements.type";
import { SoldeResponse } from "@/types/solde.type";
import { listVentes, vente } from "@/types/ventes.type";
import { getJsonAuth, postJsonAuth } from "./api-client";

const LIMIT_RECENT_TRANSACTIONS = process.env
  .EXPO_PUBLIC_NBRE_RECENT_TRANSACTIONS
  ? Number(process.env.EXPO_PUBLIC_NBRE_RECENT_TRANSACTIONS)
  : 20;
const DEFAULT_PAGE_SIZE = 20;

function normalizePaginationParams(
  params?: PaginationParams,
): Required<PaginationParams> {
  const page = Number.isFinite(params?.page)
    ? Math.max(1, Math.floor(params?.page ?? 1))
    : 1;
  const size = Number.isFinite(params?.size)
    ? Math.max(1, Math.floor(params?.size ?? DEFAULT_PAGE_SIZE))
    : DEFAULT_PAGE_SIZE;

  return { page, size };
}

function buildPaginationMeta(total: number, params?: PaginationParams): meta {
  const normalized = normalizePaginationParams(params);
  const totalPages = Math.max(1, Math.ceil(total / normalized.size));
  const page = Math.min(normalized.page, totalPages);

  return {
    page,
    next: page < totalPages ? page + 1 : page,
    totalPages,
    total,
    size: normalized.size,
  };
}

function buildPaginatedEndpoint(
  endpoint: string,
  params?: PaginationParams,
): string {
  const normalized = normalizePaginationParams(params);
  const separator = endpoint.includes("?") ? "&" : "?";

  return `${endpoint}${separator}page=${normalized.page}&size=${normalized.size}`;
}

function paginateFakeResponse<
  TItem,
  TResponse extends PaginatedResponse<TItem>,
>(source: TResponse, params?: PaginationParams): TResponse {
  const paginationMeta = buildPaginationMeta(source.data.length, params);
  const startIndex = (paginationMeta.page - 1) * paginationMeta.size;

  return {
    ...source,
    meta: paginationMeta,
    data: source.data.slice(startIndex, startIndex + paginationMeta.size),
  } as TResponse;
}

async function fetchPaginatedList<
  TItem,
  TResponse extends PaginatedResponse<TItem>,
>(
  token: string,
  endpoint: string,
  params: PaginationParams | undefined,
  fakeData: TResponse,
): Promise<TResponse> {
  if (!params) {
    if (isModeDemoEnabled()) {
      return fakeData;
    }

    const firstPage = await getJsonAuth<TResponse>(
      buildPaginatedEndpoint(endpoint, { page: 1, size: DEFAULT_PAGE_SIZE }),
      token,
    );

    if (!firstPage?.meta) {
      return {
        ...firstPage,
        meta: buildPaginationMeta(firstPage?.data?.length ?? 0, params),
      } as TResponse;
    }

    const totalPages = Math.max(1, firstPage.meta.totalPages || 1);

    if (totalPages === 1) {
      return firstPage;
    }

    let mergedItems = Array.isArray(firstPage.data) ? [...firstPage.data] : [];

    for (let page = 2; page <= totalPages; page += 1) {
      const nextPage = await getJsonAuth<TResponse>(
        buildPaginatedEndpoint(endpoint, {
          page,
          size: firstPage.meta.size || DEFAULT_PAGE_SIZE,
        }),
        token,
      );

      if (Array.isArray(nextPage?.data) && nextPage.data.length > 0) {
        mergedItems = [...mergedItems, ...nextPage.data];
      }
    }

    return {
      ...firstPage,
      data: mergedItems,
      meta: buildPaginationMeta(mergedItems.length, {
        page: 1,
        size: mergedItems.length || 1,
      }),
    } as TResponse;
  }

  if (isModeDemoEnabled()) {
    return paginateFakeResponse(fakeData, params);
  }

  const response = await getJsonAuth<TResponse>(
    buildPaginatedEndpoint(endpoint, params),
    token,
  );

  if (response?.meta) {
    return response;
  }

  return {
    ...response,
    meta: buildPaginationMeta(response?.data?.length ?? 0, params),
  } as TResponse;
}

function parseSoldeValue(
  rawBalance: number | string | null | undefined,
): number {
  const parsedBalance = Number(rawBalance);

  if (Number.isNaN(parsedBalance)) {
    throw new Error("Format de solde invalide");
  }

  return parsedBalance;
}

export function getSoldeFromFakeData(): number {
  return parseSoldeValue(soldeFake.solde);
}

export async function fetchSoldeCompte(token: string): Promise<number> {
  if (isModeDemoEnabled()) {
    return getSoldeFromFakeData();
  }

  const payload = await getJsonAuth<SoldeResponse>(
    apiConfig.endpoints.soldes,
    token,
  );
  return parseSoldeValue(payload?.solde);
}

export async function getfetchProduits(
  token: string,
  params?: PaginationParams,
): Promise<listProduits> {
  const data = await fetchPaginatedList(
    token,
    `${apiConfig.endpoints.produits}`,
    params,
    produitsFakeData,
  );
  return data;
}

export async function getAllProduits(token: string): Promise<listProduits> {
  if (isModeDemoEnabled()) {
    return produitsFakeData;
  }

  const data = await getJsonAuth<listProduits>(
    `${apiConfig.endpoints.produits}`,
    token,
  );

  return data;
}

export async function getfetchClients(token: string): Promise<listClients> {
  if (isModeDemoEnabled()) {
    return clientsFakeData;
  }

  const data = await getJsonAuth<listClients>(
    `${apiConfig.endpoints.clients}`,
    token,
  );

  return data;
}

export async function getfetchFournisseurs(
  token: string,
): Promise<listFournisseurs> {
  if (isModeDemoEnabled()) {
    return fournisseursFakeData;
  }

  const data = await getJsonAuth<listFournisseurs>(
    `${apiConfig.endpoints.fournisseurs}`,
    token,
  );
  return data;
}

export async function getStats(token: string): Promise<stat> {
  if (isModeDemoEnabled()) {
    return statsFake;
  }

  const payload = await getJsonAuth<stat>(apiConfig.endpoints.stats, token);
  return payload;
}

export async function getfetchVentes(
  token: string,
  params?: PaginationParams,
): Promise<listVentes> {
  const d = await fetchPaginatedList(
    token,
    apiConfig.endpoints.ventes,
    params,
    ventesFakeData,
  );
  return d;
}

export async function getfetchDevis(token: string): Promise<listDevis> {
  if (isModeDemoEnabled()) {
    return proformasFakeData;
  }

  const data = await getJsonAuth<listDevis>(
    `${apiConfig.endpoints.devis}`,
    token,
  );

  return data;
}

export async function getfetchVenteById(
  token: string,
  id: string,
): Promise<vente | null> {
  if (isModeDemoEnabled()) {
    return ventesFakeData.data.filter((v) => v.id === id).length > 0
      ? ventesFakeData.data.filter((v) => v.id === id)[0]
      : null;
  }

  const d = await getJsonAuth<vente>(
    `${apiConfig.endpoints.ventes}/${id}`,
    token,
  );

  return d;
}

export async function getfetchOperationById(
  token: string,
  id: string,
): Promise<operation | null> {
  if (isModeDemoEnabled()) {
    return operationsFakeData.data.filter((operation) => operation.id === id)
      .length > 0
      ? operationsFakeData.data.filter((operation) => operation.id === id)[0]
      : null;
  }

  const d = await getJsonAuth<operation>(
    `${apiConfig.endpoints.operations}/${id}`,
    token,
  );

  return d;
}

export async function getfetchReglementById(
  token: string,
  id: string,
): Promise<reglement | null> {
  if (isModeDemoEnabled()) {
    return reglementsFakeData.data.filter((reglement) => reglement.id === id)
      .length > 0
      ? reglementsFakeData.data.filter((reglement) => reglement.id === id)[0]
      : null;
  }

  const d = await getJsonAuth<reglement>(
    `${apiConfig.endpoints.reglements}/${id}`,
    token,
  );

  return d;
}

export async function getfetchFournisseurById(
  token: string,
  id: string,
): Promise<fournisseur | null> {
  if (isModeDemoEnabled()) {
    return fournisseursFakeData.data.filter(
      (fournisseur) => fournisseur.id === id,
    ).length > 0
      ? fournisseursFakeData.data.filter(
          (fournisseur) => fournisseur.id === id,
        )[0]
      : null;
  }

  const d = await getJsonAuth<fournisseur>(
    `${apiConfig.endpoints.fournisseurs}/${id}`,
    token,
  );

  return d;
}

export async function getfetchDevisById(
  token: string,
  id: string,
): Promise<devis | null> {
  if (isModeDemoEnabled()) {
    return proformasFakeData.data.filter((devis) => devis.id === id).length > 0
      ? proformasFakeData.data.filter((devis) => devis.id === id)[0]
      : null;
  }

  const d = await getJsonAuth<devis>(
    `${apiConfig.endpoints.devis}/${id}`,
    token,
  );

  return d;
}

export async function postDevisLigne(
  token: string,
  ligne: devisLigneEdit,
  devisId?: string,
): Promise<devis | null> {
  if (isModeDemoEnabled()) {
    if (!devisId) {
      return null;
    }

    const found = proformasFakeData.data.find((devis) => devis.id === devisId);
    return found ?? null;
  }

  const endpoint = devisId
    ? `${apiConfig.endpoints.devis}/${devisId}`
    : `${apiConfig.endpoints.devis}`;

  const d = await postJsonAuth<devis, devisLigneEdit>(endpoint, token, ligne);
  return d;
}

export async function updateDevisLigne(
  token: string,
  devisId: string,
  ligneId: string,
  ligne: devisLigneEdit,
): Promise<devis | null> {
  if (isModeDemoEnabled()) {
    const found = proformasFakeData.data.find((devis) => devis.id === devisId);
    return found ?? null;
  }

  const d = await postJsonAuth<devis, devisLigneEdit>(
    `${apiConfig.endpoints.devis}/${devisId}/lignes/${ligneId}`,
    token,
    ligne,
  );

  return d;
}

export async function deleteDevisLigne(
  token: string,
  devisId: string,
  ligneId: string,
  ligne: deleteDevisLigneEdit,
): Promise<devis | null> {
  if (isModeDemoEnabled()) {
    const found = proformasFakeData.data.find((devis) => devis.id === devisId);
    return found ?? null;
  }

  const endpoint = `${apiConfig.endpoints.devis}/${devisId}/lignes/${ligneId}/delete`;
  const d = await postJsonAuth<devis, deleteDevisLigneEdit>(
    endpoint,
    token,
    ligne,
  );

  return d;
}

export async function deleteDevis(token: string, id: string): Promise<boolean> {
  if (isModeDemoEnabled()) {
    const initialLength = proformasFakeData.data.length;
    proformasFakeData.data = proformasFakeData.data.filter(
      (devis) => devis.id !== id,
    );
    return proformasFakeData.data.length < initialLength;
  }

  await getJsonAuth<null>(`${apiConfig.endpoints.devis}/${id}/delete`, token);
  return true;
}

export async function getfetchOperations(
  token: string,
): Promise<listOperations> {
  if (isModeDemoEnabled()) {
    return operationsFakeData;
  }

  const data = await getJsonAuth<listOperations>(
    `${apiConfig.endpoints.operations}`,
    token,
  );
  return data;
}

export async function getfetchReglements(
  token: string,
): Promise<listReglements> {
  if (isModeDemoEnabled()) {
    return reglementsFakeData;
  }

  const data = await getJsonAuth<listReglements>(
    `${apiConfig.endpoints.reglements}`,
    token,
  );
  return data;
}

export async function getfetchStatistiques(
  token: string,
): Promise<dataChart[]> {
  if (isModeDemoEnabled()) {
    return dataChartsFakeData;
  }

  const data = await getJsonAuth<dataChart[]>(
    `${apiConfig.endpoints.statistiques}`,
    token,
  );
  return data;
}

export async function getfetchRecentMouvements(
  token: string,
): Promise<listMouvements> {
  if (isModeDemoEnabled()) {
    return getRecentMouvementsFromFakeData();
  }

  const data = await getJsonAuth<listMouvements>(
    `${apiConfig.endpoints.mouvements}?size=${LIMIT_RECENT_TRANSACTIONS}`,
    token,
  );
  return data;
}

export function getRecentMouvementsFromFakeData(): listMouvements {
  return {
    ...mouvementsFakeData,
    data: mouvementsFakeData.data.slice(0, LIMIT_RECENT_TRANSACTIONS),
  };
}

export async function getfetchMouvements(
  token: string,
  params?: PaginationParams,
): Promise<listMouvements> {
  const data = await fetchPaginatedList(
    token,
    `${apiConfig.endpoints.mouvements}`,
    params,
    mouvementsFakeData,
  );
  return data;
}

export async function postValidateDevis(
  token: string,
  id: string,
): Promise<devis | null> {
  if (isModeDemoEnabled()) {
    const initialLength = proformasFakeData.data.length;
    proformasFakeData.data = proformasFakeData.data.filter(
      (devis) => devis.id !== id,
    );
    return proformasFakeData.data.length < initialLength
      ? (proformasFakeData.data.find((devis) => devis.id === id) ?? null)
      : null;
  }

  const d = await getJsonAuth<devis>(
    `${apiConfig.endpoints.devis}/${id}/validate`,
    token,
  );
  return d;
}

export async function postSaveDevis(
  token: string,
  id: string,
): Promise<devis | null> {
  if (isModeDemoEnabled()) {
    const initialLength = proformasFakeData.data.length;
    proformasFakeData.data = proformasFakeData.data.filter(
      (devis) => devis.id !== id,
    );
    return proformasFakeData.data.length < initialLength
      ? (proformasFakeData.data.find((devis) => devis.id === id) ?? null)
      : null;
  }

  const d = await getJsonAuth<devis>(
    `${apiConfig.endpoints.devis}/${id}/save`,
    token,
  );
  return d;
}
