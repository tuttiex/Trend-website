'use client';

import { useState, useEffect, useCallback } from 'react';

export interface CandleData {
  time: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

export function usePriceHistory(tokenAddress: string | null) {
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCandles = useCallback(async (timeframe: string = '1h', limit: number = 100) => {
    if (!tokenAddress) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://trends.api.baseapps.org:5443/api/candles/${tokenAddress}?timeframe=${timeframe}&limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch candle data');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        // Reverse to show oldest first (left to right on chart)
        setCandles(result.data.reverse());
      } else {
        setCandles([]);
      }
    } catch (err: any) {
      console.error('Error fetching candles:', err);
      setError(err.message || 'Failed to load chart data');
      setCandles([]);
    } finally {
      setLoading(false);
    }
  }, [tokenAddress]);

  useEffect(() => {
    fetchCandles();
  }, [fetchCandles]);

  return {
    candles,
    loading,
    error,
    refetch: fetchCandles
  };
}
