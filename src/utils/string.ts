export function capitalize(s: string) {
    if (s.length <= 1) return s.toUpperCase();
    return s.charAt(0).toUpperCase() + s.slice(1);
}
