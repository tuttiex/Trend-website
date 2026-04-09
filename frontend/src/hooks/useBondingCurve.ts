'use client';

import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { BONDING_CURVE_DEX_ABI, ERC20_ABI } from '@/lib/contracts';

interface SwapQuote {
  amountOut: string;
  fee: string;
  slippage: number;
}

interface PoolInfo {
  tokenReserve: string;
  ethReserve: string;
  swapFeeBps: number;
  price: string;
}

export function useBondingCurve(
  poolAddress: string | null,
  tokenAddress: string | null,
  signer: ethers.JsonRpcSigner | null,
  provider: ethers.BrowserProvider | null
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPoolContract = useCallback(() => {
    if (!poolAddress || !signer) return null;
    return new ethers.Contract(poolAddress, BONDING_CURVE_DEX_ABI, signer);
  }, [poolAddress, signer]);

  const getTokenContract = useCallback(() => {
    if (!tokenAddress || !signer) return null;
    return new ethers.Contract(tokenAddress, ERC20_ABI, signer);
  }, [tokenAddress, signer]);

  // Get pool information
  const getPoolInfo = useCallback(async (): Promise<PoolInfo | null> => {
    const contract = getPoolContract();
    if (!contract || !provider) return null;

    setIsLoading(true);
    setError(null);

    try {
      const poolContract = new ethers.Contract(poolAddress!, BONDING_CURVE_DEX_ABI, provider);
      const [tokenReserve, ethReserve, swapFeeBps, price] = await Promise.all([
        poolContract.tokenReserve(),
        poolContract.ethReserve(),
        poolContract.swapFeeBps(),
        poolContract.getPrice(),
      ]);

      return {
        tokenReserve: ethers.formatUnits(tokenReserve, 18),
        ethReserve: ethers.formatEther(ethReserve),
        swapFeeBps: Number(swapFeeBps),
        price: ethers.formatEther(price),
      };
    } catch (err: any) {
      setError(err.message || 'Failed to get pool info');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [poolAddress, provider, getPoolContract]);

  // Get buy quote (ETH → Tokens)
  const getBuyQuote = useCallback(async (ethAmount: string): Promise<SwapQuote | null> => {
    const contract = getPoolContract();
    if (!contract) return null;

    setIsLoading(true);
    setError(null);

    try {
      const ethAmountWei = ethers.parseEther(ethAmount);
      const [tokensOut, fee] = await contract.getTokensOut(ethAmountWei);

      return {
        amountOut: ethers.formatUnits(tokensOut, 18),
        fee: ethers.formatEther(fee),
        slippage: 0.7, // Fixed fee from contract
      };
    } catch (err: any) {
      setError(err.message || 'Failed to get quote');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getPoolContract]);

  // Get sell quote (Tokens → ETH)
  const getSellQuote = useCallback(async (tokenAmount: string): Promise<SwapQuote | null> => {
    const contract = getPoolContract();
    if (!contract) return null;

    setIsLoading(true);
    setError(null);

    try {
      const tokenAmountWei = ethers.parseUnits(tokenAmount, 18);
      const [ethOut, fee] = await contract.getEthOut(tokenAmountWei);

      return {
        amountOut: ethers.formatEther(ethOut),
        fee: ethers.formatEther(fee),
        slippage: 0.7,
      };
    } catch (err: any) {
      setError(err.message || 'Failed to get quote');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getPoolContract]);

  // Buy tokens (ETH → Tokens)
  const buyTokens = useCallback(async (
    ethAmount: string,
    minTokensOut: string
  ): Promise<string | null> => {
    const contract = getPoolContract();
    if (!contract) {
      setError('Contract not initialized');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const ethAmountWei = ethers.parseEther(ethAmount);
      const minTokensOutWei = ethers.parseUnits(minTokensOut, 18);

      const tx = await contract.buyTokens(minTokensOutWei, {
        value: ethAmountWei,
      });

      const receipt = await tx.wait();
      return receipt.hash;
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getPoolContract]);

  // Get token balance
  const getTokenBalance = useCallback(async (userAddress: string): Promise<string | null> => {
    const contract = getTokenContract();
    if (!contract) return null;

    try {
      const balance = await contract.balanceOf(userAddress);
      const decimals = await contract.decimals();
      return ethers.formatUnits(balance, decimals);
    } catch (err: any) {
      console.error('Error getting token balance:', err);
      return null;
    }
  }, [getTokenContract]);

  // Get token allowance
  const getTokenAllowance = useCallback(async (
    ownerAddress: string,
    spenderAddress: string
  ): Promise<string | null> => {
    const contract = getTokenContract();
    if (!contract) return null;

    try {
      const allowance = await contract.allowance(ownerAddress, spenderAddress);
      return ethers.formatUnits(allowance, 18);
    } catch (err: any) {
      console.error('Error getting allowance:', err);
      return null;
    }
  }, [getTokenContract]);

  // Approve token spending
  const approveTokens = useCallback(async (
    spenderAddress: string,
    amount: string
  ): Promise<string | null> => {
    const contract = getTokenContract();
    if (!contract) {
      setError('Token contract not initialized');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const amountWei = ethers.parseUnits(amount, 18);
      const tx = await contract.approve(spenderAddress, amountWei);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (err: any) {
      setError(err.message || 'Approval failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getTokenContract]);

  // Sell tokens (Tokens → ETH)
  const sellTokens = useCallback(async (
    tokenAmount: string,
    minEthOut: string
  ): Promise<string | null> => {
    const contract = getPoolContract();
    if (!contract) {
      setError('Pool contract not initialized');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const tokenAmountWei = ethers.parseUnits(tokenAmount, 18);
      const minEthOutWei = ethers.parseEther(minEthOut);

      const tx = await contract.sellTokens(tokenAmountWei, minEthOutWei);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getPoolContract]);

  return {
    isLoading,
    error,
    getPoolInfo,
    getBuyQuote,
    getSellQuote,
    buyTokens,
    sellTokens,
    getTokenBalance,
    getTokenAllowance,
    approveTokens,
  };
}
