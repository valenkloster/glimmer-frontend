import React, { useState, useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { OrderContext } from '../../context/order/OrderContext';

const SalesStats = () => {
  const { fetchMonthlyStats, loading } = useContext(OrderContext);
  const [month, setMonth] = useState('01');
  const [year, setYear] = useState('2025');
  const [data, setData] = useState([]);
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const stats = await fetchMonthlyStats(month, year);
    
    const dailySales = stats.reduce((acc, order) => {
      const date = new Date(order.fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit'
      });
      acc[date] = (acc[date] || 0) + parseFloat(order.monto_total);
      return acc;
    }, {});

    const chartData = Object.entries(dailySales)
      .map(([date, total]) => ({
        date,
        total: Number(total.toFixed(2))
      }))
      .sort((a, b) => {
        const [dayA, monthA] = a.date.split('/');
        const [dayB, monthB] = b.date.split('/');
        return new Date(`2025-${monthA}-${dayA}`) - new Date(`2025-${monthB}-${dayB}`);
      });

    setData(chartData);
  };

  return (
    <div className="flex flex-col items-center w-full h-full max-w-6xl mx-auto p-4 bg-nude bg-opacity-60 rounded-lg">
      <form onSubmit={handleSubmit} className="w-full max-w-lg mb-8 flex flex-wrap gap-4 justify-center">
        <select 
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded"
        >
          {months.map((monthName, i) => (
            <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
              {monthName}
            </option>
          ))}
        </select>

        <select 
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border p-2 rounded"
        >
          {[2024, 2025, 2026].map(yearNum => (
            <option key={yearNum} value={yearNum}>{yearNum}</option>
          ))}
        </select>

        <button 
          type="submit" 
          className="bg-verde-agua text-white px-4 py-2 rounded hover:opacity-90"
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Mostrar ventas'}
        </button>
      </form>

      {data.length > 0 ? (
        <div className="w-full h-[calc(100%-120px)] min-h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={data} 
              margin={{ 
                top: 0, 
                right: 10, 
                left: window.innerWidth < 640 ? 20 : 40, 
                bottom: 0 
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="grey"/>
              <XAxis 
                dataKey="date" 
                data={data}
                dy={10}
                tick={{ fontSize: window.innerWidth < 640 ? '0.7rem' : '0.8rem' }}
              />
              <YAxis 
                domain={[0, 'auto']} 
                dx={window.innerWidth < 640 ? -5 : -10}
                tick={{ fontSize: window.innerWidth < 640 ? '0.7rem' : '0.8rem' }}
                tickFormatter={(value) => `$${value.toLocaleString('es-AR')}`}
                />
              <Tooltip formatter={(value) => `$${value.toLocaleString('es-AR')}`} />
              <Line 
                type="monotone" 
                data={data}
                dataKey="total" 
                stroke="#5EA692"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="w-full text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay ventas registradas para el período seleccionado</p>
        </div>
      )}
    </div>
  );
};

export default SalesStats;