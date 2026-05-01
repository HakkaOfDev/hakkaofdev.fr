import { z } from "zod";
import { GUESTBOOK_CONFIG } from "@/lib/constants/guestbook.constants";

export type GuestbookValidationMessages = {
  nameMin: string;
  nameMax: string;
  messageMin: string;
  messageMax: string;
  websiteMax: string;
  websiteInvalid: string;
};

export function buildGuestbookFormSchema(
  messages: GuestbookValidationMessages,
) {
  return z.object({
    name: z
      .string()
      .min(GUESTBOOK_CONFIG.MIN_NAME_LENGTH, { message: messages.nameMin })
      .max(GUESTBOOK_CONFIG.MAX_NAME_LENGTH, { message: messages.nameMax }),
    message: z
      .string()
      .min(GUESTBOOK_CONFIG.MIN_MESSAGE_LENGTH, {
        message: messages.messageMin,
      })
      .max(GUESTBOOK_CONFIG.MAX_MESSAGE_LENGTH, {
        message: messages.messageMax,
      }),
    website: z
      .string()
      .max(GUESTBOOK_CONFIG.MAX_WEBSITE_LENGTH, {
        message: messages.websiteMax,
      })
      .url(messages.websiteInvalid)
      .optional()
      .or(z.literal("")),
    company: z.string().optional(),
  });
}

export type GuestbookFormValues = z.infer<
  ReturnType<typeof buildGuestbookFormSchema>
>;
