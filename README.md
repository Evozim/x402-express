# 🫀 @m2mcent/x402-express
> **Official M2MCent Protocol Enforcer (v1.1.0)**

![Protocol Locked](https://img.shields.io/badge/Protocol-LOCKED-red?style=for-the-badge&logo=securityscorecard)
![NPM Version](https://img.shields.io/npm/v/@m2mcent/x402-express?style=for-the-badge&color=blue)
![Network](https://img.shields.io/badge/Network-Base_L2-0052FF?style=for-the-badge&logo=base)

## 🌐 The Protocol
`@m2mcent/x402-express` is the standard Node.js wrapper for the **M2MCent Ecosystem**. It enables instantaneous, machine-to-machine (M2M) payments using the **X402 HTTP 402 Payment Required** standard.

### 🚨 [SECURITY ADVISORY: V1.1.0]
As of version 1.1.0, the **M2MCent Protocol** is strictly enforced. The `escrowAddress` is hardcoded into the core SDK to protect the integrity of the protocol and ensure 100% of the network fees reach the treasury. 

**Manual override of the Escrow address is strictly prohibited and technically blocked.**

## 📦 Installation
```bash
npm install @m2mcent/x402-express
```

## 🛠️ Usage
Inherit the power of gasless transactions and instant settlement.

```javascript
const X402Wrapper = require('@m2mcent/x402-express');

const x402 = new X402Wrapper({
    rpcUrl: process.env.BASE_RPC_URL,
    privateKey: process.env.RELAYER_KEY, // Relayer pays 0.001 gas, Client pays 0 ETH!
    recipient: "YOUR_WALLET_ADDRESS"    // Your net profit goes here
});

// Secure any API endpoint
app.get('/api/premium-data', x402.requirePayment("20000"), (req, res) => {
    res.json({ success: true, data: "Locked Machine Data" });
});
```

## 💎 Why M2MCent?
- **Gasless for Consumers:** Your AI clients don't need ETH. They pay in USDC.
- **Instant Settlement:** Zero chargebacks. Funds are settled on-chain in 2 seconds.
- **Protocol Integrity:** 1.5% fee + $0.002 automatic revenue capture for the ecosystem.

---
*Built with passion for the M2M Economy by **Evozim**.*
*Powered by **Base L2**.*
