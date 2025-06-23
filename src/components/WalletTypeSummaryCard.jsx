function WalletTypeSummaryCard({ label, icon, total, count, subtitle }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-semibold">{label}</h4>
        <span>{icon}</span>
      </div>
      <p className="text-2xl font-bold">Rp {total.toLocaleString('id-ID')}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}
export default WalletTypeSummaryCard;