import { meta } from "./other.type";

export type fournisseur = {
  id: string;
  nom: string;
  code?: string;
  email: string;
  tel: string;
  adresse: string;
  statut: string;
};

export type listFournisseurs = {
  meta?: meta;
  data: fournisseur[];
};
