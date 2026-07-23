// components/bimbingan/admin/UsersTab.tsx
import { useState } from 'react';
import { Search, CheckCircle2, Clock } from 'lucide-react';
import type { AppUser, UserRole } from '@/types';

interface UsersTabProps {
  users: AppUser[];
  currentUser?: AppUser;
  handleUpdateUserRole: (
    userId: string,
    role: UserRole,
    npm: string,
    nidn: string,
    department: string
  ) => void;
}

export default function UsersTab({ users, currentUser, handleUpdateUserRole }: UsersTabProps) {
  const canEdit = currentUser?.role === 'admin';
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<UserRole>('guest');
  const [editNpm, setEditNpm] = useState('');
  const [editNidn, setEditNidn] = useState('');
  const [editDepartment, setEditDepartment] = useState('');

  // Filter Users
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.npm && user.npm.includes(searchTerm)) ||
    (user.nidn && user.nidn.includes(searchTerm))
  );

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm text-left" id="tab-users-content">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-gray-900">Manajemen Pengguna & Verifikasi</h2>
          <p className="text-xs text-gray-500 mt-1">
            Atur hak akses akun pendaftar Google SSO. Verifikasi akun guest menjadi Mahasiswa (NPM) atau Dosen (NIDN).
          </p>
        </div>

        {/* Search user */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari nama, email, NPM, NIDN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full md:w-64"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-3xs font-bold uppercase text-gray-400 tracking-wider">
              <th className="py-3 px-4">Pengguna</th>
              <th className="py-3 px-4">Peran (Role)</th>
              <th className="py-3 px-4">Nomor Identitas</th>
              <th className="py-3 px-4">Prodi / Departemen</th>
              <th className="py-3 px-4">Status Verifikasi</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {filteredUsers.map(user => {
              const isEditing = editingUserId === user.id;

              return (
                <tr key={user.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                        alt={user.name}
                        className="w-9 h-9 rounded-full object-cover border border-gray-100 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-semibold text-gray-800 text-xs">{user.name}</p>
                        <p className="text-3xs text-gray-400 font-mono">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {isEditing ? (
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value as UserRole)}
                        className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="guest">Guest (Tamu)</option>
                        <option value="student">Student (Mahasiswa)</option>
                        <option value="lecturer">Lecturer (Dosen)</option>
                        <option value="prodi">Prodi (Program Studi)</option>
                        <option value="admin">Super Admin</option>
                      </select>
                    ) : (
                      <span className={`inline-block text-3xs font-bold px-2 py-0.5 rounded-full uppercase ${
                        user.role === 'admin' ? 'bg-red-50 text-red-700 border border-red-100' :
                        user.role === 'prodi' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                        user.role === 'lecturer' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                        user.role === 'student' ? 'bg-violet-50 text-violet-700 border border-violet-100' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {user.role === 'admin' ? 'Super Admin' :
                         user.role === 'prodi' ? 'Program Studi' :
                         user.role === 'lecturer' ? 'Dosen' :
                         user.role === 'student' ? 'Mahasiswa' : 'Guest'}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {isEditing ? (
                      editRole === 'student' ? (
                        <input
                          type="text"
                          placeholder="Masukkan NPM..."
                          value={editNpm}
                          onChange={(e) => setEditNpm(e.target.value)}
                          className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1 focus:ring-1 focus:ring-emerald-500 w-28 focus:outline-none"
                        />
                      ) : editRole === 'lecturer' ? (
                        <input
                          type="text"
                          placeholder="Masukkan NIDN..."
                          value={editNidn}
                          onChange={(e) => setEditNidn(e.target.value)}
                          className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1 focus:ring-1 focus:ring-emerald-500 w-28 focus:outline-none"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )
                    ) : (
                      <span className="font-mono text-xs text-gray-700">
                        {user.role === 'student' ? `NPM: ${user.npm || '-'}` :
                         user.role === 'lecturer' ? `NIDN: ${user.nidn || '-'}` : '-'}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {isEditing ? (
                      <input
                        type="text"
                        placeholder="e.g., Magister Ilmu Komunikasi"
                        value={editDepartment}
                        onChange={(e) => setEditDepartment(e.target.value)}
                        className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1 focus:ring-1 focus:ring-emerald-500 w-44 focus:outline-none"
                      />
                    ) : (
                      <span className="text-xs text-gray-600">{user.department || '-'}</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 text-3xs font-semibold ${
                      user.isVerified ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {user.isVerified ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5" /> Menunggu Verifikasi
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {canEdit ? (
                      isEditing ? (
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => {
                              handleUpdateUserRole(user.id, editRole, editNpm, editNidn, editDepartment);
                              setEditingUserId(null);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-3xs px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                          >
                            Simpan
                          </button>
                          <button
                            onClick={() => setEditingUserId(null)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-3xs px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingUserId(user.id);
                            setEditRole(user.role);
                            setEditNpm(user.npm || '');
                            setEditNidn(user.nidn || '');
                            setEditDepartment(user.department || '');
                          }}
                          className="text-emerald-700 hover:text-emerald-800 font-bold text-xs bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          Edit Hak Akses
                        </button>
                      )
                    ) : (
                      <span className="text-3xs text-gray-400 font-medium">Read-Only</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
