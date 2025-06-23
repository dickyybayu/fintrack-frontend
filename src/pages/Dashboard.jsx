import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTransactions, addTransaction } from "../api/transaction";
import { getWallets } from "../api/wallet";
import FinanceChart from "../components/FinanceChart";
import ExpenseDistribution from "../components/ExpenseDistribution";
import IncomeDistribution from "../components/IncomeDistribution";
import RecentTransactions from "../components/RecentTransactions";
import AddTransactionDialog from "../components/AddTransactionDialog";
import MainLayout from "../layouts/MainLayout"; 
import toast from "react-hot-toast";      


export default function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [lastMonthExpense, setLastMonthExpense] = useState(0);
  const [lastMonthIncome, setLastMonthIncome] = useState(0);


  useEffect(() => {
    async function fetchData() {
      try {
        const [txRes, wRes] = await Promise.all([
          getTransactions(),
          getWallets(),
        ]);
        const txData = txRes.data;
        const wData = wRes.data;
        setTransactions(txData);
        setWallets(wData);

        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
        const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

        const incomeLastMonth = txData
          .filter((t) => t.type === "income")
          .filter((t) => {
            const date = new Date(t.date);
            return (
              date.getMonth() === lastMonth &&
              date.getFullYear() === lastMonthYear
            );
          })
          .reduce((sum, t) => sum + t.amount, 0);

        const expenseLastMonth = txData
          .filter((t) => t.type === "expense")
          .filter((t) => {
            const date = new Date(t.date);
            return (
              date.getMonth() === lastMonth &&
              date.getFullYear() === lastMonthYear
            );
          })
          .reduce((sum, t) => sum + t.amount, 0);

        setLastMonthIncome(incomeLastMonth);
        setLastMonthExpense(expenseLastMonth);
      } catch (err) {
        console.error("Gagal memuat data dashboard:", err);
        toast.error("Terjadi kesalahan saat memuat data.");
      }
    }
    fetchData();
  }, []);

  const getChangePercent = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const totalIncome = transactions
    .filter((t) => {
      const date = new Date(t.date);
      return (
        t.type === "income" &&
        date.getMonth() === thisMonth &&
        date.getFullYear() === thisYear
      );
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => {
      const date = new Date(t.date);
      return (
        t.type === "expense" &&
        date.getMonth() === thisMonth &&
        date.getFullYear() === thisYear
      );
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  const formatCurrency = (amt) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amt);

    const handleAddTransaction = async (form) => {
      const newTx = await addTransaction(form);
      setTransactions([newTx.data, ...transactions]);
      setShowModal(false);
    };

  return (
    <MainLayout>   
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:opacity-90"
          >
            + Tambah Transaksi
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white p-4 rounded shadow ">
            <h3 className="text-sm font-medium text-gray-500">Total Saldo</h3>
            <p className="text-2xl font-bold text-black">{formatCurrency(totalBalance)}</p>
            <p className="text-xs text-gray-400 mt-2">Dari {wallets.length} dompet</p>
          </div>

          <div className="bg-white p-4 rounded shadow ">
            <h3 className="text-sm font-medium text-gray-500">Pemasukan Bulan Ini</h3>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                ${totalIncome >= lastMonthIncome ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                {getChangePercent(totalIncome, lastMonthIncome).toFixed(1)}%
              </span>
              <span className="text-xs text-gray-500">dari bulan lalu</span>
              <span className={`ml-auto ${totalIncome >= lastMonthIncome ? "text-green-600" : "text-red-600"}`}>
                {totalIncome >= lastMonthIncome ? "↑" : "↓"}
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow ">
            <h3 className="text-sm font-medium text-gray-500">Pengeluaran Bulan Ini</h3>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                ${totalExpense >= lastMonthExpense ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                {getChangePercent(totalExpense, lastMonthExpense).toFixed(1)}%
              </span>
              <span className="text-xs text-gray-500">dari bulan lalu</span>
              <span className={`ml-auto ${totalExpense >= lastMonthExpense ? "text-red-600" : "text-green-600"}`}>
                {totalExpense >= lastMonthExpense ? "↓" : "↑"}
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow ">
            <h3 className="text-sm font-medium text-gray-500">Selisih</h3>
            <p className={`text-2xl font-bold ${totalIncome - totalExpense >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(totalIncome - totalExpense)}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500">Surplus bulan ini</span>
              <span className="ml-auto text-gray-400">↗</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-medium mb-2">Tren Saldo Bulanan</h3>
          <FinanceChart />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-medium mb-2">Distribusi Pengeluaran</h3>
            <ExpenseDistribution transactions={transactions} />
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-medium mb-2">Distribusi Pemasukan</h3>
            <IncomeDistribution transactions={transactions} />
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow ">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Transaksi Terbaru</h3>
            <Link to="/transactions" className="text-blue-600 text-sm">
              Lihat Semua
            </Link>
          </div>
          <RecentTransactions items={transactions.slice(0, 5)} wallets={wallets} />
          {transactions.length === 0 && (
            <p className="text-gray-500">Belum ada transaksi.</p>
          )}
        </div>
      </div>
      <AddTransactionDialog
        open={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddTransaction}
        wallets={wallets}
      />
    </MainLayout>
  );
}