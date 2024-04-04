import { cookieStorage, createConfig, createStorage, http } from "wagmi"
import { mainnet } from "wagmi/chains"

export const wagmiConfig = createConfig({
  chains: [mainnet],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [mainnet.id]: http(),
  },
  multiInjectedProviderDiscovery: true,
})
