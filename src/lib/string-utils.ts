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

export interface GeneratePasswordOptions {
  length?: number
  useLowercase?: boolean
  useUppercase?: boolean
  useNumbers?: boolean
  useSymbols?: boolean
  excludeSimilar?: boolean // Exclude similar looking characters like O/0, l/1/I
  excludeAmbiguous?: boolean // Exclude ambiguous symbols like {}[]()/\'"
  minLowercase?: number
  minUppercase?: number
  minNumbers?: number
  minSymbols?: number
}

export function generatePassword(
  options: GeneratePasswordOptions = {},
): string {
  const {
    length = 16,
    useLowercase = true,
    useUppercase = true,
    useNumbers = true,
    useSymbols = true,
    excludeSimilar = false,
    excludeAmbiguous = false,
    minLowercase = 0,
    minUppercase = 0,
    minNumbers = 0,
    minSymbols = 0,
  } = options

  // Character sets
  let lowercase = 'abcdefghijklmnopqrstuvwxyz'
  let uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let numbers = '0123456789'
  let symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'

  // Exclude similar characters if requested
  if (excludeSimilar) {
    lowercase = lowercase.replace(/[ilo]/g, '')
    uppercase = uppercase.replace(/[IO]/g, '')
    numbers = numbers.replace(/[01]/g, '')
  }

  // Exclude ambiguous symbols if requested
  if (excludeAmbiguous) {
    symbols = symbols.replace(/[{}[\]()\\/'"]/g, '')
  }

  // Build character pool based on options
  let charPool = ''
  const pools: { chars: string; min: number; use: boolean }[] = []

  if (useLowercase) {
    charPool += lowercase
    pools.push({ chars: lowercase, min: minLowercase, use: true })
  }
  if (useUppercase) {
    charPool += uppercase
    pools.push({ chars: uppercase, min: minUppercase, use: true })
  }
  if (useNumbers) {
    charPool += numbers
    pools.push({ chars: numbers, min: minNumbers, use: true })
  }
  if (useSymbols) {
    charPool += symbols
    pools.push({ chars: symbols, min: minSymbols, use: true })
  }

  // Validate that we have at least one character set enabled
  if (charPool.length === 0) {
    throw new Error('At least one character type must be enabled')
  }

  // Validate that minimum requirements don't exceed length
  const totalMin = minLowercase + minUppercase + minNumbers + minSymbols
  if (totalMin > length) {
    throw new Error('Sum of minimum requirements exceeds password length')
  }

  // Generate password ensuring minimum requirements
  let password = ''

  // First, satisfy minimum requirements
  for (const pool of pools) {
    for (let i = 0; i < pool.min; i++) {
      const randomIndex = Math.floor(Math.random() * pool.chars.length)
      password += pool.chars[randomIndex]
    }
  }

  // Fill the rest with random characters from the full pool
  for (let i = password.length; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charPool.length)
    password += charPool[randomIndex]
  }

  // Shuffle the password to avoid predictable patterns
  password = password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('')

  return password
}
