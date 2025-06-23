import { useState, useEffect } from 'react';
import { getWallets, addWallet, updateWallet, deleteWallet } from '../api/wallet';
import MainLayout from '../layouts/MainLayout';
import WalletCard from '../components/WalletCard';
import WalletSummaryCard from '../components/WalletSummaryCard';
import WalletTypeSummaryCard from '../components/WalletTypeSummaryCard';
import AddWalletDialog from "../components/AddWalletDialog";
import EditWalletDialog from '../components/EditWalletDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import TransferDialog from '../components/TransferDialog';
import toast from 'react-hot-toast';

function Wallets() {
  const [wallets, setWallets] = useState([]);
  const [editWallet, setEditWallet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [walletToDelete, setWalletToDelete] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);


  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = async () => {
    try {
      const res = await getWallets();
      setWallets(res.data);
    } catch (error) {
      console.error('Gagal memuat wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, form) => {
    try {
      await updateWallet(id, form);
      setEditWallet(null);
      loadWallets();
    } catch (error) {
      console.error(error);
      toast.error("Gagal memperbarui wallet.");
    }
  }

  const handleAdd = async (form) => {
    try {
      await addWallet(form);
      setShowModal(false);
      loadWallets();
    } catch (error) {
      toast.error("Gagal menambahkan wallet.");
    }
  };

  const handleTransfer = async ({ fromWallet, toWallet, amount }) => {
    try {
      const from = wallets.find(w => w._id === fromWallet);
      const to = wallets.find(w => w._id === toWallet);

      if (!from || !to) return alert("Dompet tidak ditemukan.");
      if (from.balance < amount) return alert("Saldo tidak mencukupi.");

      await updateWallet(fromWallet, { ...from, balance: from.balance - amount });
      await updateWallet(toWallet, { ...to, balance: to.balance + amount });

      loadWallets();
    } catch (err) {
      console.error(err);
      toast.error("Transfer gagal.");
    }
  };


  const handleDelete = async () => {
    if (!walletToDelete) return;
    try {
      await deleteWallet(walletToDelete._id);
      setWalletToDelete(null);
      loadWallets();
    } catch (error) {
      toast.error("Gagal menghapus wallet.");
    }
  };

  const totalBalance = wallets.reduce((sum, w) => sum + parseInt(w.balance), 0);

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold">Dompet</h1>
            <p className="text-gray-500">Kelola semua dompet dan sumber dana Anda</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:opacity-90"
            >
              + Tambah Dompet
            </button>
            <button
              onClick={() => setShowTransferModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:opacity-90"
            >
              🔁 Transfer Antar Dompet
            </button>
          </div>
        </div>

        <WalletSummaryCard totalBalance={totalBalance} walletCount={wallets.length} />

        {loading ? (
          <p>Loading wallet...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wallets.map((wallet) => (
              <WalletCard
                key={wallet._id}
                wallet={wallet}
                onEdit={() => setEditWallet(wallet)}
                onDelete={() => setWalletToDelete(wallet)}
              />
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
          {["Bank", "Tunai", "E-wallet", 
            "Investasi"
          ].map((type) => {
            const filtered = wallets.filter(w => w.type === type);
            const total = filtered.reduce((sum, w) => sum + parseInt(w.balance), 0);
            const count = filtered.length;

            return (
              <WalletTypeSummaryCard
                key={type}
                label={`Total ${type}`}
                total={total}
                count={count}
                subtitle={`${type !== "Tunai" ? `${count} ${type === "Bank" ? "rekening bank" : type === "Tunai" ? "uang tunai" : type === "E-wallet" ? "dompet digital" : "investasi"}` : "Uang tunai"}`}
                icon={
                  type === "Bank" ? "🏦" :
                  type === "Tunai" ? "💵" :
                  type === "E-wallet" ? "📲" :
                  type === "Investasi" ? "📈" : 
                  "💳"
                }
              />
            );
          })}
        </div>

        <EditWalletDialog
          open={!!editWallet}
          wallet={editWallet}
          onClose={() => setEditWallet(null)}
          onUpdate={handleUpdate}
        />              

        <AddWalletDialog
          open={showModal}
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />

        <TransferDialog
          open={showTransferModal}
          onClose={() => setShowTransferModal(false)}
          wallets={wallets} 
          onTransfer={handleTransfer}
        />

        <ConfirmDialog
          open={!!walletToDelete}
          title="Hapus Dompet"
          message={`Yakin ingin menghapus dompet "${walletToDelete?.name}"?`}
          onCancel={() => setWalletToDelete(null)}
          onConfirm={handleDelete}
        />

      </div>
    </MainLayout>
  );
}

export default Wallets;
