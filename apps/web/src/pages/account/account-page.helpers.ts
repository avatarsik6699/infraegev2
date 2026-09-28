import { ApiError } from "~/shared/api";
import type { AccountPageTypes } from "./account-page.types";

const providers = ["vk", "yandex", "telegram"] as const;

const providerLabels: Record<string, string> = {
  vk: "VK ID",
  yandex: "Яндекс ID",
  telegram: "Telegram",
  email: "Почта и пароль",
};

function deletionError(reason: unknown): string {
  if (reason instanceof ApiError && reason.status === 403) {
    return "Не удалось подтвердить пароль. Проверьте его и повторите попытку.";
  }
  if (reason instanceof ApiError && reason.status === 401) {
    return "Сеанс закончился. Войдите снова и повторите удаление.";
  }
  return "Не удалось удалить аккаунт. Попробуйте ещё раз.";
}

function providerDeletionError(reason: unknown): string {
  if (reason instanceof ApiError && reason.status === 403)
    return "Нужно повторно войти через привязанный сервис. Закройте окно, подтвердите вход и попробуйте снова.";
  if (reason instanceof ApiError && reason.status === 401)
    return "Сеанс закончился. Войдите снова и повторите удаление.";
  return "Не удалось удалить аккаунт. Попробуйте ещё раз.";
}

function unlinkError(reason: unknown): string {
  if (reason instanceof ApiError && reason.status === 403)
    return "Нужно повторно подтвердить вход через привязанный способ.";
  if (reason instanceof ApiError && reason.status === 409)
    return "Последний способ входа отвязать нельзя.";
  return "Не удалось отвязать способ входа. Попробуйте ещё раз.";
}

function inputValue(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === "string" ? value : "";
}

function formLabel(mode: AccountPageTypes.Mode): string {
  switch (mode) {
    case "sign-in":
      return "Войти";
    case "register":
      return "Создать аккаунт";
    case "verify":
      return "Отправить письмо";
    case "recovery":
      return "Отправить ссылку";
    case "new-password":
      return "Сохранить пароль";
    case "profile":
      return "Сохранить пароль";
  }
}

function deliveryError(reason: unknown): string {
  if (reason instanceof ApiError && reason.status === 429) {
    return "Лимит отправки достигнут. Проверьте папку «Спам» и попробуйте позже.";
  }
  if (reason instanceof ApiError && reason.status === 503) {
    return "Почта временно недоступна. Попробуйте отправить ссылку позже.";
  }
  return "Не удалось отправить письмо. Проверьте подключение и повторите попытку.";
}

function registrationError(reason: unknown): string {
  if (reason instanceof ApiError && reason.status === 503) {
    return "Почта временно недоступна. Попробуйте создать аккаунт позже.";
  }
  return "Не удалось создать аккаунт. Проверьте данные и попробуйте ещё раз.";
}

function signInError(reason: unknown): string {
  if (reason instanceof ApiError && reason.status === 401) {
    return "Не удалось войти. Проверьте почту и пароль.";
  }
  return "Не удалось войти. Попробуйте ещё раз.";
}

export const accountPageHelpers = {
  providers,
  providerLabels,
  deletionError,
  providerDeletionError,
  unlinkError,
  inputValue,
  formLabel,
  deliveryError,
  registrationError,
  signInError,
};
