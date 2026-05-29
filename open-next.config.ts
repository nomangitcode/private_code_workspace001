import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";
import kv from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import do from "@opennextjs/cloudflare/overrides/do/durable-objects-do";

export default defineCloudflareConfig({
  // 允许使用不受官方支持的 Next.js 版本（如 14.x）
  dangerouslyUseUnsupportedNextVersion: true,
  incrementalCache: kv,
  override: {
    wrapper: do,
  },
});
