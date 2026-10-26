import { ApiError } from "~/shared/api";
import type { AccountPageTypes } from "./account-page.types";
import type { AuthError, ResumeIntent } from "./model/recent-auth";

const providers = ["vk", "yandex"] as const;

const providerLabels: Record<string, string> = {
  vk: "VK ID",
  yandex: "Яндекс ID",
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
    return "С входа прошло больше 10 минут. Подтвердите вход и повторите удаление.";
  if (reason instanceof ApiError && reason.status === 401)
    return "Сеанс закончился. Войдите снова и повторите удаление.";
  return "Не удалось удалить аккаунт. Попробуйте ещё раз.";
}

function unlinkError(reason: unknown): string {
  if (reason instanceof ApiError && reason.status === 403)
    return "С входа прошло больше 10 минут. Подтвердите вход и повторите.";
  if (reason instanceof ApiError && reason.status === 409)
    return "Последний способ входа отвязать нельзя.";
  return "Не удалось отвязать способ входа. Попробуйте ещё раз.";
}

/** Change 227: the action of the «Подтвердите, что это вы» description. */
function intentAction(intent: ResumeIntent): string {
  switch (intent) {
    case "link:vk":
      return "добавить VK\u00a0ID";
    case "link:yandex":
      return "добавить Яндекс\u00a0ID";
    case "unlink:vk":
      return "отвязать VK\u00a0ID";
    case "unlink:yandex":
      return "отвязать Яндекс\u00a0ID";
    case "delete":
      return "удалить аккаунт";
    case "email":
      return "добавить почту и пароль";
  }
}

function reauthError(reason: unknown): string {
  if (reason instanceof ApiError && reason.status === 403)
    return "Пароль не подошёл. Проверьте раскладку и попробуйте ещё раз.";
  if (reason instanceof ApiError && reason.status === 429)
    return "Слишком много попыток. Подождите минуту и попробуйте снова.";
  return "Не удалось подтвердить вход. Проверьте подключение и повторите.";
}

/** Change 227: why a return from VK ID or Яндекс ID did not sign in or change anything. */
function authErrorMessage(
  code: AuthError,
  place: "sign-in" | "profile",
): string {
  switch (code) {
    case "expired":
      return "Время на вход через сервис истекло. Попробуйте ещё раз.";
    case "cancelled":
      return place === "sign-in"
        ? "Вход через сервис отменён."
        : "Подтверждение отменено, в аккаунте ничего не изменилось.";
    case "failed":
      return "Сервис не подтвердил вход. Попробуйте ещё раз чуть позже.";
    case "other_account":
      return "Аккаунт сервиса, под которым вы вошли, относится к другому аккаунту Кодумки. Аккаунты не объединяются: войдите в сервис под своим аккаунтом или сначала отвяжите этот в другом аккаунте Кодумки.";
    case "already_linked":
      return "К аккаунту уже привязан другой аккаунт этого сервиса. Чтобы заменить его, сначала отвяжите прежний.";
  }
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
    case "provider-consent":
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
  intentAction,
  reauthError,
  authErrorMessage,
  inputValue,
  formLabel,
  deliveryError,
  registrationError,
  signInError,
};
