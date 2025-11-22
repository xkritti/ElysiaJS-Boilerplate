import { t } from 'elysia';

export const BaseResponse = t.Object({
    status: t.String(),
    message: t.Optional(t.String())
});
