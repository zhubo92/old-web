export function filterMediaType(val: number) {
  if (val === 0) {
    return "录播";
  } else if (val === 1) {
    return "音频";
  } else if (val === 2) {
    return "图文";
  }
  return "";
}

export function filterTry(val: number) {
  if (val === 0) {
    return "试看";
  } else if (val === 1) {
    return "试听";
  }
  return "";
}
