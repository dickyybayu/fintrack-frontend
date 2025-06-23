import { useState, useRef } from "react";


function TransferDialog({ open, onClose, onTransfer, wallets }) {
  const [fromWallet, setFromWallet] = useState('');
  const [toWallet, setToWallet] = useState('');
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
  };   
 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fromWallet || !toWallet || !saldo) {
      return alert("Semua field harus diisi.");
    }
    if (fromWallet === toWallet) {
      return alert("Dompet asal dan tujuan tidak boleh sama.");
    }

    const amount = Number(saldo.replace(/\./g, "").replace(/[^0-9]/g, ""));
    const form = {fromWallet, toWallet, amount};

    try {
        onTransfer(form);
        setSaldo("0");
        onClose();
    } catch (err) {
        alert("Gagal melakukan transfer.");
    }
  };

  if (!open) return null;


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={handleBackgroundClick}
    >
      <div
        ref={dialogRef}
        className="bg-white p-6 rounded w-full max-w-md space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold">Transfer Antar Dompet</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            className="border w-full p-2 rounded"
            value={fromWallet}
            onChange={(e) => setFromWallet(e.target.value)}
          >
            <option value="">Dari Dompet</option>
            {wallets.map((w) => (
              <option key={w._id} value={w._id}>
                {w.name}
              </option>
            ))}
          </select>

          <select
            className="border w-full p-2 rounded"
            value={toWallet}
            onChange={(e) => setToWallet(e.target.value)}
          >
            <option value="">Ke Dompet</option>
            {wallets.map((w) => (
              <option key={w._id} value={w._id}>
                {w.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Masukkan jumlah saldo"
            className="border w-full p-2 rounded"
            value={saldo}
            onChange={handleSaldoChange}
            required
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransferDialog;