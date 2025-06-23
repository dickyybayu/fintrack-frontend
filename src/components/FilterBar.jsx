function FilterBar({
  search,
  onSearchChange,
  typeFilter,
  setTypeFilter,
  dateFilter,
  setDateFilter,
}) {
  return (
    <div className="bg-gray-50 border p-4 rounded mb-6">
      <h2 className="font-semibold mb-2">Filter & Pencarian</h2>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <input
          type="text"
          placeholder="Cari transaksi..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border p-2 rounded w-full col-span-12 md:col-span-6"
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border p-2 rounded w-full col-span-12 md:col-span-3"
        >
          <option value="all">Semua Tipe</option>
          <option value="income">Pemasukan</option>
          <option value="expense">Pengeluaran</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border p-2 rounded w-full col-span-12 md:col-span-3"
        />
      </div>
    </div>
  );
}

export default FilterBar;
