'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowUpDown, Wallet, AlertCircle, Check, Loader2 } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { useBondingCurve } from '@/hooks/useBondingCurve';
import { ethers } from 'ethers';

interface SwapWidgetProps {
  poolAddress: string | null;
  tokenAddress: string | null;
  tokenSymbol: string;
  tokenImage?: string;
}

type SwapDirection = 'buy' | 'sell';

export function SwapWidget({ 
  poolAddress, 
  tokenAddress, 
  tokenSymbol,
  tokenImage 
}: SwapWidgetProps) {
  const [direction, setDirection] = useState<SwapDirection>('buy');
  const [inputAmount, setInputAmount] = useState('');
  const [quote, setQuote] = useState<{ amountOut: string; fee: string } | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);
  const [needsApproval, setNeedsApproval] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<'idle' | 'approving' | 'swapping' | 'success' | 'error'>('idle');

  const { 
    address, 
    isConnected, 
    isConnecting, 
    connect, 
    balance: ethBalance,
    refreshBalance,
    signer,
    getProvider
  } = useWallet();

  const provider = getProvider();

  const {
    isLoading,
    error,
    getBuyQuote,
    getSellQuote,
    buyTokens,
    sellTokens,
    getTokenBalance,
    getTokenAllowance,
    approveTokens,
  } = useBondingCurve(poolAddress, tokenAddress, signer, provider);

  // Load token balance when connected
  useEffect(() => {
    if (address && direction === 'sell') {
      loadTokenBalance();
    }
  }, [address, direction, tokenAddress]);

  // Update quote when input changes
  useEffect(() => {
    if (!inputAmount || parseFloat(inputAmount) <= 0) {
      setQuote(null);
      return;
    }

    const timeout = setTimeout(() => {
      updateQuote();
    }, 300);

    return () => clearTimeout(timeout);
  }, [inputAmount, direction]);

  // Check approval for sell
  useEffect(() => {
    if (direction === 'sell' && address && poolAddress && inputAmount) {
      checkApproval();
    } else {
      setNeedsApproval(false);
    }
  }, [direction, address, poolAddress, inputAmount]);

  const loadTokenBalance = async () => {
    if (!address) return;
    const balance = await getTokenBalance(address);
    setTokenBalance(balance);
  };

  const updateQuote = async () => {
    if (!inputAmount || parseFloat(inputAmount) <= 0) return;

    let newQuote;
    if (direction === 'buy') {
      newQuote = await getBuyQuote(inputAmount);
    } else {
      newQuote = await getSellQuote(inputAmount);
    }
    
    if (newQuote) {
      setQuote(newQuote);
    }
  };

  const checkApproval = async () => {
    if (!address || !poolAddress) return;
    
    const allowance = await getTokenAllowance(address, poolAddress);
    const inputWei = ethers.parseUnits(inputAmount || '0', 18);
    const allowanceWei = ethers.parseUnits(allowance || '0', 18);
    
    setNeedsApproval(allowanceWei < inputWei);
  };

  const handleSwap = async () => {
    if (!inputAmount || !quote) return;

    setTxStatus('swapping');
    setTxHash(null);

    // Apply 1% slippage protection
    const minOutput = parseFloat(quote.amountOut) * 0.99;
    const minOutputStr = minOutput.toFixed(18);

    let hash: string | null;
    
    if (direction === 'buy') {
      hash = await buyTokens(inputAmount, minOutputStr);
    } else {
      hash = await sellTokens(inputAmount, minOutputStr);
    }

    if (hash) {
      setTxHash(hash);
      setTxStatus('success');
      setInputAmount('');
      setQuote(null);
      refreshBalance();
      loadTokenBalance();
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setTxStatus('idle');
      }, 3000);
    } else {
      setTxStatus('error');
    }
  };

  const handleApprove = async () => {
    if (!poolAddress) return;
    
    setTxStatus('approving');
    const hash = await approveTokens(poolAddress, inputAmount);
    
    if (hash) {
      setNeedsApproval(false);
      setTxStatus('idle');
    } else {
      setTxStatus('error');
    }
  };

  const toggleDirection = () => {
    setDirection(prev => prev === 'buy' ? 'sell' : 'buy');
    setInputAmount('');
    setQuote(null);
  };

  const getButtonText = () => {
    if (!isConnected) return 'Connect Wallet';
    if (isConnecting) return 'Connecting...';
    if (txStatus === 'approving') return 'Approving...';
    if (txStatus === 'swapping') return 'Swapping...';
    if (txStatus === 'success') return 'Success!';
    if (txStatus === 'error') return 'Failed - Try Again';
    if (!inputAmount || parseFloat(inputAmount) <= 0) return 'Enter Amount';
    if (needsApproval) return 'Approve Tokens';
    return direction === 'buy' ? `Buy ${tokenSymbol}` : `Sell ${tokenSymbol}`;
  };

  const isButtonDisabled = () => {
    if (!isConnected) return isConnecting;
    if (isLoading || txStatus === 'approving' || txStatus === 'swapping') return true;
    if (!inputAmount || parseFloat(inputAmount) <= 0) return true;
    return false;
  };

  const maxBalance = direction === 'buy' 
    ? ethBalance 
    : tokenBalance;

  return (
    <div className="bg-[#141A22] rounded-2xl border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
            {tokenImage ? (
              <img src={tokenImage} alt={tokenSymbol} className="w-full h-full object-cover" />
            ) : (
              <span className="text-primary text-xs font-bold">{tokenSymbol.slice(0, 2)}</span>
            )}
          </div>
          <div>
            <p className="text-white text-sm font-bold">{tokenSymbol}</p>
            <p className="text-[#A0ABC0] text-xs">Bonding Curve DEX</p>
          </div>
        </div>
        {isConnected && (
          <button
            onClick={refreshBalance}
            className="text-[#A0ABC0] hover:text-white text-xs transition-colors"
          >
            Refresh
          </button>
        )}
      </div>

      {/* Swap Direction Toggle */}
      <div className="px-4 py-3">
        <div className="bg-[#0C1014] rounded-lg p-1 flex">
          <button
            onClick={() => setDirection('buy')}
            className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
              direction === 'buy'
                ? 'bg-primary text-black'
                : 'text-[#A0ABC0] hover:text-white'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setDirection('sell')}
            className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
              direction === 'sell'
                ? 'bg-primary text-black'
                : 'text-[#A0ABC0] hover:text-white'
            }`}
          >
            Sell
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="px-4 pb-3">
        <div className="bg-[#0C1014] rounded-xl p-4 border border-white/5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#A0ABC0] text-xs font-medium uppercase tracking-wider">
              {direction === 'buy' ? 'Pay (ETH)' : 'Pay (' + tokenSymbol + ')'}
            </span>
            {isConnected && maxBalance && (
              <button
                onClick={() => setInputAmount(maxBalance)}
                className="text-primary text-xs font-medium hover:text-white transition-colors"
              >
                Max: {parseFloat(maxBalance).toFixed(4)}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1 bg-transparent text-white text-2xl font-bold outline-none placeholder:text-[#A0ABC0]/50"
            />
            <div className="flex items-center gap-2 bg-[#141A22] px-3 py-1.5 rounded-lg">
              {direction === 'buy' ? (
                <>
                  <span className="text-white text-sm font-bold">ETH</span>
                </>
              ) : (
                <>
                  <span className="text-white text-sm font-bold">{tokenSymbol}</span>
                </>
              )}
            </div>
          </div>
          {isConnected && !ethBalance && direction === 'buy' && (
            <p className="text-red-400 text-xs mt-2">Insufficient ETH balance</p>
          )}
        </div>

        {/* Swap Arrow */}
        <div className="flex justify-center -my-2 relative z-10">
          <button
            onClick={toggleDirection}
            className="bg-[#141A22] border border-white/10 rounded-full p-2 hover:border-primary/50 transition-colors"
          >
            <ArrowUpDown size={16} className="text-[#A0ABC0]" />
          </button>
        </div>

        {/* Output Section */}
        <div className="bg-[#0C1014] rounded-xl p-4 border border-white/5 mt-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#A0ABC0] text-xs font-medium uppercase tracking-wider">
              {direction === 'buy' ? 'Receive (' + tokenSymbol + ')' : 'Receive (ETH)'}
            </span>
            {quote && (
              <span className="text-[#A0ABC0] text-xs">
                Fee: {parseFloat(quote.fee).toFixed(6)} {direction === 'buy' ? 'ETH' : 'ETH'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={quote ? parseFloat(quote.amountOut).toFixed(6) : ''}
              readOnly
              placeholder="0.0"
              className="flex-1 bg-transparent text-white text-2xl font-bold outline-none placeholder:text-[#A0ABC0]/50"
            />
            <div className="flex items-center gap-2 bg-[#141A22] px-3 py-1.5 rounded-lg">
              <span className="text-white text-sm font-bold">
                {direction === 'buy' ? tokenSymbol : 'ETH'}
              </span>
            </div>
          </div>
          {quote && (
            <p className="text-[#A0ABC0] text-xs mt-2">
              1% slippage tolerance applied
            </p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 pb-3">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-red-400 text-xs">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {txStatus === 'success' && txHash && (
        <div className="px-4 pb-3">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-start gap-2">
            <Check size={16} className="text-green-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-green-400 text-xs font-medium">Transaction successful!</p>
              <a
                href={`https://basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-xs hover:underline"
              >
                View on Basescan →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="px-4 pb-4">
        {!isConnected ? (
          <button
            onClick={connect}
            disabled={isConnecting}
            className="w-full bg-primary text-black font-bold py-3 rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <Wallet size={18} />
            {getButtonText()}
          </button>
        ) : needsApproval ? (
          <button
            onClick={handleApprove}
            disabled={isButtonDisabled()}
            className="w-full bg-primary text-black font-bold py-3 rounded-xl hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {txStatus === 'approving' ? (
              <Loader2 size={18} className="animate-spin" />
            ) : null}
            {getButtonText()}
          </button>
        ) : (
          <button
            onClick={handleSwap}
            disabled={isButtonDisabled()}
            className={`w-full font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
              txStatus === 'success'
                ? 'bg-green-500 text-black'
                : txStatus === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-primary text-black hover:brightness-110'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {(txStatus === 'swapping' || isLoading) && (
              <Loader2 size={18} className="animate-spin" />
            )}
            {getButtonText()}
          </button>
        )}
      </div>

      {/* Disclaimer */}
      <div className="px-4 pb-4">
        <p className="text-[10px] text-zinc-600 text-center uppercase font-bold tracking-[0.1em]">
          Trading carries risk. Prices on bonding curves change based on liquidity.
        </p>
      </div>
    </div>
  );
}
