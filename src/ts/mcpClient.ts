import { createTransport } from "@smithery/sdk/transport.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";

export async function initMcpClient() {
  // 환경 변수 로깅
  console.log('MCP Client Configuration:', {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    region: process.env.SUPABASE_REGION,
    projectRef: process.env.SUPABASE_PROJECT_REF,
  });
  
  const transport = createTransport(
    "https://server.smithery.ai/@alexander-zuev/supabase-mcp-server",
    {
      queryApiKey: process.env.QUERY_API_KEY!,
      supabaseRegion: process.env.SUPABASE_REGION || "us-east-1",
      supabaseDbPassword: process.env.SUPABASE_DB_PASSWORD!,
      supabaseProjectRef: process.env.SUPABASE_PROJECT_REF!,
      supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    process.env.QUERY_API_KEY!
  );

  const client = new Client({
    name: "BookShelf Client",
    version: "1.0.0",
  });

  await client.connect(transport);
  return client;
}