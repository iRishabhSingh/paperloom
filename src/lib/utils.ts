export function getInitials(name?: string | null): string {
  if (!name) return "U";

  const names = name.split(" ");
  let initials = names[0].charAt(0).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].charAt(0).toUpperCase();
  }

  return initials;
}
