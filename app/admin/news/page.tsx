'use client';

import { useState, useEffect, useRef } from 'react';
import { Edit, Trash2, Eye, EyeOff, Plus, Save, X, ImageIcon, Loader2 } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  imageUrl: string;
  published: boolean;
  createdAt: string;
}

export default function AdminNewsPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    summary: '',
    imageUrl: '',
    published: false,
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      setNewsList(data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return alert('Judul wajib diisi');

    const url = isEditing ? `/api/news/${editId}` : '/api/news';
    const method = isEditing ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert(isEditing ? 'Berita diperbarui!' : 'Berita dibuat!');
        resetForm();
        fetchNews();
      } else {
        alert('Gagal menyimpan.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus berita ini selamanya?')) return;

    try {
      const res = await fetch(`/api/news/${id}`, { method: 'DELETE' });
      if (res.ok) fetchNews();
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setIsUploading(true);

    try {
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });

      if (!response.ok) throw new Error('Upload gagal');

      const newBlob = await response.json();
      
      setFormData((prev) => ({ ...prev, imageUrl: newBlob.url }));
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Gagal mengupload gambar.');
    } finally {
      setIsUploading(false);
    }
  };

  const startEdit = (news: NewsItem) => {
    setIsEditing(true);
    setEditId(news.id);
    setFormData({
      title: news.title,
      slug: news.slug,
      content: news.content,
      summary: news.summary || '',
      imageUrl: news.imageUrl || '',
      published: news.published,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ title: '', slug: '', content: '', summary: '', imageUrl: '', published: false });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const togglePublish = async (news: NewsItem) => {
    try {
      const res = await fetch(`/api/news/${news.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !news.published }),
      });
      if (res.ok) fetchNews();
    } catch (error) {
      console.error(error);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    setFormData((prev) => ({ 
      ...prev, 
      title, 
      slug: isEditing ? prev.slug : slug 
    }));
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Berita</h1>
      </div>

      {/* --- CARD FORM INPUT --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b">
            {isEditing ? <Edit size={20} className="text-blue-600"/> : <Plus size={20} className="text-green-600"/>}
            <h2 className="text-lg font-semibold text-gray-700">
                {isEditing ? 'Edit Berita' : 'Tambah Berita Baru'}
            </h2>
        </div>
        
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Judul Berita..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
              <input
                type="text"
                value={formData.slug}
                readOnly
                className="w-full border rounded-lg p-2.5 bg-gray-200 text-gray-500 cursor-not-allowed"
                placeholder="terisi-otomatis"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ringkasan (Summary)</label>
                <input
                    type="text"
                    value={formData.summary}
                    onChange={(e) => setFormData({...formData, summary: e.target.value})}
                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ringkasan singkat..."
                />
             </div>
             
             {/* UPLOAD IMAGE SECTION */}
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Utama</label>
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg border border-dashed border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {formData.imageUrl ? (
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="text-gray-400" size={24} />
                    )}
                  </div>

                  <div className="flex-1">
                    <input 
                      type="file" 
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      disabled={isUploading}
                    />
                    {isUploading && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-blue-600">
                        <Loader2 className="animate-spin" size={12} /> Sedang mengupload...
                      </div>
                    )}
                    <input
                        type="text"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                        className="w-full border rounded-lg p-2 mt-2 text-xs text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Atau paste URL gambar di sini..."
                    />
                  </div>
                </div>
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Konten</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              rows={6}
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
            <div className="flex items-center gap-2">
                 <input 
                    type="checkbox" 
                    id="publishCheck"
                    checked={formData.published}
                    onChange={(e) => setFormData({...formData, published: e.target.checked})}
                    className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                 />
                 <label htmlFor="publishCheck" className="text-gray-700 cursor-pointer select-none font-medium">
                    Tampilkan ke Publik?
                 </label>
            </div>

            <div className="flex gap-2">
                {isEditing && (
                    <button
                        type="button"
                        onClick={resetForm}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                    >
                        <X size={18} /> Batal
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isUploading}
                    className={`flex items-center gap-2 px-6 py-2 text-white rounded-lg transition font-medium ${
                      isUploading ? 'bg-gray-400 cursor-not-allowed' :
                      isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                    {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {isUploading ? 'Mengupload...' : (isEditing ? 'Simpan Perubahan' : 'Buat Berita')}
                </button>
            </div>
          </div>
        </form>
      </div>

      {/* --- TABEL DAFTAR BERITA --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700">Daftar Berita ({newsList.length})</h2>
        </div>
        
        {loading ? (
            <div className="p-8 text-center text-gray-500">Memuat data...</div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                            <th className="p-4 font-semibold">Judul</th>
                            <th className="p-4 font-semibold text-center">Status</th>
                            <th className="p-4 font-semibold text-center">Tanggal</th>
                            <th className="p-4 font-semibold text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {newsList.map((news) => (
                            <tr key={news.id} className="hover:bg-gray-50 transition">
                                <td className="p-4">
                                    <div className="font-medium text-gray-900">{news.title}</div>
                                    <div className="text-xs text-gray-500">/{news.slug}</div>
                                </td>
                                <td className="p-4 text-center">
                                    <button 
                                        onClick={() => togglePublish(news)}
                                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${news.published ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
                                    >
                                        {news.published ? <Eye size={12}/> : <EyeOff size={12}/>}
                                        {news.published ? 'Published' : 'Draft'}
                                    </button>
                                </td>
                                <td className="p-4 text-center text-sm text-gray-600">
                                    {new Date(news.createdAt).toLocaleDateString('id-ID')}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={() => startEdit(news)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(news.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                            title="Hapus"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
}