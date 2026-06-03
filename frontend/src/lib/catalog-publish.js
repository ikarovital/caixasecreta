/** Produto visível no site: published === true e active !== false */
export function isActive(product) {
  return product?.active !== false;
}

export function isPublished(product) {
  return product?.published === true;
}

export function isVisibleOnSite(product) {
  return isPublished(product) && isActive(product);
}

export function publishedProducts(products) {
  return products.filter(isVisibleOnSite);
}
