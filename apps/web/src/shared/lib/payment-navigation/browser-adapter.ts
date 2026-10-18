/** Leave the SPA for the payment provider's page returned by our API (Change 192). */
export const paymentNavigation = {
  leave(url: string): void {
    window.location.assign(url);
  },
};
