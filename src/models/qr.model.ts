import { t } from 'elysia';

export const GenerateQrModel = t.Object({
    amount: t.Numeric(),
    target: t.String(),
    type: t.Enum({
        MSISDN: 'MSISDN',
        NATID: 'NATID',
        EWALLETID: 'EWALLETID',
        // Reserved for future use
        // BANKACC: 'BANKACC'
    })
});

export const VerifySlipBodyModel = t.Object({
    image: t.Files({ description: "Slip Image", format: 'image/*' }),
});

export const VerifySlipQueryModel = t.Object({
    amount: t.Optional(t.Numeric())
});
