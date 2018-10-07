function timeout(delay, doFail) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (doFail) {
        reject(Error(false));
        return;
      }

      resolve(true);
    }, delay);
  });
}

export { timeout as default };
