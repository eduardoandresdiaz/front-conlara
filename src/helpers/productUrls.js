export const getProductSlug = (name) => {
  const slug = String(name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return slug || 'producto';
};

const getProductIdentity = (product) => ({
  id: product?.id ?? product?._id,
  slug: getProductSlug(product?.name ?? product?.title),
});

export const getProductPath = (product) => {
  const { id, slug } = getProductIdentity(product);
  return `/productos/${slug}/${encodeURIComponent(id)}`;
};

export const getProductSharePath = (product) => {
  const { id, slug } = getProductIdentity(product);
  return `/productos/share/${slug}/${encodeURIComponent(id)}`;
};

export const getProductPreviewUrl = (product) => {
  const { id } = getProductIdentity(product);
  return `https://og.conlara.com.ar/productos/share/${encodeURIComponent(id)}`;
};
