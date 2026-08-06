const AVATAR_COUNT = 8

export const randomAvatar = () => `/profiles/lemon${Math.floor(Math.random() * AVATAR_COUNT)}.png`

// og:image no puede ser aleatorio: debe resolver siempre a la misma URL para un mismo post.
export const avatarForKey = (key = '') => {
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) % 100000
  }
  return `/profiles/lemon${hash % AVATAR_COUNT}.png`
}
