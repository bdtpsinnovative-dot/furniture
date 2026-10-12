export interface DiscountInfo {
  originalPrice: number;
  finalPrice: number;
  discountPercent?: number;
  discountLabel?: string;
  hasDiscount: boolean;
}

export interface DiscountRuleJoin {
  id?: number;
  discount_id?: number;
  discounts?: {
    id: number;
    name?: string;
    discount_type: string;
    value: number;
    active: boolean;
  } | null;
}

export function calculateProductDiscount(
  rawPrice: number | string | null | undefined,
  discountRules?: DiscountRuleJoin[] | null
): DiscountInfo {
  const originalPrice = Number(rawPrice) || 0;
  if (!discountRules || discountRules.length === 0 || originalPrice <= 0) {
    return {
      originalPrice,
      finalPrice: originalPrice,
      hasDiscount: false,
    };
  }

  // Find active discount rule
  const activeRule = discountRules.find((r) => r.discounts && r.discounts.active);
  if (!activeRule || !activeRule.discounts) {
    return {
      originalPrice,
      finalPrice: originalPrice,
      hasDiscount: false,
    };
  }

  const d = activeRule.discounts;
  let finalPrice = originalPrice;
  let discountPercent: number | undefined;
  let discountLabel: string | undefined;

  const type = (d.discount_type || '').toUpperCase();
  const val = Number(d.value) || 0;

  if (type === 'PERCENT') {
    discountPercent = val;
    finalPrice = Math.round(originalPrice * (1 - val / 100));
    discountLabel = `-${val}%`;
  } else if (type === 'FIXED') {
    finalPrice = Math.max(0, originalPrice - val);
    discountPercent = Math.round((val / originalPrice) * 100);
    discountLabel = `-${val.toLocaleString()}฿`;
  }

  return {
    originalPrice,
    finalPrice,
    discountPercent,
    discountLabel,
    hasDiscount: finalPrice < originalPrice,
  };
}
