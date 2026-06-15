import PocketBase from "pocketbase";
import { getPocketBaseUrl } from "./url";

let client: PocketBase | null = null;

export function getClientPB() {
  if (!client) {
    client = new PocketBase(getPocketBaseUrl());
  }
  return client;
}
