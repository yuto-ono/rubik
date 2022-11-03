import App from "./App.svelte"

const el = document.getElementById("app")

if (el != null) {
  new App({ target: el })
}
