export const mediaQuery = {
  createStore(query: string) {
    return {
      getServerSnapshot: () => false,
      getSnapshot: () => window.matchMedia(query).matches,
      subscribe(listener: () => void) {
        const media = window.matchMedia(query);
        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
      },
    };
  },
};
