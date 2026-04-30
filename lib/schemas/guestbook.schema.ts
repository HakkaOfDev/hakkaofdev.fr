import { z } from "zod";
import { GUESTBOOK_CONFIG } from "@/lib/constants/guestbook.constants";

// biome-ignore lint/suspicious/noExplicitAny: next-intl's t function uses a
// narrowed key union that's not assignable to `(key: string) => string`.
// Using `any` here keeps the call site simple; validation strings stay typed
// at the message-file level via the AppConfig augmentation.
type Translator = (key: any, values?: any) => string;

export function buildGuestbookFormSchema(t: Translator) {
  return z.object({
    name: z
      .string()
      .min(GUESTBOOK_CONFIG.MIN_NAME_LENGTH, {
        message: t("nameMin", { min: GUESTBOOK_CONFIG.MIN_NAME_LENGTH }),
      })
      .max(GUESTBOOK_CONFIG.MAX_NAME_LENGTH, {
        message: t("nameMax", { max: GUESTBOOK_CONFIG.MAX_NAME_LENGTH }),
      }),
    message: z
      .string()
      .min(GUESTBOOK_CONFIG.MIN_MESSAGE_LENGTH, {
        message: t("messageMin", { min: GUESTBOOK_CONFIG.MIN_MESSAGE_LENGTH }),
      })
      .max(GUESTBOOK_CONFIG.MAX_MESSAGE_LENGTH, {
        message: t("messageMax", { max: GUESTBOOK_CONFIG.MAX_MESSAGE_LENGTH }),
      }),
    website: z
      .string()
      .max(GUESTBOOK_CONFIG.MAX_WEBSITE_LENGTH, {
        message: t("websiteMax", { max: GUESTBOOK_CONFIG.MAX_WEBSITE_LENGTH }),
      })
      .url(t("websiteInvalid"))
      .optional()
      .or(z.literal("")),
    company: z.string().optional(),
  });
}

export type GuestbookFormValues = z.infer<
  ReturnType<typeof buildGuestbookFormSchema>
>;
