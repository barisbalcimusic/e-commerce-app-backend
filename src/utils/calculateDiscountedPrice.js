export const calculateDiscountedPrice = (price, discountPercentage) => {
  const discountedPrice = price - (price * discountPercentage) / 100;
  return discountedPrice.toFixed(2);
};
