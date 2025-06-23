import {useState, useEffect, useRef} from 'react';

function EditWalletDialog({ open, onClose, onUpdate, wallet }) {
  const [form, setForm] = useState({
    name: '',
    balance: '',
    type: '',
  });
  const [saldo, setSaldo] = useState("0");

  const dialogRef = useRef(null);

  const handleBackgroundClick = (e) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target)) {
        onClose(); 
    }
  };

  const formatNumber = (value) => {
    if (!value) return "0";
    const number = String(value).replace(/\D/g, "");
    return new Intl.NumberFormat("id-ID").format(Number(number));
  };

  const handleSaldoChange = (e) => {
    const raw = e.target.value.replace(/\./g, "").replace(/[^0-9]/g, "");
    const formatted = formatNumber(raw);
    setSaldo(formatted);
    setForm({ ...form, balance: Number(raw) });
  };

  useEffect(() => {
    if (wallet) {
      setForm({
        name: wallet.name || '',
        balance: wallet.balance || '',
        type: wallet.type || '',
      });
      setSaldo(formatNumber(wallet.balance || 0)); 
    }

  }, [wallet]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || form.balance === '') return alert("Nama dan saldo harus diisi.");
    try {
      await onUpdate(wallet._id, form);
      onClose();
    } catch (err) {
      alert("Gagal mengedit wallet.");
    }
  };

  if (!open) return null;

return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={handleBackgroundClick}>
      <div ref={dialogRef} className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">Edit Dompet</h3>
            <p className="text-sm text-gray-500">Perbarui informasi dompet Anda</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
         <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Dompet</label>
          <input
            type="text"
            placeholder="Contoh: BCA, Cash, Gopay"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
         </div>

         <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Dompet</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="border p-2 rounded w-full"
          >
            <option value="Bank">Bank</option>
            <option value="Tunai">Tunai</option>
            <option value="E-Wallet">E-Wallet</option>
            <option value="Investasi">Investasi</option>
          </select>
         </div>

         <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Saldo</label>
            <input
                type="text"
                placeholder={wallet ? formatNumber(wallet.balance) : "0"}
                value={saldo}
                onChange={handleSaldoChange}
                className="border p-2 rounded w-full"
                required
            />
         </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded text-white bg-blue-600 hover:opacity-90"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditWalletDialog;