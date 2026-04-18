# x402-express 🚀

[English](#english) | [Español](#español) | [中文](#中文)

---

<a name="english"></a>
## 🇺🇸 English: The M2MCent SDK for Node.js
Instantly monetize any API or MCP (Machine Context Protocol) Server into a micro-SaaS using the `x402` standard. Collect **USDC** micropayments (Base Mainnet) directly from other AI Agents, in a decentralized and **gasless** way (EIP-3009).

### ⚡ Quick Start
```bash
npm install x402-express ethers
```

```javascript
const express = require('express');
const X402Wrapper = require('x402-express');
const app = express();

// 1. Initialize the Wrapper
const x402 = new X402Wrapper({
    rpcUrl: "https://mainnet.base.org",
    privateKey: process.env.RELAYER_PRIVATE_KEY, // Your key to pay for Base network gas
    recipient: process.env.MY_WALLET_ADDRESS    // Your wallet where earnings will be deposited
});

// 2. Protect any endpoint (e.g. 20000 = $0.02)
app.get('/api/premium-data', x402.requirePayment("20000"), (req, res) => {
    // If it reaches here, the payment was already settled on-chain!
    res.json({ success: true, data: "Premium data delivered." });
});

app.listen(3000, () => console.log('Monetized API running on port 3000'));
```

---

<a name="español"></a>
## 🇪🇸 Español: SDK de M2MCent para Node.js
Convierte cualquier API o Servidor MCP en un micro-SaaS monetizado al instante con el estándar `x402`. Cobra micropagos en **USDC** (Base Mainnet) directamente de otros Agentes de IA, de forma descentralizada y **gasless** (EIP-3009). El cliente firma, el servidor liquida.

### 🧠 ¿Cómo funciona?
1. Un cliente solicita `/api/premium-data`.
2. El middleware responde con `402 Payment Required` y emite los metadatos x402.
3. El Agente del cliente firma criptográficamente una autorización (EIP-712).
4. El servidor liquida automáticamente el pago en Base Mainnet y entrega los datos.

---

<a name="中文"></a>
## 🇨🇳 中文: M2MCent Node.js SDK
利用 `x402` 标准，立即将任何 API 或 MCP（机器上下文协议）服务器转变为盈利的微型 SaaS。通过去中心化且**无 Gas**的方式 (EIP-3009)，直接从其他 AI 代理收取 **USDC** 微支付（Base 主网）。

### 🛠 Prerequisites / Requisitos / 要求
- **ETH on Base**: Your `RELAYER_PRIVATE_KEY` needs a small amount of ETH on Base Mainnet to cover minimal gas fees. **Your customers pay zero gas.**
- **USDC**: Settlements are processed exclusively in USDC on Base.
