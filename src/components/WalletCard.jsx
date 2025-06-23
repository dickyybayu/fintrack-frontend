function WalletCard({ wallet, onEdit,  onDelete }) {
  const colorMap = {
    Bank: 'border-yellow-500',
    'E-wallet': 'border-blue-500',
    Tunai: 'border-green-500',
    Investasi: 'border-amber-600',
  };

  return (
    <div className={`border-2 rounded-lg p-4 shadow-sm ${colorMap[wallet.type] || 'border-gray-300'}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{wallet.name}</h3>
        <span>💳</span>
      </div>
      <p className="text-xl font-bold">Rp {parseInt(wallet.balance).toLocaleString('id-ID')}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="bg-gray-100 px-2 py-1 rounded text-xs">{wallet.type}</span>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-sm px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-50"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
export default WalletCard;
