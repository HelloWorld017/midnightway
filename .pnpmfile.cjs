module.exports = {
  hooks: {
    readPackage: pkg => {
      if (pkg.name !== 'midnightway') {
        return pkg;
      }

      const patchDeps = deps => Object.fromEntries(
        Object
          .entries(deps)
          .map(([key, descriptor]) => {
            if (!descriptor.startsWith('extern:')) {
              return [key, descriptor];
            }

            const externPath = process.env[`EXTERN_${descriptor.slice(7).toUpperCase()}`];
            if (!externPath) {
              throw new Error(
                `The extern dependency, '${key}', was not found in the env vars.\n` +
                `Make sure you're using the nix.`
              );
            }

            return [key, `link:${externPath}`];
          })
      );

      return {
        ...pkg,
        peerDependencies: patchDeps(pkg.peerDependencies),
        devDependencies: patchDeps(pkg.devDependencies),
      };
    },
  }
};
