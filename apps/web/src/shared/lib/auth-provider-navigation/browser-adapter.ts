/** Leave the SPA for the provider authorization page returned by our API. */
export const authProviderNavigation = {
  leave(url: string): void {
    window.location.assign(url);
  },
};
