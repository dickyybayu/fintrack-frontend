import { useEffect, useState } from 'react';
import { getTransactions, addTransaction, deleteTransaction , updateTransaction} from '../api/transaction';
import { getWallets } from '../api/wallet';
import FilterBar from "../components/FilterBar";
import TransactionTable from "../components/TransactionTable";
import AddTransactionDialog from "../components/AddTransactionDialog";
import EditTransactionDialog from '../components/EditTransactionDialog';
import MainLayout from '../layouts/MainLayout';
import ConfirmDialog from '../components/ConfirmDialog';
import toast from 'react-hot-toast';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTx, setEditTx] = useState(null);
  const [deleteTx, setDeleteTx] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [txRes, walletRes] = await Promise.all([
          getTransactions(),
          getWallets()
        ]);
        setTransactions(txRes.data);
        setWallets(walletRes.data);
      } catch (err) {
        console.error('Gagal memuat data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleAddTransaction = async (form) => {
    try {
      await addTransaction(form);
      const res = await getTransactions();
      setTransactions(res.data);
      setShowModal(false);
    } catch (err) {
      toast.error("Gagal menambahkan transaksi.");
    }
  };

  const filteredTx = transactions.filter((tx) => {
    const searchLower = search.toLowerCase();

    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    const matchesDate = !dateFilter || new Date(tx.date).toISOString().split('T')[0] === dateFilter;

    const matchesSearch =
      tx.category?.toLowerCase().includes(searchLower) ||
      tx.description?.toLowerCase().includes(searchLower) ||
      String(tx.amount)?.includes(searchLower) ||
      wallets.find(w => w._id === tx.wallet)?.name?.toLowerCase().includes(searchLower);

    return matchesType && matchesDate && matchesSearch;
  });

  const handleUpdateTransaction = async (id, updatedData) => {
    try {
      await updateTransaction(id, updatedData);
      setEditTx(null);
      const res = await getTransactions();
      setTransactions(res.data);
    } catch (err) {
      toast.error('Gagal memperbarui transaksi.');
    }
  };

  const handleDeleteTransaction = async () => {
    if (!deleteTx) return;
    try {
      await deleteTransaction(deleteTx._id);
      setDeleteTx(null);
      const res = await getTransactions();
      setTransactions(res.data);
    } catch (err) {
      toast.error('Gagal menghapus transaksi.');
    }
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold">Transaksi</h1>
            <p className="text-gray-500">Kelola semua transaksi keuangan Anda</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:opacity-90"
          >
            + Tambah Transaksi
          </button>

        </div>

        <FilterBar
          search={search}
          onSearchChange={setSearch}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />

        {loading ? (
          <p>Loading transaksi...</p>
        ) : filteredTx.length === 0 ? (
          <p className="text-gray-500">Tidak ada transaksi ditemukan.</p>
        ) : (
          <TransactionTable transactions={filteredTx} wallets={wallets} onEdit={(tx) => setEditTx(tx)} onDelete={(tx) => setDeleteTx(tx)} />
        )}
      </div>
      <AddTransactionDialog
        open={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddTransaction}
        wallets={wallets}
      />

      <EditTransactionDialog
        open={!!editTx}
        transaction={editTx}
        wallets={wallets}
        onClose={() => setEditTx(null)}
        onUpdate={handleUpdateTransaction}
      />

      <ConfirmDialog
        open={!!deleteTx}
        title="Konfirmasi Hapus"
        message={`Apakah Anda yakin ingin menghapus transaksi ${deleteTx?.description ? `"${deleteTx.description}"` : 'ini'}?`}
        onConfirm={handleDeleteTransaction}
        onCancel={() => setDeleteTx(null)}
      />
    </MainLayout>
  );
}

export default Transactions;
