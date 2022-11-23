import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  plugins: [
    svelte(),
    VitePWA({
      manifest: {
        name: "ルービックキューブ by Yuto",
        short_name: "ルービックキューブ",
        description:
          "Web上でルービックキューブを遊べるサイトです。キューブの外側を動かすとキューブ全体が動きます。キューブ本体をスワイプすると回転します。",
        theme_color: "#ffffff",
        icons: [
          {
            src: "icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        start_url: "./",
      },
    }),
  ],
})
