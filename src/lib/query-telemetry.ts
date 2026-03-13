type AsyncFactory<T> = () => Promise<T>;

function isTelemetryEnabled() {
  return (
    process.env.NODE_ENV !== "production" &&
    typeof window !== "undefined" &&
    typeof performance !== "undefined"
  );
}

export async function withQueryTelemetry<T>(
  label: string,
  factory: AsyncFactory<T>,
) {
  if (!isTelemetryEnabled()) {
    return factory();
  }

  const startedAt = performance.now();

  try {
    const result = await factory();
    const duration = performance.now() - startedAt;
    console.debug(`[query] ${label} completed in ${duration.toFixed(1)}ms`);
    return result;
  } catch (error) {
    const duration = performance.now() - startedAt;
    console.debug(`[query] ${label} failed in ${duration.toFixed(1)}ms`, error);
    throw error;
  }
}
