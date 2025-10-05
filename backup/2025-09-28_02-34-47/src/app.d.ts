// src/app.d.ts
/// <reference types="@cloudflare/workers-types" />
declare global {
  namespace App {
    interface Platform {
      env: {
        DB: D1Database;
      };
    }
  }
}
export {};