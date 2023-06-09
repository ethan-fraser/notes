import PocketBase from "pocketbase";
import { writable } from "svelte/store";
import config from "./config.json";

export const pb = new PocketBase(config.development.pocketbase_address);

export const currentUser = writable(pb.authStore.model);

pb.authStore.onChange((_) => {
  currentUser.set(pb.authStore.model);
});
