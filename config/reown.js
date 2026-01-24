import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { arbitrum, mainnet, polygon, base, optimism } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// 1. Get projectId from https://cloud.reown.com
const projectId = 'ba3751e293e717d7fd71426e6c862e79'

// 2. Create a metadata object - optional
const metadata = {
  name: 'DAGARMY',
  description: 'Master AI, Blockchain & Data Visualization - Join the Global Army of Vibe Coders',
  url: 'https://dagarmy-website-8d8b5ce-vinod-kumars-projects-8d8e52ce.vercel.app',
  icons: ['https://dagarmy-website-8d8b5ce-vinod-kumars-projects-8d8e52ce.vercel.app/icon.png']
}

// 3. Set the networks
const networks = [mainnet, arbitrum, polygon, base, optimism]

// 4. Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
})

// 5. Create modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true,
    email: true,
    socials: ['google', 'apple', 'facebook'], // Only Google, Apple, Facebook
    emailShowWallets: false,
    allWallets: false,
    collapseWallets: true,
    connectMethodsOrder: ['email', 'social'],
    onramp: false,
    swaps: false,
    smartSessions: false
  },
  enableWallets: false, // Disable wallet connections entirely
  themeMode: 'light',
  themeVariables: {
    '--w3m-font-family': 'Inter, sans-serif',
    '--w3m-accent': '#3B82F6',
    '--w3m-border-radius-master': '12px',
    '--w3m-color-mix': '#FFFFFF',
    '--w3m-color-mix-strength': 10
  }
})

export const config = wagmiAdapter.wagmiConfig

// Make modal available globally for client components
if (typeof window !== 'undefined') {
  window.modal = modal
}
