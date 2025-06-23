import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { getCurrentUser } from '../api/auth';

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser()
      .then((res) => setUser(res.data))
      .catch((err) => console.error('Gagal ambil profil:', err));
  }, []);

  if (!user) return <MainLayout><p className="p-6">Memuat profil...</p></MainLayout>;

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-md shadow">
        <h1 className="text-2xl font-bold mb-4">Profil Pengguna</h1>
        <div className="space-y-4">
          <div>
            <label className="font-medium">Nama</label>
            <p className="text-gray-700">{user.name}</p>
          </div>
          <div>
            <label className="font-medium">Email</label>
            <p className="text-gray-700">{user.email}</p>
          </div>
          <div>
            <label className="font-medium">Bergabung Sejak</label>
            <p className="text-gray-700">{new Date(user.createdAt).toLocaleDateString('id-ID')}</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Profile;
