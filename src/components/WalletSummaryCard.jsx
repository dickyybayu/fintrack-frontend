function WalletSummaryCard({ totalBalance, walletCount }) {
  return (
    <div className="bg-white border p-4 rounded-lg shadow-sm mb-6">
      <h3 className="text-lg font-semibold mb-1">Ringkasan Dompet</h3>
      <p className="text-sm text-gray-500 mb-4">Total saldo dari semua dompet Anda</p>
      <p className="text-3xl font-bold text-black">Rp {totalBalance.toLocaleString('id-ID')}</p>
      <p className="text-sm text-gray-600 mt-1">Dari {walletCount} dompet aktif</p>
    </div>
  );
}
export default WalletSummaryCard;
