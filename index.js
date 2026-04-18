const { ethers } = require('ethers');

class X402Wrapper {
    /**
     * @param {Object} config - Configuración del Gateway M2MCent
     * @param {string} config.rpcUrl - URL del nodo RPC (ej. "https://mainnet.base.org")
     * @param {string} config.privateKey - Llave privada del Relayer/Servidor (para costear el gas)
     * @param {string} config.recipient - Billetera del creador de la API que recibirá el neto
     * @param {string} [config.escrowAddress] - Opcional. Por defecto: Mainnet Escrow
     * @param {string} [config.usdcAddress] - Opcional. Por defecto: Mainnet USDC
     * @param {number} [config.chainId] - Opcional. Por defecto: 8453
     */
    constructor(config) {
        if (!config.privateKey || !config.recipient) {
            throw new Error("x402-express: privateKey y recipient son obligatorios.");
        }
        
        this.rpcUrl = config.rpcUrl || "https://mainnet.base.org";
        this.chainId = config.chainId || 8453;
        this.recipient = config.recipient;
        
        // PROTOCOL LOCK: Este SDK es exclusivo del ecosistema M2MCent.
        // El contrato de Escrow está blindado para asegurar la arquitectura de pagos atómicos.
        this.escrowAddress = "0xf3c3416A843d13C944554A54Ac274BB7fF264BcC";
        this.usdcAddress = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
        
        this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
        this.wallet = new ethers.Wallet(config.privateKey, this.provider);
        
        const EscrowABI = [
            "function settle(address from, address to, uint256 amount, uint256 validAfter, uint256 validBefore, bytes32 nonce, uint8 v, bytes32 r, bytes32 s) external"
        ];
        this.escrow = new ethers.Contract(this.escrowAddress, EscrowABI, this.wallet);
    }

    /**
     * Middleware Express para proteger un endpoint con precio x402.
     * @param {string} amountRaw - Precio en unidades crudas de USDC (ej. "20000" para $0.02)
     */
    requirePayment(amountRaw) {
        return async (req, res, next) => {
            const signatureHeader = req.headers['payment-signature'];
            
            // 1. Handshake Inicial (Emisión de 402)
            if (!signatureHeader) {
                const metadata = {
                    network: `eip155:${this.chainId}`,
                    contract: this.usdcAddress,
                    escrow: this.escrowAddress,
                    recipient: this.recipient,
                    amountRaw: amountRaw
                };
                const metadataB64 = Buffer.from(JSON.stringify(metadata)).toString('base64');
                res.setHeader('Payment-Required', metadataB64);
                return res.status(402).json({
                    error: "Payment Required via x402",
                    details: metadata
                });
            }

            // 2. Liquidación Automática (Recepción del Payload de Pago)
            try {
                // Expected format: Base64 JSON containing { from, validAfter, validBefore, nonce, signature }
                const payloadJson = Buffer.from(signatureHeader, 'base64').toString('utf8');
                const paymentPayload = JSON.parse(payloadJson);
                
                const { from, validAfter, validBefore, nonce, signature } = paymentPayload;
                
                if (!from || !nonce || !signature) {
                    return res.status(400).json({ error: "Faltan parámetros en el payload x402." });
                }

                const sig = ethers.Signature.from(signature);

                // Submission to Base Mainnet
                console.log(`[x402-express] Liquidando pago de ${amountRaw} USDC del cliente ${from}...`);
                const tx = await this.escrow.settle(
                    from,
                    this.recipient, // El neto va directo a tu billetera
                    amountRaw,
                    validAfter,
                    validBefore,
                    nonce,
                    sig.v,
                    sig.r,
                    sig.s
                );
                
                // Esperamos confirmación para garantizar la entrega atómica de valor antes de la data
                const receipt = await tx.wait();
                console.log(`[x402-express] Liquidación Exitosa! Tx Hash: ${receipt.hash}`);
                
                // Exponemos el TX hash al endpoint por si quiere emitir un recibo
                req.paymentTx = receipt.hash;
                
                next(); // Pasa el control a tu endpoint original
            } catch (err) {
                console.error("[x402-express] Error de Liquidación On-Chain:", err.message);
                return res.status(403).json({ 
                    error: "Liquidación fallida. Revisa el balance de USDC o el log del contrato.", 
                    details: err.message 
                });
            }
        };
    }
}

module.exports = X402Wrapper;
