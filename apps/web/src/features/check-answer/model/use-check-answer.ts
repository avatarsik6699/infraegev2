import { useMutation } from "@tanstack/react-query";
import { checkAnswer } from "../api/check-answer";

export function useCheckAnswer() {
  return useMutation({
    mutationFn: ({ taskId, answer }: { taskId: string; answer: string }) =>
      checkAnswer(taskId, answer),
    retry: false,
  });
}
