export const documentRecovery = {
  isChunkLoadError(error: unknown): boolean {
    return (
      error instanceof Error &&
      (error.name === "ChunkLoadError" ||
        /(?:dynamically imported module|loading chunk|importing a module script)/i.test(
          error.message,
        ))
    );
  },
  reload(): void {
    window.location.reload();
  },
};
