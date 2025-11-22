import { BaseService } from './base.service';
import QRCode from 'qrcode';
import { generate } from "promptparse";
import { formateSecureString } from '../utils/date.util';

export class BankService extends BaseService {
    constructor() {
        super('BankService');
    }

    async getAccountBalance(accountId: string) {
        try {
            this.log(`Fetching balance for account: ${accountId}`);

            // Simulate DB call
            const balance = {
                accountId,
                amount: 1000.00,
                currency: 'THB',
                updatedAt: new Date()
            };

            return balance;
        } catch (error) {
            this.handleError('Failed to get account balance', error);
        }
    }

    async transfer(fromId: string, toId: string, amount: number) {
        try {
            this.log(`Transferring ${amount} from ${fromId} to ${toId}`);
            // Logic here
            return { success: true, transactionId: 'txn_123' };
        } catch (error) {
            this.handleError('Transfer failed', error);
        }
    }

    /**
     * Generate PromptPay QR Code
     * @param amount Amount to receive
     * @param target Mobile number or Tax ID (default: 0812345678 for demo)
     * @param type PromptPay type ('MSISDN' | 'NATID' | 'EWALLETID')
     */
    async generateQr(amount: number, target: string, type: 'MSISDN' | 'NATID' | 'EWALLETID') {
        try {
            this.log(`Generating QR for amount: ${amount}, target: ${target}`);

            const payload = generate.anyId({
                type,
                target,
                amount,
            });

            return {
                type,
                target: formateSecureString(target),
                amount,
                payload,
                qrCode: await QRCode.toDataURL(payload)
            };

        } catch (error) {
            this.handleError('Failed to generate QR Code', error);
        }
    }

    /**
     * Verify Bank Slip (Mock)
     * @param slipData Data from scanned slip or uploaded file
     */
    async verifySlip(slipData: any) {
        try {
            this.log('Verifying slip', slipData);

            // In a real app, you would call a 3rd party API (like Open Bank API) here
            // For demo, we simulate a valid response if amount > 0

            const isValid = slipData?.amount > 0;

            if (!isValid) {
                throw new Error('Invalid slip amount');
            }

            return {
                isValid: true,
                sender: { name: 'John Doe', bank: 'SCB' },
                receiver: { name: 'Shop TNXTO', bank: 'KBANK' },
                amount: slipData.amount || 100,
                transRef: `REF${Date.now()}`,
                timestamp: new Date()
            };
        } catch (error) {
            this.handleError('Slip verification failed', error);
        }
    }
}
