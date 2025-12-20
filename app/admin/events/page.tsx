'use client';

import { useState, useEffect, useRef } from 'react';
import { Edit, Trash2, Plus, Save, X, Calendar, MapPin, ImageIcon, Loader2 } from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
}

export default function AdminEventsPage() {
  const [eventsList, setEventsList] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); 
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    imageUrl: '',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEventsList(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.startDate) return alert('Judul dan Tanggal Mulai wajib diisi');

    const url = isEditing ? `/api/events/${editId}` : '/api/events';
    const method = isEditing ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert(isEditing ? 'Kegiatan diperbarui!' : 'Kegiatan ditambahkan!');
        resetForm();
        fetchEvents();
      } else {
        alert('Gagal menyimpan.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus kegiatan ini?')) return;
    const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
    if (res.ok) fetchEvents();
  };

  const startEdit = (ev: EventItem) => {
    setIsEditing(true);
    setEditId(ev.id);
    setFormData({
      title: ev.title,
      description: ev.description,
      location: ev.location || '',
      startDate: formatForInput(ev.startDate),
      endDate: ev.endDate ? formatForInput(ev.endDate) : '',
      imageUrl: ev.imageUrl || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ title: '', description: '', location: '', startDate: '', endDate: '', imageUrl: '' });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manajemen Kegiatan</h1>

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b">
           {isEditing ? <Edit size={20} className="text-blue-600"/> : <Plus size={20} className="text-green-600"/>}
           <h2 className="text-lg font-semibold">{isEditing ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kegiatan</label>
              <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
              <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Mulai</label>
              <input type="datetime-local" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Selesai (Opsional)</label>
              <input type="datetime-local" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Poster/Kegiatan</label>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>

          <div className="flex gap-2 justify-end">
            {isEditing && <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-100 rounded-lg">Batal</button>}
            <button type="submit" className={`flex items-center gap-2 px-6 py-2 text-white rounded-lg ${isEditing ? 'bg-blue-600' : 'bg-green-600'}`}>
              <Save size={18} /> Simpan
            </button>
          </div>
        </form>
      </div>

      {/* TABEL */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
           <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
             <tr>
               <th className="p-4">Kegiatan</th>
               <th className="p-4">Waktu & Lokasi</th>
               <th className="p-4 text-right">Aksi</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-gray-100">
             {eventsList.map(ev => (
               <tr key={ev.id} className="hover:bg-gray-50">
                 <td className="p-4">
                   <div className="font-bold">{ev.title}</div>
                   <div className="text-sm text-gray-500 line-clamp-1">{ev.description}</div>
                 </td>
                 <td className="p-4 text-sm">
                   <div className="flex items-center gap-1"><Calendar size={14}/> {new Date(ev.startDate).toLocaleDateString('id-ID')}</div>
                   {ev.location && <div className="flex items-center gap-1 text-gray-500"><MapPin size={14}/> {ev.location}</div>}
                 </td>
                 <td className="p-4 text-right">
                   <button onClick={() => startEdit(ev)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={18}/></button>
                   <button onClick={() => handleDelete(ev.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18}/></button>
                 </td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>
    </div>
  );
}