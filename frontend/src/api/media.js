export async function fetchLargeMedia(limit = 100, sort = 'size', offset = 0) {
  const BASE_URL = window.RUNTIME_CONFIG?.VITE_BACKEND_URL;
  const API_KEY = window.RUNTIME_CONFIG?.VITE_API_KEY;
  if (!BASE_URL || !API_KEY) {
    throw new Error("❌ Missing runtime config values. Check env.js loading.");
  }

  const res = await fetch(
    `${BASE_URL}/media/large?limit=${limit}&sort=${sort}&offset=${offset}`,
    {
      headers: {
        'x-api-key': API_KEY,
      },
    }
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch media: ${res.statusText}`);
  }

  const data = await res.json();
  return data.map((item) => ({
    ...item,
    photoUrl: item.thumbnail_url || item.download_url || '',
  }));
}

export async function deleteMedia(assetId) {
  const BASE_URL = window.RUNTIME_CONFIG?.VITE_BACKEND_URL;
  const API_KEY = window.RUNTIME_CONFIG?.VITE_API_KEY;
  if (!BASE_URL || !API_KEY) {
    throw new Error("❌ Missing runtime config values. Check env.js loading.");
  }

  const res = await fetch(`${BASE_URL}/media/${assetId}`, {
    method: 'DELETE',
    headers: {
      'x-api-key': API_KEY,
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to delete asset: ${res.status} - ${errText}`);
  }

  return res.json();
}
