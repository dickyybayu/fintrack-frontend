import { useState, useRef} from 'react';
import clsx from 'clsx';

function AddTransactionDialog({ open, onClose, onAdd, wallets }) {
  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    category: '',
    wallet: '',
    date: new Date().toISOString().split('T')[0], 
    description: '',
  });

  const incomeCategories = ['Gaji', 'Freelance', 'Investasi', 'Bonus', 'Lainnya'];
  const expenseCategories = ['Makanan', 'Transport', 'Belanja', 'Tagihan', 'Hiburan', 'Kesehatan', 'Lainnya'];

  const activeCategories = form.type === 'income' ? incomeCategories : expenseCategories;

  const [saldo, setSaldo] = useState("0");

  const dialogRef = useRef(null);

  const handleBackgroundClick = (e) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target)) {
        onClose(); 
    }
  };

  const formatNumber = (value) => {
    if (!value) return "0";
    const number = value.replace(/\D/g, ""); 
    return new Intl.NumberFormat("id-ID").format(Number(number));
  };

  const handleSaldoChange = (e) => {
    const raw = e.target.value.replace(/\./g, "").replace(/[^0-9]/g, "");
    const formatted = formatNumber(raw);
    setSaldo(formatted);
    setForm({ ...form, amount: Number(raw) });
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onAdd(form);
      setForm({
        type: 'expense',
        amount: '',
        category: '',
        wallet: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
      setSaldo("0");
      onClose(false);
    } catch (err) {
      alert('Gagal menambahkan transaksi.');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"  onClick={handleBackgroundClick}>
      <div ref={dialogRef} className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"  onClick={(e) => e.stopPropagation()}>

        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold">Tambah Transaksi Baru</h2>
            <p className="text-sm text-gray-500">Catat transaksi pemasukan atau pengeluaran Anda</p>
          </div>
          <button onClick={() => onClose(false)} className="text-gray-500 hover:text-black text-xl">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Jenis Transaksi</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="border p-2 rounded w-full"
            >
              <option value="expense">Pengeluaran</option>
              <option value="income">Pemasukan</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Jumlah</label>
            <input
              type="text"
              placeholder="0"
              value={saldo}
              onChange={handleSaldoChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Kategori</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border p-2 rounded w-full"
              required
            >
            <option value="">Pilih kategori</option>
            {activeCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
            ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Dompet</label>
            <select
              value={form.wallet}
              onChange={(e) => setForm({ ...form, wallet: e.target.value })}
              className="border p-2 rounded w-full"
              required
            >
              <option value="">Pilih dompet</option>
              {wallets.map((w) => (
                <option key={w._id} value={w._id}>{w.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Tanggal</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Deskripsi</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border p-2 rounded w-full"
              placeholder="Deskripsi transaksi..."
            />
          </div>

          <div className="text-right">
            <button
            type="submit"
            className={clsx(
                "text-white px-4 py-2 rounded hover:opacity-90",
                form.type === "expense" ? "bg-red-600" : "bg-blue-600"
            )}
            >
            Simpan Transaksi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTransactionDialog;
