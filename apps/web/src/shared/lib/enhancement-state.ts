const subscribe = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export const enhancementState = {
  subscribe,
  getClientSnapshot,
  getServerSnapshot,
} as const;
