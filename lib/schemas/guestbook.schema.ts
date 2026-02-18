import { z } from "zod";
import { GUESTBOOK_CONFIG } from "@/lib/constants/guestbook.constants";

export const guestbookFormSchema = z.object({
  name: z
    .string()
    .min(
      GUESTBOOK_CONFIG.MIN_NAME_LENGTH,
      `Name must be at least ${GUESTBOOK_CONFIG.MIN_NAME_LENGTH} characters.`,
    )
    .max(
      GUESTBOOK_CONFIG.MAX_NAME_LENGTH,
      `Name must be at most ${GUESTBOOK_CONFIG.MAX_NAME_LENGTH} characters.`,
    ),
  message: z
    .string()
    .min(
      GUESTBOOK_CONFIG.MIN_MESSAGE_LENGTH,
      `Message must be at least ${GUESTBOOK_CONFIG.MIN_MESSAGE_LENGTH} characters.`,
    )
    .max(
      GUESTBOOK_CONFIG.MAX_MESSAGE_LENGTH,
      `Message must be at most ${GUESTBOOK_CONFIG.MAX_MESSAGE_LENGTH} characters.`,
    ),
  website: z
    .string()
    .max(
      GUESTBOOK_CONFIG.MAX_WEBSITE_LENGTH,
      `Website must be at most ${GUESTBOOK_CONFIG.MAX_WEBSITE_LENGTH} characters.`,
    )
    .url("Website URL is invalid.")
    .optional()
    .or(z.literal("")),
  company: z.string().optional(),
});

export type GuestbookFormValues = z.infer<typeof guestbookFormSchema>;
