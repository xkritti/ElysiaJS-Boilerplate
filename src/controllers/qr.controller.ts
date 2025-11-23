import { Elysia, t } from 'elysia';
import { authGuard } from '../guards/auth.guard';
import { BankService } from '../services/bank.service';
import { GenerateQrModel, VerifySlipBodyModel, VerifySlipQueryModel } from '../models/qr.model';

const bankService = new BankService();

export const qrController = new Elysia({ prefix: '/qr' })
  .use(authGuard)
  .get('/generate', async ({ query }) => {
    const { amount, target, type } = query;
    return await bankService.generateQr(amount, target, type);
  }, {
    query: GenerateQrModel,
    isAuth: true,
    detail: {
      summary: 'Generate PromptPay QR',
      tags: ['QR'],
      security: [{ BearerAuth: [] }]
    }
  })

  .post('/verify', async ({ body, query }) => {
    // Extract title and image from form data
    const imageFiles = body.image;

    if (!imageFiles || imageFiles.length === 0) {
      return { error: "No image file provided" };
    }

    // Convert file to buffer
    const file = imageFiles[0];

    if (!file.type.startsWith('image/')) {
      throw new Error("File must be an image");
    }
    return await bankService.verifySlipImage(file);
  }, {
    body: VerifySlipBodyModel,
    query: VerifySlipQueryModel,
    isAuth: true,
    detail: {
      summary: 'Verify Slip',
      tags: ['QR'],
      security: [{ BearerAuth: [] }]
    }
  });
