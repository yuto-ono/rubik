import { writable } from "svelte/store"
import type { CubeManager } from "./rubik"

export const cubeManager = writable<CubeManager>()
export const playing = writable(false)
