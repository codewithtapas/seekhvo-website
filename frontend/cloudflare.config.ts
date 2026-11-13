import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "seekhvo-frontend",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-11-13",
    compatibilityFlags: ["nodejs_compat"],
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ASSETS: bindings.assets(),
      NEXT_PUBLIC_SITE_URL: bindings.text("https://seekhvo.space"),
      NEXT_PUBLIC_API_URL: bindings.text("https://api.seekhvo.space/api/v1"),
      NEXT_PUBLIC_WHATSAPP_NUMBER: bindings.text("918280765204"),
    },
  }),
});
