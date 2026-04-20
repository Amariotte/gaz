import { meta } from "./other.type";

export type client = {
  id: string;
  nom: string;
  code: string;
  email: string;
  tel: string;
  adresse: string;
  statut: string;
};

export type listClients = {
  meta?: meta;
  data: client[];
};
