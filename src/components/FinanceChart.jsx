import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { getWalletSnapshots } from "../api/walletSnapshot";

export default function FinanceChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getWalletSnapshots();
        
        const formatted =  res.data.map(({month, total_balance}) => {
          const label = new Date(`${month}-01`).toLocaleDateString("id-ID", {
            month: "long",
            year: "numeric",
          });

          return {
            month: label,
            balance: total_balance,
          };
        });

        setData(formatted);
      } catch (error) {
        console.error("Gagal memuat data snapshot:", error);
      }
    }
    fetchData();
  }, []);
          
  const formatCurrency = (v) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(v);

  const min = Math.min(...data.map(d => d.balance));
  const max = Math.max(...data.map(d => d.balance));
  const step = 20_000_000;
  const adjustedMin = Math.floor(min / step) * step;
  const adjustedMax = Math.ceil(max / step) * step;

  if (data.length === 0 ) {
    return <p className="text-gray-500">Belum ada data saldo bulanan.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300} >
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
            <stop
              offset="95%"
              stopColor="hsl(var(--primary))"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" axisLine={false} tickLine={false} />
        <YAxis
          axisLine={false}
          tickLine={false}
          width={100}
          domain={[adjustedMin, adjustedMax]}
          tickFormatter={(v) => {
            if (v >= 1_000_000_000) return `Rp ${(v / 1_000_000_000).toFixed(1)} M`;
            if (v >= 1_000_000) return `Rp ${(v / 1_000_000).toFixed(0)} Jt`;
            if (v >= 1_000) return `Rp ${(v / 1_000).toFixed(0)} rb`;
            return `Rp ${v}`;
          }}
        />
        <Tooltip
          formatter={(val) => [formatCurrency(val), "Saldo"]}
          labelStyle={{ color: "hsl(var(--foreground))" }}
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
          }}
        />
        <Area
          type="monotone"
          dataKey="balance"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          fillOpacity={0.3}
          fill="url(#colorBalance)"
          dot={{ stroke: 'black', strokeWidth: 2, r: 4 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
