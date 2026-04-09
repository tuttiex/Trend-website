'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { DEFAULT_CHAIN } from '@/lib/contracts';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: number | null;
  balance: string | null;
  error: string | null;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    chainId: null,
    balance: null,
    error: null,
  });
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);

  const getProvider = useCallback(() => {
    if (typeof window === 'undefined' || !window.ethereum) {
      return null;
    }
    return new ethers.BrowserProvider(window.ethereum);
  }, []);

  const updateSigner = useCallback(async () => {
    const provider = getProvider();
    if (!provider || !state.isConnected) {
      setSigner(null);
      return;
    }
    try {
      const newSigner = await provider.getSigner();
      setSigner(newSigner);
    } catch {
      setSigner(null);
    }
  }, [getProvider, state.isConnected]);

  const checkConnection = useCallback(async () => {
    const provider = getProvider();
    if (!provider) return;

    try {
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        const address = accounts[0].address;
        const network = await provider.getNetwork();
        const balance = await provider.getBalance(address);
        
        setState(prev => ({
          ...prev,
          address,
          isConnected: true,
          chainId: Number(network.chainId),
          balance: ethers.formatEther(balance),
        }));
      }
    } catch (err) {
      console.error('Error checking wallet connection:', err);
    }
  }, [getProvider]);

  const connect = useCallback(async () => {
    const provider = getProvider();
    if (!provider) {
      setState(prev => ({ ...prev, error: 'MetaMask not installed' }));
      return;
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(address);

      setState({
        address,
        isConnected: true,
        isConnecting: false,
        chainId: Number(network.chainId),
        balance: ethers.formatEther(balance),
        error: null,
      });
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: err.message || 'Failed to connect wallet',
      }));
    }
  }, [getProvider]);

  // Update signer when connection changes
  useEffect(() => {
    updateSigner();
  }, [updateSigner]);

  const disconnect = useCallback(() => {
    setState({
      address: null,
      isConnected: false,
      isConnecting: false,
      chainId: null,
      balance: null,
      error: null,
    });
  }, []);

  const switchChain = useCallback(async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${DEFAULT_CHAIN.id.toString(16)}` }],
      });
    } catch (switchError: any) {
      // Chain not added, try adding it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${DEFAULT_CHAIN.id.toString(16)}`,
              chainName: DEFAULT_CHAIN.name,
              rpcUrls: [DEFAULT_CHAIN.rpcUrl],
              nativeCurrency: DEFAULT_CHAIN.nativeCurrency,
            }],
          });
        } catch (addError) {
          console.error('Error adding chain:', addError);
        }
      }
    }
  }, []);

  const refreshBalance = useCallback(async () => {
    const provider = getProvider();
    if (!provider || !state.address) return;

    try {
      const balance = await provider.getBalance(state.address);
      setState(prev => ({
        ...prev,
        balance: ethers.formatEther(balance),
      }));
    } catch (err) {
      console.error('Error refreshing balance:', err);
    }
  }, [getProvider, state.address]);

  useEffect(() => {
    checkConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          checkConnection();
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, [checkConnection, disconnect]);

  return {
    ...state,
    connect,
    disconnect,
    switchChain,
    refreshBalance,
    signer,
    getProvider,
  };
}
