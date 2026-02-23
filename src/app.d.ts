// src/app.d.ts
/// <reference types="@cloudflare/workers-types" />
declare global {
  namespace App {
    interface Locals {
      user?: { id: string; name?: string; role?: string } | null;
      authenticated?: boolean;
    }
    interface Platform {
      env: {
        DB: D1Database;
        SUNO_SUBSCRIPTION_SOURCE_URL?: string;
        SUNO_SUBSCRIPTION_SOURCE_API_KEY?: string;
        SUNO_SUBSCRIPTION_SOURCE_BEARER_TOKEN?: string;
        [key: string]: unknown;
      };
    }
  }
}
export {};