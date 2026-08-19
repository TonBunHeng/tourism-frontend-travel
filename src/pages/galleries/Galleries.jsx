import React, { useState, useEffect } from 'react';
import { galleryService } from '../../services/galleryService';
import GalleriesHeader from './GalleriesHeader';
import GalleriesGrid from './GalleriesGrid';

export default function Galleries() {
  const [mediaList, setMediaList] = useState([]);
  const [mediaType, setMediaType] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const params = { per_page: 24 };
        if (mediaType !== 'All') params.media_type = mediaType.toLowerCase();

        const res = await galleryService.getGalleries(params);
        if (res?.data) {
          setMediaList(res.data);
        }
      } catch (err) {
        console.error('Failed to load gallery', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [mediaType]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <GalleriesHeader mediaType={mediaType} setMediaType={setMediaType} />
      <GalleriesGrid mediaList={mediaList} loading={loading} />
    </div>
  );
}
