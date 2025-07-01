import React from 'react';

export default function MediaCard({ media, onDelete }) {
  const baseUrl = 'http://192.168.1.85:2283';
  const apiKey = 'CQmGpNEMygPJjnzUIFqhsxPYbqjPQPaQwBmxS3WQc';

  const isVideo = media.type === 'VIDEO';

  const thumbnailUrl = isVideo
    ? '/video-placeholder.png'
    : `${baseUrl}/api/asset/${media.id}/thumbnail?apiKey=${apiKey}`;

  const immichUrl = `${baseUrl}/photos/${media.id}`;

  return (
    <div
      style={{
        width: '300px',
        background: '#1a1a1a',
        padding: '1rem',
        borderRadius: '8px',
        textAlign: 'left',
        overflowWrap: 'break-word',
        color: '#fff',
      }}
    >
      <img
        src={thumbnailUrl}
        alt="Thumbnail"
        style={{
          width: '100%',
          height: '200px',
          objectFit: 'cover',
          borderRadius: '6px',
          marginBottom: '0.5rem',
        }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/video-placeholder.png';
        }}
      />

      <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
        {media.name}
      </div>

      <div style={{ fontSize: '0.85rem', marginBottom: '0.2rem' }}>
        ?? {(media.size / 1024 / 1024).toFixed(2)} MB
      </div>

      <div style={{ fontSize: '0.8rem', color: '#bbbbbb', marginBottom: '0.5rem' }}>
        ?? {new Date(media.created_at).toLocaleString()}
      </div>

      <div style={{ fontSize: '0.8rem', color: '#64b5f6', marginBottom: '0.5rem' }}>
        ??{' '}
        <a
          href={immichUrl}
          target="_blank"
          rel="noreferrer"
          style={{ color: '#64b5f6' }}
        >
          Open in Immich
        </a>
      </div>

      <button
        onClick={() => onDelete(media)}
        style={{
          background: '#e53935',
          color: '#fff',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer',
          width: '100%',
        }}
      >
        ??️ Delete
      </button>
    </div>
  );
}
