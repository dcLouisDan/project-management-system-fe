export function getAvatarFallback(name: string) {
  const initials = name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)

  return initials || 'U'
}
