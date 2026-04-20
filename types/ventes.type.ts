import { meta } from "./other.type";

export type venteStatus = "Soldée" | "Non soldée" | "Echue";

export const statusVenteColorMap: Record<venteStatus, string> = {
  Soldée: "#16a34a",
  "Non soldée": "#f59e0b",
  Echue: "#dc2626",
};

export type vente = {
  id: string;
  codeVente: string;
  descVente: string;
  nomSite?: string;
  nomClient: string;
  phoneClient?: string;
  emailClient?: string;
  nomUser?: string;
  dateVente: Date;
  dateEchVente?: Date;
  dateLivSouhaite?: Date;
  lieuLivSouhaite?: string;
  soldeVente: number;
  nbProduits: number;
  totalHT: number;
  totalTaxe: number;
  totalNetPayer: number;
  totalBrutHT: number;
  totalBrutTTC: number;
  totalRemCialeHT: number;
  totalRemCialeTTC: number;
  status: venteStatus;
  details?: detailsVente[];
};

export type detailsVente = {
  id: string;
  qteLivree: number;
  prixVenteTTC: number;
  prixVenteHT: number;
  qteVendue: number;
  txTaxe: number;
  txRemise: number;
  remisePrix: number;
  montantRemiseHT: number;
  montantRemiseTTC: number;
  montantTTC: number;
  montantHT: number;
  montantBrutHT: number;
  montantBrutTTC: number;
  montantTaxe: number;
  qteGratuite: number;
  reference: string;
  descPackage: string;
  designation: string;
};

export type listVentes = {
  meta?: meta;
  data: vente[];
};
