export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
    if (url.pathname === '/data') {
      if (request.method === 'GET') {
        const data = await env.APP_STORE.get('appData');
        if (data) return new Response(data, { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        const empty = JSON.stringify({ subjects: [], history: [] });
        await env.APP_STORE.put('appData', empty);
        return new Response(empty, { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      if (request.method === 'POST') {
        try {
          const newData = await request.json();
          await env.APP_STORE.put('appData', JSON.stringify(newData));
          return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        } catch (e) {
          return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
      }
    }
    return new Response('Not found', { status: 404, headers: corsHeaders });
  },
};