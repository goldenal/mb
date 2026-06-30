export function bulletsFromDesc(desc) {
  if (!desc) return []
  return desc.split('*').map((s) => s.trim()).filter(Boolean)
}

export function startingPrice(pillow) {
  return pillow.price || (pillow.sizes && pillow.sizes.length > 0 ? `From ${pillow.sizes[0].price}` : '') || ''
}
