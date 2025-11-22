import { BaseService } from './base.service';
import QRCode from 'qrcode';
import { formateSecureString } from '../utils/date.util';
import { scanQrCodeFromBuffer } from '../utils/qr.util';
import { generate, parse, validate } from 'promptparse';

export class BankService extends BaseService {
    constructor() {
        super('BankService');
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

            return this.successResponse({
                type,
                target: formateSecureString(target),
                amount,
                payload,
                qrCode: await QRCode.toDataURL(payload)
            }, "QR Code generated successfully");

        } catch (error) {
            return this.responseError("Failed to generate QR Code", 400, error);
        }
    }

    /**
     * Verify Slip from Image
     * @param file Image file
     * @param amount Expected amount (optional)
     */
    async verifySlipImage(file: Blob) {
        try {
            const buffer = Buffer.from(await file.arrayBuffer());

            // Check if buffer is valid
            if (!buffer || buffer.length === 0) {
                return this.responseError("Invalid image file", 400, Error("Invalid image file"));
            }

            const qrData = await scanQrCodeFromBuffer(buffer);
            if (!qrData) {
                return this.responseError("No QR code found or unable to decode data", 400, Error("No QR code found or unable to decode data"));
            }

            this.log(`QR Data: ${qrData}`);

            // Check if it is a Payment QR (PromptPay)
            if (qrData.startsWith('000201')) {
                return this.responseError("This is a Payment QR (PromptPay), not a Bank Transfer Slip.", 400, Error("Detected Payment QR instead of Slip QR"));
            }

            // @ts-ignore
            const slipData = validate.slipVerify(qrData);
            if (!slipData) {
                return this.responseError("The QR code is not a valid Bank Slip.", 400, Error("Invalid slip verify QR payload"));
            }

            const { sendingBank, transRef } = slipData;

            this.log(`Slip Data: ${JSON.stringify(slipData)}`);

            // External API verification (SlipOK)
            let res: any = {};
            const slipOkUrl = process.env.SLIPOK_URL;
            const slipOkKey = process.env.SLIPOK_API_KEY;

            if (!slipOkUrl || !slipOkKey) {
                return this.responseError("SlipOK URL or API key not found", 400, Error("SlipOK URL or API key not found"));
            }

            try {
                const response = await fetch(slipOkUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-authorization": slipOkKey
                    },
                    body: JSON.stringify({
                        data: qrData
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    this.handleError("SlipOK API Error", Error(`${errorText}`));
                }
                res = await response.json();
            } catch (error) {
                return this.responseError("Error calling slip verification API", 400, error);
            }

            // Unwrap the response from SlipOK if it's nested in a 'data' property
            const responseData = res.data ? res.data : res;
            return this.successResponse(responseData, "Slip verification successful");

        } catch (error) {
            return this.responseError("Slip image verification failed", 400, error);
        }
    }
}
