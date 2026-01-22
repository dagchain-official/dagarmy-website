import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { arbitrum, mainnet, polygon, base, optimism } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// 1. Get projectId from https://cloud.reown.com
const projectId = '285b799f9c4339cca03ed377a49e56ba'

// 2. Create a metadata object - optional
const metadata = {
  name: 'DAGARMY',
  description: 'Master AI, Blockchain & Data Visualization - Join the Global Army of Vibe Coders',
  url: 'https://www.dagarmy.network',
  icons: ['https://www.dagarmy.network/icon.png']
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
    socials: ['google', 'x', 'github', 'discord', 'apple', 'facebook'],
    emailShowWallets: true
  },
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#7C3AED',
    '--w3m-border-radius-master': '8px'
  }
})

export const config = wagmiAdapter.wagmiConfig

// Make modal available globally for client components
if (typeof window !== 'undefined') {
  window.modal = modal
}
