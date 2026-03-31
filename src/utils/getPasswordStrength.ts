export function getPasswordStrength(password: string): number {
  let score = 0;

  if (!password || !password?.length) return score;

  // Kriterium 1: Mindestlänge (z. B. 8 Zeichen)
  if (password.length >= 5) {
    score++;
  }

  // Kriterium 2: Mischung aus Klein- und Großbuchstaben
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score++;
  }

  // Kriterium 3: Mindestens eine Zahl
  if (/\d/.test(password)) {
    score++;
  }

  // Kriterium 4: Mindestens ein Sonderzeichen (z. B. !, @, #, $, etc.)
  if (/[\W_]/.test(password)) {
    score++;
  }

  return score;
}
