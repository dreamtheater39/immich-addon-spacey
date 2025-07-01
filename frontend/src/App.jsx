import React, { useEffect, useState } from 'react';
import { fetchLargeMedia, deleteMedia } from './api/media';

const IMMICH_URL = window.RUNTIME_CONFIG?.VITE_IMMICH_PUBLIC_URL;

export default function App() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState('size');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 20;

  const columnMapping = {
    Filename: 'name',
    'Size (MB)': 'size',
    Type: 'type',
    'Captured Date': 'created_at',
  };

  const loadMedia = async (reset = false, pageNum = 0) => {
    setLoading(true);
    try {
      const data = await fetchLargeMedia(PAGE_SIZE, sortField, pageNum * PAGE_SIZE);
      if (reset) {
        setMedia(data);
      } else {
        setMedia((prev) => [...prev, ...data]);
      }
      setHasMore(data.length === PAGE_SIZE);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
    loadMedia(true, 0);
  }, [sortField]);

  const handleDelete = async (item) => {
    try {
      await deleteMedia(item.id);
      setMedia((prev) => prev.filter((m) => m.id !== item.id));
    } catch (err) {
      alert(`Error deleting item: ${err.message}`);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadMedia(false, nextPage);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ color: '#1a1a1a' }}>📊 Immich Cleanup Tool</h1>
      {loading && media.length === 0 ? (
        <p style={{ color: '#1a1a1a' }}>Loading...</p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffffff' }}>
            <thead>
              <tr>
                {['Filename', 'Size (MB)', 'Type', 'Captured Date', 'Actions'].map((header) => (
                  <th
                    key={header}
                    style={{
                      textAlign: 'left',
                      borderBottom: '1px solid #555',
                      padding: '0.5rem',
                      cursor: header !== 'Actions' ? 'pointer' : 'default',
                      backgroundColor: '#e0e0e0',
                      color: '#000',
                    }}
                    onClick={() => {
                      if (header !== 'Actions') setSortField(columnMapping[header]);
                    }}
                  >
                    {header} {header !== 'Actions' ? '⬍' : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {media.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #ccc', backgroundColor: '#f9f9f9' }}>
                  <td style={{ padding: '0.5rem', color: '#000' }}>
                    <a
                      href={`${IMMICH_URL}/photos/${item.id}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#1976d2', textDecoration: 'none' }}
                    >
                      {item.name}
                    </a>
                  </td>
                  <td style={{ padding: '0.5rem', color: '#000' }}>
                    {(item.size / 1024 / 1024).toFixed(2)}
                  </td>
                  <td style={{ padding: '0.5rem', color: '#000' }}>{item.type}</td>
                  <td style={{ padding: '0.5rem', color: '#000' }}>
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <button
                      onClick={() => handleDelete(item)}
                      style={{
                        background: '#e53935',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.3rem 0.6rem',
                        cursor: 'pointer',
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {hasMore && (
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <button
                onClick={handleLoadMore}
                disabled={loading}
                style={{
                  background: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.6rem 1.2rem',
                  fontSize: '1rem',
                  cursor: 'pointer',
                }}
              >
                {loading ? 'Loading...' : '⬇️ Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
