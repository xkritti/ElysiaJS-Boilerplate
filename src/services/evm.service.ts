import { BaseService } from './base.service';
import { ethers } from 'ethers';

export class EvmService extends BaseService {
    private privateKey: string;
    private alchemyKey: string;

    constructor() {
        super('EvmService');
        this.privateKey = process.env.EVM_PRIVATE_KEY || '';
        this.alchemyKey = process.env.ALCHEMY_KEY || '';
        if (!this.privateKey) {
            throw new Error("EVM_PRIVATE_KEY is missing");
        }
        if (!this.alchemyKey) {
            throw new Error("ALCHEMY_KEY is missing");
        }
    }

    private getProvider(chain: string) {
        const chains: { [key: string]: string } = {
            'eth': 'https://eth-mainnet.g.alchemy.com/v2/',
            'bep': 'https://bnb-mainnet.g.alchemy.com/v2/',
            'optimism': 'https://opt-mainnet.g.alchemy.com/v2/',
            'etn-testnet': 'https://eth-sepolia.g.alchemy.com/v2/',
            'bep-testnet': 'https://bnb-testnet.g.alchemy.com/v2/',
            'optimism-testnet': 'https://opt-sepolia.g.alchemy.com/v2/'
        };

        const url = chains[chain.toLowerCase()] + this.alchemyKey;
        if (!url) {
            if (chain.startsWith('http')) return new ethers.JsonRpcProvider(chain);
            throw new Error(`Unsupported chain: ${chain}`);
        }

        return new ethers.JsonRpcProvider(url);
    }

    /**
     * Get EVM Wallet Balance
     * @param address Wallet Address
     * @param chain Chain identifier (eth, bsc, polygon)
     */

    async getBalance(address: string, chain: string = 'eth') {
        try {
            this.log(`Fetching EVM balance for: ${address} on ${chain}`);
            const provider = this.getProvider(chain);
            const balance = await provider.getBalance(address);

            return this.successResponse({
                address,
                balance: ethers.formatEther(balance),
                chain,
                currency: "Native"
            }, "Balance retrieved successfully");
        } catch (error) {
            return this.responseError("Failed to get EVM balance", 500, error);
        }
    }

    /**
     * Transfer Native Coin or ERC20 Token
     * @param chain Chain identifier (eth, bsc, polygon)
     * @param to Recipient Address
     * @param amount Amount to transfer
     * @param tokenAddress Optional ERC20 Token Address
     */
    async transfer(chain: string, to: string, amount: string, tokenAddress?: string) {
        try {
            this.log(`Transferring ${amount} to ${to} on ${chain}. Token: ${tokenAddress || 'Native'}`);

            if (!this.privateKey) {
                throw new Error("EVM_PRIVATE_KEY is missing");
            }

            const provider = this.getProvider(chain);
            const wallet = new ethers.Wallet(this.privateKey, provider);

            let tx;
            if (tokenAddress) {
                // ERC20 Transfer
                const abi = [
                    "function transfer(address to, uint256 amount) returns (bool)",
                    "function decimals() view returns (uint8)"
                ];
                const contract = new ethers.Contract(tokenAddress, abi, wallet);

                let decimals = 18;
                try {
                    decimals = await contract.decimals();
                } catch (e) {
                    this.log("Could not fetch decimals, defaulting to 18");
                }

                const amountBn = ethers.parseUnits(amount, decimals);
                tx = await contract.transfer(to, amountBn);
            } else {
                // Native Transfer
                tx = await wallet.sendTransaction({
                    to,
                    value: ethers.parseEther(amount)
                });
            }

            return this.successResponse({
                txHash: tx.hash,
                to,
                amount,
                chain,
                token: tokenAddress || 'Native'
            }, "Transfer initiated");

        } catch (error) {
            return this.responseError("Transfer failed", 500, error);
        }
    }
}
