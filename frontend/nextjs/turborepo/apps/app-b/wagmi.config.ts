import {
  Config,
  cookieStorage,
  createConfig,
  createStorage,
  http,
} from "wagmi";
import { mainnet } from "wagmi/chains";

export const WagmiConfig: Config = createConfig({
  chains: [mainnet],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [mainnet.id]: http(),
  },
  multiInjectedProviderDiscovery: true,
});
