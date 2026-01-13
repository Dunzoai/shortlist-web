'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { X, Upload, Trash2 } from 'lucide-react';

interface ImageItem {
  url: string;
  id: string;
  isExisting: boolean;
}

interface ImagePreview {
  file: File;
  preview: string;
  id: string;
}

export default function EditProperty() {
  const router = useRouter();
  const params = useParams();
  const propertyId = typeof params.id === 'string' ? params.id : params.id?.[0];

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [existingImages, setExistingImages] = useState<ImageItem[]>([]);
  const [newImages, setNewImages] = useState<ImagePreview[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [currentFeature, setCurrentFeature] = useState('');

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    zip: '',
    price: '',
    beds: '',
    baths: '',
    sqft: '',
    propertyType: '',
    yearBuilt: '',
    lotSize: '',
    mlsNumber: '',
    description: '',
    status: '',
  });

  useEffect(() => {
    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const fetchProperty = async () => {
    console.log('Fetching property with ID:', propertyId);

    if (!propertyId) {
      setError('No property ID provided');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('featured_properties')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (error) {
      console.error('Error fetching property:', error);
      setError(`Failed to load property: ${error.message}. ID: ${propertyId}`);
      setLoading(false);
      return;
    }

    if (data) {
      setFormData({
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        zip: data.zip || '',
        price: data.price?.toString() || '',
        beds: data.beds?.toString() || '',
        baths: data.baths?.toString() || '',
        sqft: data.sqft?.toString() || '',
        propertyType: data.property_type || 'Single Family',
        yearBuilt: data.year_built || '',
        lotSize: data.lot_size || '',
        mlsNumber: data.mls_number || '',
        description: data.description || '',
        status: data.status || 'active',
      });

      if (data.images && Array.isArray(data.images)) {
        setExistingImages(
          data.images.map((url: string) => ({
            url,
            id: Math.random().toString(36).substring(7),
            isExisting: true,
          }))
        );
      }

      if (data.features && Array.isArray(data.features)) {
        setFeatures(data.features);
      }
    }

    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const totalImages = existingImages.length + newImages.length;
      const files = Array.from(e.target.files).slice(0, 5 - totalImages);

      const images: ImagePreview[] = files.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        id: Math.random().toString(36).substring(7)
      }));

      setNewImages([...newImages, ...images]);
    }
  };

  const removeExistingImage = (id: string) => {
    setExistingImages(existingImages.filter(img => img.id !== id));
  };

  const removeNewImage = (id: string) => {
    setNewImages(newImages.filter(img => img.id !== id));
  };

  const moveExistingImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...existingImages];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setExistingImages(newImages);
  };

  const addFeature = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentFeature.trim()) {
      e.preventDefault();
      if (!features.includes(currentFeature.trim())) {
        setFeatures([...features, currentFeature.trim()]);
      }
      setCurrentFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setFeatures(features.filter(f => f !== feature));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Upload new images
      const newImageUrls: string[] = [];
      for (const img of newImages) {
        const fileExt = img.file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(fileName, img.file);

        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(fileName);

        newImageUrls.push(publicUrl);
      }

      // Combine existing and new image URLs
      const allImageUrls = [
        ...existingImages.map(img => img.url),
        ...newImageUrls
      ];

      // Update property
      const { error: updateError } = await supabase
        .from('featured_properties')
        .update({
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip || null,
          price: parseInt(formData.price),
          beds: formData.beds ? parseInt(formData.beds) : null,
          baths: formData.baths ? parseInt(formData.baths) : null,
          sqft: formData.sqft ? parseInt(formData.sqft) : null,
          property_type: formData.propertyType,
          year_built: formData.yearBuilt || null,
          lot_size: formData.lotSize || null,
          mls_number: formData.mlsNumber || null,
          description: formData.description || null,
          features: features,
          images: allImageUrls,
          status: formData.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', propertyId);

      if (updateError) {
        throw new Error(`Failed to update property: ${updateError.message}`);
      }

      router.push('/admin/properties');
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this property? This cannot be undone.')) {
      return;
    }

    setDeleting(true);

    const { error } = await supabase
      .from('featured_properties')
      .delete()
      .eq('id', propertyId);

    if (!error) {
      router.push('/admin/properties');
    } else {
      alert('Failed to delete property');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-[#1B365D] text-lg">Loading property...</div>
        </div>
      </div>
    );
  }

  const totalImages = existingImages.length + newImages.length;

  return (
    <div className="min-h-screen bg-[#FAF9F7] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#1B365D] mb-2">
              Edit Property
            </h1>
            <p className="text-[#3D3D3D]">Update property details below</p>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={20} />
            {deleting ? 'Deleting...' : 'Delete Property'}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1B365D] mb-4">
              Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[#3D3D3D] mb-2 font-medium">Address *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-[#D6BFAE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[#3D3D3D] mb-2 font-medium">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 border border-[#D6BFAE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
                  />
                </div>

                <div>
                  <label className="block text-[#3D3D3D] mb-2 font-medium">State *</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-2 border border-[#D6BFAE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
                  />
                </div>

                <div>
                  <label className="block text-[#3D3D3D] mb-2 font-medium">Zip</label>
                  <input
                    type="text"
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="w-full px-4 py-2 border border-[#D6BFAE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#3D3D3D] mb-2 font-medium">Price *</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-[#D6BFAE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#3D3D3D] mb-2 font-medium">Beds</label>
                  <input
                    type="number"
                    value={formData.beds}
                    onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                    className="w-full px-4 py-2 border border-[#D6BFAE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
                  />
                </div>

                <div>
                  <label className="block text-[#3D3D3D] mb-2 font-medium">Baths</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.baths}
                    onChange={(e) => setFormData({ ...formData, baths: e.target.value })}
                    className="w-full px-4 py-2 border border-[#D6BFAE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
                  />
                </div>

                <div>
                  <label className="block text-[#3D3D3D] mb-2 font-medium">Sqft</label>
                  <input
                    type="number"
                    value={formData.sqft}
                    onChange={(e) => setFormData({ ...formData, sqft: e.target.value })}
                    className="w-full px-4 py-2 border border-[#D6BFAE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#3D3D3D] mb-2 font-medium">Property Type</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    className="w-full px-4 py-2 border border-[#D6BFAE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
                  >
                    <option value="Single Family">Single Family</option>
                    <option value="Condo">Condo</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Land">Land</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#3D3D3D] mb-2 font-medium">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-[#D6BFAE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#3D3D3D] mb-2 font-medium">Year Built</label>
                  <input
                    type="text"
                    value={formData.yearBuilt}
                    onChange={(e) => setFormData({ ...formData, yearBuilt: e.target.value })}
                    className="w-full px-4 py-2 border border-[#D6BFAE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
                  />
                </div>

                <div>
                  <label className="block text-[#3D3D3D] mb-2 font-medium">Lot Size</label>
                  <input
                    type="text"
                    value={formData.lotSize}
                    onChange={(e) => setFormData({ ...formData, lotSize: e.target.value })}
                    className="w-full px-4 py-2 border border-[#D6BFAE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#3D3D3D] mb-2 font-medium">MLS #</label>
                <input
                  type="text"
                  value={formData.mlsNumber}
                  onChange={(e) => setFormData({ ...formData, mlsNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-[#D6BFAE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
                />
              </div>

              <div>
                <label className="block text-[#3D3D3D] mb-2 font-medium">Description</label>
                <textarea
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-[#D6BFAE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1B365D] mb-4">
              Features
            </h2>
            <p className="text-[#3D3D3D] text-sm mb-4">Type a feature and press Enter to add</p>

            <input
              type="text"
              value={currentFeature}
              onChange={(e) => setCurrentFeature(e.target.value)}
              onKeyDown={addFeature}
              className="w-full px-4 py-2 border border-[#D6BFAE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A25A] mb-4"
              placeholder="e.g., Ocean Views, Private Pool, Granite Countertops"
            />

            <div className="flex flex-wrap gap-2">
              {features.map((feature) => (
                <span
                  key={feature}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-[#C4A25A]/10 text-[#C4A25A] rounded-full"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(feature)}
                    className="hover:text-[#1B365D] transition-colors"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1B365D] mb-4">
              Images (Max 5)
            </h2>
            <p className="text-[#3D3D3D] text-sm mb-4">
              First image will be the hero image. Drag to reorder.
            </p>

            {totalImages < 5 && (
              <div className="mb-4">
                <label className="block">
                  <div className="border-2 border-dashed border-[#D6BFAE] rounded-lg p-8 text-center cursor-pointer hover:border-[#C4A25A] transition-colors">
                    <Upload className="mx-auto mb-2 text-[#C4A25A]" size={32} />
                    <span className="text-[#3D3D3D]">Click to upload more images</span>
                    <span className="block text-sm text-[#3D3D3D]/60 mt-1">
                      {totalImages} / 5 uploaded
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {(existingImages.length > 0 || newImages.length > 0) && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Existing Images */}
                {existingImages.map((img, index) => (
                  <div key={img.id} className="relative group">
                    <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={img.url}
                        alt={`Property ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-[#C4A25A] text-white text-xs px-2 py-1 rounded">
                          Hero
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeExistingImage(img.id)}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => moveExistingImage(index, index - 1)}
                          className="text-xs text-[#C4A25A] hover:text-[#1B365D]"
                        >
                          ← Move Left
                        </button>
                      )}
                      {index < existingImages.length - 1 && (
                        <button
                          type="button"
                          onClick={() => moveExistingImage(index, index + 1)}
                          className="text-xs text-[#C4A25A] hover:text-[#1B365D]"
                        >
                          Move Right →
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* New Images */}
                {newImages.map((img, index) => (
                  <div key={img.id} className="relative group">
                    <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={img.preview}
                        alt={`New ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        New
                      </div>
                      <button
                        type="button"
                        onClick={() => removeNewImage(img.id)}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#1B365D] text-white py-3 rounded-full hover:bg-[#C4A25A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {saving ? 'Saving...' : 'Update Property'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-3 border-2 border-[#D6BFAE] text-[#3D3D3D] rounded-full hover:border-[#C4A25A] hover:text-[#C4A25A] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
