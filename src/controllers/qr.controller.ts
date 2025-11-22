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
  .post('/verify', async ({ body }) => {
    return await bankService.verifySlip(body);
  }, {
    body: t.Object({
      amount: t.Numeric(),
      transRef: t.Optional(t.String())
    }),
    isAuth: true,
    detail: {
      summary: 'Verify Slip',
      tags: ['QR'],
      security: [{ BearerAuth: [] }]
    }
  });
