import { writable } from "svelte/store"

export const popupEnabled = writable<undefined | "message" | "addpost" | "othermessage">(undefined)