import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

export default function RecentTransactions({ items, wallets}) {
  const formatCurrency = (v) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(v);

  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      {items.map((tx) => {
        const wallet = wallets.find((w) => w._id === tx.wallet);

        return (
          <div
            key={tx._id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-2 rounded-full ${
                  tx.type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                }`}
              >
                {tx.type === "income" ? (
                  <ArrowUpIcon className="h-4 w-4" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4" />
                )}
              </div>
              <div>
                <div className="font-medium">{tx.description}</div>
                <div className="text-sm text-gray-500">
                  {tx.category} • {wallet?.name || "Dompet tidak ditemukan"} •{" "}
                  {new Date(tx.date).toLocaleDateString("id-ID")}
                </div>
              </div>
            </div>
            <div
              className={`font-semibold ${
                tx.type === "income" ? "text-green-600" : "text-red-600"
              }`}
            >
              {tx.type === "income" ? "+" : "-"}
              {formatCurrency(tx.amount)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
