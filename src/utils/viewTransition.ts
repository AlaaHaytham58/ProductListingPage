export function startViewTransition(callback: () => void): void {
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => void;
  };
  if (doc.startViewTransition) {
    doc.startViewTransition(callback);
  } else {
    callback();
  }
}
