import { BaseService } from './base.service';
import { TronWeb } from 'tronweb';
import { ethers } from 'ethers';

export class TronService extends BaseService {
    private tronWeb: any;
    private privateKey: string;

    constructor() {
        super('TronService');
        this.privateKey = process.env.TRON_PRIVATE_KEY || '';
        const fullNode = process.env.TRON_FULL_HOST || 'https://api.nileex.io';
        const apiKey = process.env.TRON_API_KEY || '';

        if (!this.privateKey) {
            throw new Error("TRON_PRIVATE_KEY is missing");
        }

        const options: any = {
            fullHost: fullNode,
            privateKey: this.privateKey
        };

        if (apiKey) {
            options.headers = { "TRON-PRO-API-KEY": apiKey };
        }

        this.tronWeb = new TronWeb(options);
    }

    /**
     * Get Tron Wallet Balance
     * @param address Wallet Address
     */
    async getBalance(address: string) {
        try {
            this.log(`Fetching Tron balance for: ${address}`);
            const balance = await this.tronWeb.trx.getBalance(address);
            return this.successResponse({
                address,
                balance: this.tronWeb.fromSun(balance),
                currency: "TRX"
            }, "Balance retrieved successfully");
        } catch (error) {
            return this.responseError("Failed to get Tron balance", 500, error);
        }
    }

    /**
     * Transfer TRX or TRC20 Token
     * @param to Recipient Address
     * @param amount Amount to transfer
     * @param tokenAddress Optional TRC20 Token Address
     */
    async transfer(to: string, amount: string, tokenAddress?: string) {
        try {
            this.log(`Transferring ${amount} to ${to} on Tron. Token: ${tokenAddress || 'TRX'}`);

            let txId;

            if (tokenAddress) {
                // TRC20 Transfer
                const contract = await this.tronWeb.contract().at(tokenAddress);

                let decimals = 18;
                try {
                    decimals = await contract.decimals().call();
                    if (typeof decimals === 'object' && (decimals as any)._hex) {
                        decimals = parseInt((decimals as any)._hex, 16);
                    }
                } catch (e) {
                    return this.responseError("Failed to get decimals", 500, e);
                }

                const amountBn = ethers.parseUnits(amount, Number(decimals));
                // .send() triggers the transaction
                txId = await contract.transfer(to, amountBn.toString()).send();
            } else {
                // TRX Transfer
                // toSun handles the conversion to 6 decimals
                const amountInSun = this.tronWeb.toSun(amount);
                const result = await this.tronWeb.trx.sendTransaction(to, amountInSun);

                // result can be the transaction object or an object with result: boolean
                if (result.result === true && result.txid) {
                    txId = result.txid;
                } else if (result.txID) {
                    txId = result.txID;
                } else {
                    // Fallback, sometimes it returns the whole tx object
                    txId = result.transaction?.txID || result.txid;
                }
            }

            return this.successResponse({
                txId,
                to,
                amount,
                token: tokenAddress || 'TRX'
            }, "Transfer successful");

        } catch (error) {
            return this.responseError("Transfer failed", 500, error);
        }
    }
}
