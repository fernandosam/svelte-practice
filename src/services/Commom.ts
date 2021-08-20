export function uuid() {
  let r = Math.random().toString(20).substr(2, 5);
  return r;
}
