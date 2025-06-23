import clsx from 'clsx';

function TransactionTable({ transactions, wallets, onEdit, onDelete }) {
  return (
    <div className="overflow-auto">
      <table className="w-full text-left border rounded">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-6 py-3 text-center">Tanggal</th>
            <th className="px-6 py-3 text-center">Jenis</th>
            <th className="px-6 py-3 text-center">Kategori</th>
            <th className="px-6 py-3 text-center">Deskripsi</th>
            <th className="px-6 py-3 text-center">Dompet</th>
            <th className="px-6 py-3 text-center">Jumlah</th>
            <th className="px-6 py-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx._id} className="border-t">
              <td className="px-4 py-2">{new Date(tx.date).toLocaleDateString('id-ID')}</td>
              <td className="px-4 py-2">
                <span className={clsx(
                  "px-2 py-1 rounded-full text-white text-sm",
                  tx.type === 'income' ? "bg-green-500" : "bg-red-500"
                )}>
                  {tx.type === 'income' ? '↑ Masuk' : '↓ Keluar'}
                </span>
              </td>
              <td className="px-4 py-2">{tx.category}</td>
              <td className="px-4 py-2">{tx.description || '-'}</td>
              <td className="px-4 py-2">{wallets.find(w => w._id === tx.wallet)?.name || '-'}</td>
              <td className="px-4 py-2 font-semibold" style={{ color: tx.type === 'income' ? 'green' : 'red' }}>
                {tx.type === 'income' ? '+' : '-'}Rp {Number(tx.amount).toLocaleString('id-ID')}
              </td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(tx)}
                        className="text-sm px-3 py-1 border rounded hover:bg-gray-100"

                    >   
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(tx)}
                        className="text-sm px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-50"
                    >
                        Hapus
                    </button>
                </div>
             </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default TransactionTable;
