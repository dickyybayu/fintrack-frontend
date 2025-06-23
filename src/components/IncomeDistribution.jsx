import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#34D399", "#60A5FA", "#FBBF24", "#F87171", "#A78BFA"]; // bisa bedakan dengan Expense

export default function IncomeDistribution({ transactions }) {
  const byCat = transactions
    .filter((tx) => tx.type === "income")
    .reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {});

  const data = Object.entries(byCat).map(([name, value], i) => ({
    name,
    value,
    color: COLORS[i % COLORS.length],
  }));

  const total = data.reduce((sum, d) => sum + d.value, 0);

  const formatCurrency = (v) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(v);

  if (data.length === 0) {
    return <p className="text-gray-500">Belum ada data pemasukan.</p>;
  }

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(val) => formatCurrency(val)} />
        </PieChart>
      </ResponsiveContainer>
      {data.map((item) => (
        <div
          key={item.name}
          className="flex items-center justify-between text-sm"
        >
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span>{item.name}</span>
          </div>
          <span className="font-medium">
            {formatCurrency(item.value)} (
            {Math.round((item.value / total) * 100)}%)
          </span>
        </div>
      ))}
    </div>
  );
}
