// global.d.ts
interface Window {
  ethereum: {
    isConnected: () => boolean
  }
}
