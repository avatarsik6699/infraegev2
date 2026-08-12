import { z } from "zod";

export const answerFormSchema = z.object({
  answer: z
    .string()
    .trim()
    .min(1, "Введите ответ")
    .max(500, "Ответ должен быть короче 500 символов"),
});

export type AnswerFormValues = z.infer<typeof answerFormSchema>;
