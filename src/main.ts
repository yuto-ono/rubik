import App from "./App.svelte"
import "./globals.scss"

const el = document.getElementById("app")

if (el != null) {
  new App({ target: el })
}
