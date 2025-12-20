'use client';

import { useState, useEffect, useRef } from 'react';
import { Edit, Trash2, Plus, Save, User, Loader2 } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  photoUrl: string;
  order: number;
}

export default function AdminTeamPage() {
  const [teamList, setTeamList] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    bio: '',
    photoUrl: '',
    order: 0,
  });

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/team');
      const data = await res.json();
      setTeamList(data);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
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
      setFormData((prev) => ({ ...prev, photoUrl: newBlob.url }));
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Gagal mengupload foto.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return alert('Nama wajib diisi');

    const url = isEditing ? `/api/team/${editId}` : '/api/team';
    const method = isEditing ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Data tersimpan!');
        resetForm();
        fetchTeam();
      }
    } catch (error) { console.error(error); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus anggota ini?')) return;
    const res = await fetch(`/api/team/${id}`, { method: 'DELETE' });
    if (res.ok) fetchTeam();
  };

  const startEdit = (member: TeamMember) => {
    setIsEditing(true);
    setEditId(member.id);
    setFormData({
      name: member.name,
      position: member.position,
      bio: member.bio || '',
      photoUrl: member.photoUrl || '',
      order: member.order || 0,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ name: '', position: '', bio: '', photoUrl: '', order: 0 });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Struktur Organisasi</h1>

      {/* FORM INPUT */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b">
           {isEditing ? <Edit size={20} className="text-blue-600"/> : <Plus size={20} className="text-green-600"/>}
           <h2 className="text-lg font-semibold">{isEditing ? 'Edit Anggota' : 'Tambah Anggota'}</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
               <label className="block text-sm font-medium text-gray-700 mb-1">No. Urut</label>
               <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" />
               <p className="text-xs text-gray-500 mt-1">Angka kecil tampil duluan.</p>
            </div>
            <div className="md:col-span-2">
               <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
               <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan (Position)</label>
              <input type="text" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: Pembina" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Foto Profil</label>
              <div className="flex items-start gap-3">
                 {/* Preview */}
                 <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {formData.photoUrl ? (
                      <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="text-gray-400" size={20} />
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
                        <Loader2 className="animate-spin" size={12} /> Mengupload...
                      </div>
                    )}
                    <input
                        type="text"
                        value={formData.photoUrl}
                        onChange={(e) => setFormData({...formData, photoUrl: e.target.value})}
                        className="w-full border rounded-lg p-2 mt-2 text-xs text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Atau paste URL foto di sini..."
                    />
                 </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio Singkat</label>
            <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} rows={2} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Motto atau deskripsi singkat..." />
          </div>

          <div className="flex gap-2 justify-end">
             {isEditing && <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-100 rounded-lg">Batal</button>}
             <button type="submit" className={`flex items-center gap-2 px-6 py-2 text-white rounded-lg ${isEditing ? 'bg-blue-600' : 'bg-green-600'}`}>
               <Save size={18} /> Simpan
             </button>
          </div>
        </form>
      </div>

      {/* TABEL LIST */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
         <table className="w-full text-left">
           <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
             <tr>
               <th className="p-4 w-16 text-center">Urut</th>
               <th className="p-4">Anggota</th>
               <th className="p-4">Jabatan</th>
               <th className="p-4 text-right">Aksi</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-gray-100">
             {teamList.map(member => (
               <tr key={member.id} className="hover:bg-gray-50">
                 <td className="p-4 text-center font-bold text-gray-400">#{member.order}</td>
                 <td className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                       {member.photoUrl ? <img src={member.photoUrl} alt="" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-gray-400"><User size={20}/></div>}
                    </div>
                    <div>
                        <div className="font-bold">{member.name}</div>
                        <div className="text-xs text-gray-500">{member.bio}</div>
                    </div>
                 </td>
                 <td className="p-4 text-blue-600 font-medium">{member.position}</td>
                 <td className="p-4 text-right">
                   <button onClick={() => startEdit(member)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={18}/></button>
                   <button onClick={() => handleDelete(member.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18}/></button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
      </div>
    </div>
  );
}