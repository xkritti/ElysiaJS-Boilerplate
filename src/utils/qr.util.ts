import { createCanvas, loadImage } from 'canvas';
import jsQR from 'jsqr';

export const scanQrCodeFromBuffer = async (buffer: Buffer): Promise<string | null> => {
    try {
        // Load image using canvas for better QR code detection
        const img = await loadImage(buffer);
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // Get image data for QR code detection
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Scan QR Code with JSQR
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });

        if (!code || !code.data) {
            return null;
        }

        // If QR code is found, extract the region containing the QR code
        // This helps in verifying the QR code data by isolating it
        const { location } = code;
        const qrWidth = Math.abs(location.topRightCorner.x - location.topLeftCorner.x);
        const qrHeight = Math.abs(location.bottomLeftCorner.y - location.topLeftCorner.y);

        // Create a new canvas with just the QR code
        const qrCanvas = createCanvas(qrWidth, qrHeight);
        const qrCtx = qrCanvas.getContext('2d');

        // Calculate the top-left corner of the QR code
        const topLeftX = Math.min(
            location.topLeftCorner.x,
            location.bottomLeftCorner.x,
            location.topRightCorner.x,
            location.bottomRightCorner.x
        );
        const topLeftY = Math.min(
            location.topLeftCorner.y,
            location.bottomLeftCorner.y,
            location.topRightCorner.y,
            location.bottomRightCorner.y
        );

        // Draw only the QR code region
        qrCtx.drawImage(
            img,
            topLeftX, topLeftY, qrWidth, qrHeight,
            0, 0, qrWidth, qrHeight
        );

        // Get the QR code image data
        const qrImageData = qrCtx.getImageData(0, 0, qrWidth, qrHeight);

        // Try to decode the QR code again with the extracted region
        const qrCode = jsQR(qrImageData.data, qrImageData.width, qrImageData.height);

        if (qrCode && qrCode.data) {
            return qrCode.data;
        }

        // Fallback to the original code if extraction fails but initial scan worked
        return code.data;

    } catch (error) {
        console.error("Error scanning QR code:", error);
        return null;
    }
};
