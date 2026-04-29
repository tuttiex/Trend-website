'use client';

import { useState } from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';
import { usePriceHistory, CandleData } from '@/hooks/usePriceHistory';

interface CandlestickChartProps {
  tokenAddress: string | null;
  poolAddress: string | null;
  tokenSymbol: string;
}

const TIMEFRAMES = [
  { label: '1H', value: '1h' },
  { label: '4H', value: '4h' },
  { label: '1D', value: '1d' }
];

export function CandlestickChart({ tokenAddress, poolAddress, tokenSymbol }: CandlestickChartProps) {
  const [timeframe, setTimeframe] = useState('1h');
  const { candles, loading, error, refetch } = usePriceHistory(tokenAddress);

  // Transform candles for Recharts - calculate wicks and body
  const chartData = candles.map((candle) => {
    const open = parseFloat(candle.open);
    const close = parseFloat(candle.close);
    const high = parseFloat(candle.high);
    const low = parseFloat(candle.low);
    const volume = parseFloat(candle.volume);
    
    const isGreen = close >= open;
    const bodyTop = isGreen ? close : open;
    const bodyBottom = isGreen ? open : close;
    
    return {
      time: new Date(candle.time).toLocaleDateString() + ' ' + new Date(candle.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      high,
      low,
      open,
      close,
      bodyTop,
      bodyBottom,
      bodyHeight: Math.abs(close - open),
      wickTop: high - bodyTop,
      wickBottom: bodyBottom - low,
      volume,
      isGreen
    };
  });

  const currentPrice = chartData.length > 0 ? chartData[chartData.length - 1].close : null;
  const priceChange = chartData.length > 1 
    ? ((chartData[chartData.length - 1].close - chartData[0].open) / chartData[0].open * 100)
    : 0;

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 h-[400px] flex items-center justify-center">
        <div className="text-gray-400">Loading chart data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 h-[400px] flex flex-col items-center justify-center gap-4">
        <div className="text-red-400">{error}</div>
        <button 
          onClick={() => refetch(timeframe)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 h-[400px] flex flex-col items-center justify-center gap-4">
        <div className="text-gray-400">No chart data available</div>
        <div className="text-sm text-gray-500">
          Price snapshots will be available once the agent starts pushing data
        </div>
      </div>
    );
  }

  const minPrice = Math.min(...chartData.map(d => d.low));
  const maxPrice = Math.max(...chartData.map(d => d.high));
  const priceRange = maxPrice - minPrice;
  const yDomain = [minPrice - priceRange * 0.1, maxPrice + priceRange * 0.1];

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{tokenSymbol}/ETH</h3>
          {currentPrice && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl font-bold text-white">{currentPrice.toFixed(8)} ETH</span>
              <span className={`text-sm ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
              </span>
            </div>
          )}
        </div>
        
        {/* Timeframe selector */}
        <div className="flex bg-gray-800 rounded-lg p-1">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.value}
              onClick={() => {
                setTimeframe(tf.value);
                refetch(tf.value);
              }}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeframe === tf.value 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis 
              dataKey="time" 
              stroke="#6B7280"
              tick={{ fill: '#6B7280', fontSize: 10 }}
              tickMargin={10}
              minTickGap={30}
            />
            <YAxis 
              domain={yDomain}
              stroke="#6B7280"
              tick={{ fill: '#6B7280', fontSize: 10 }}
              tickFormatter={(value) => value.toFixed(6)}
              orientation="right"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
                      <div className="text-gray-400 text-xs mb-2">{data.time}</div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        <span className="text-gray-500">Open:</span>
                        <span className={data.isGreen ? 'text-green-400' : 'text-red-400'}>{data.open.toFixed(8)}</span>
                        <span className="text-gray-500">High:</span>
                        <span className="text-gray-300">{data.high.toFixed(8)}</span>
                        <span className="text-gray-500">Low:</span>
                        <span className="text-gray-300">{data.low.toFixed(8)}</span>
                        <span className="text-gray-500">Close:</span>
                        <span className={data.isGreen ? 'text-green-400' : 'text-red-400'}>{data.close.toFixed(8)}</span>
                        <span className="text-gray-500">Volume:</span>
                        <span className="text-gray-300">{data.volume.toFixed(4)} ETH</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            
            {/* Candlestick bodies */}
            <Bar dataKey="bodyHeight" stackId="body">
              {chartData.map((entry, index) => (
                <Cell 
                  key={`body-${index}`} 
                  fill={entry.isGreen ? '#10B981' : '#EF4444'}
                  stroke={entry.isGreen ? '#10B981' : '#EF4444'}
                  strokeWidth={1}
                />
              ))}
            </Bar>
            
            {/* Upper wicks */}
            <Bar dataKey="wickTop" stackId="body" fill="transparent">
              {chartData.map((entry, index) => (
                <Cell 
                  key={`wick-top-${index}`}
                  fill={entry.isGreen ? '#10B981' : '#EF4444'}
                />
              ))}
            </Bar>
            
            {/* Lower wicks - using a separate bar */}
            <Bar dataKey="wickBottom" fill="transparent">
              {chartData.map((entry, index) => (
                <Cell 
                  key={`wick-bottom-${index}`}
                  fill={entry.isGreen ? '#10B981' : '#EF4444'}
                />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Bullish</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Bearish</span>
        </div>
        <div>
          {chartData.length} data points
        </div>
      </div>
    </div>
  );
}
