import { meta } from "./other.type";

export type Produit = {
  id: string;
  reference: string;
  designation: string;
  nomfamille: string;
  nomfournisseur?: string;
  prixVenteTTC: number;
  stock?: number;
  stockMini?: number;
  stockMaxi?: number;
  txTva?: number;
  prixVenteHT?: number;
  produitsSite?: produitSite[];
};

export type produitSite = {
  id: string;
  nomSite: string;
  stock?: number;
  stockMini?: number;
  stockMaxi?: number;
  prixVenteTTC: number;
  prixVenteHT: number;
  prixAchatHT: number;
  txTva: number;
};

export type listProduits = {
  meta?: meta;
  data: Produit[];
};
