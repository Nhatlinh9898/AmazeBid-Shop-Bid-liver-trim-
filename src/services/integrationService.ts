/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { KOLInfo } from "../types";

export type EcommerceEvent = 'login' | 'purchase' | 'sale' | 'review';

export const integrationService = {
  /**
   * Processes an external e-commerce event and returns the rewards.
   */
  processEcommerceEvent: (event: EcommerceEvent, amount: number = 0) => {
    switch (event) {
      case 'login':
        return { xp: 50, spirit: 20, chips: 5, tokens: 0 };
      case 'purchase':
        // Rewards based on purchase amount
        const purchaseBonus = Math.floor(amount / 100);
        return { xp: 200 + purchaseBonus, spirit: 50, chips: 10, tokens: 5 + Math.floor(purchaseBonus / 10) };
      case 'sale':
        // Rewards for selling a product
        const saleBonus = Math.floor(amount / 50);
        return { xp: 500, spirit: 100, chips: 100 + saleBonus, tokens: 50 + Math.floor(saleBonus / 5) };
      case 'review':
        return { xp: 100, spirit: 30, chips: 20, tokens: 10 };
      default:
        return { xp: 0, spirit: 0, chips: 0, tokens: 0 };
    }
  },

  /**
   * Example of how to integrate with an external site via postMessage
   */
  setupExternalListener: (onEvent: (event: EcommerceEvent, data: any) => void) => {
    window.addEventListener('message', (event) => {
      // Security check: Ensure the origin is trusted
      // if (event.origin !== "https://your-ecommerce-site.com") return;

      if (event.data && event.data.type === 'ECOMMERCE_ACTION') {
        onEvent(event.data.action, event.data.payload);
      }
    });
  }
};
