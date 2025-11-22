import { Elysia, t } from 'elysia';
import { authGuard } from '../guards/auth.guard';
import { BankService } from '../services/bank.service';

const bankService = new BankService();

export const qrController = new Elysia({ prefix: '/qr' })
  .use(authGuard)
  .get('/generate', async ({ query }) => {
    const { amount, target, type } = query;
    return await bankService.generateQr(amount, target, type);
  }, {
    query: t.Object({
      amount: t.Numeric(),
      target: t.String(),
      type: t.Enum({
        MSISDN: 'MSISDN',
        NATID: 'NATID',
        EWALLETID: 'EWALLETID',
        // Reserved for future use
        // BANKACC: 'BANKACC'
      })
    }),
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
    body: t.Object({
      image: t.Files({ description: "Slip Image", format: 'image/*' }),
    }),
    query: t.Object({
      amount: t.Optional(t.Numeric())
    }),
    isAuth: true,
    detail: {
      summary: 'Verify Slip',
      tags: ['QR'],
      security: [{ BearerAuth: [] }]
    }
  });
