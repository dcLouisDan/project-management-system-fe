export function getAvatarFallback(name: string) {
  const initials = name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)

  return initials || 'U'
}

export function snakeCaseToTitleCase(str: string) {
  const wordsArr = str.split('_')

  return wordsArr.map((word) => word[0].toUpperCase() + word.slice(1)).join(' ')
}
