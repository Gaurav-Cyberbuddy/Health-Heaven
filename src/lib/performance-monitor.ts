/**
 * Performance monitoring utility for tracking AI generation speeds
 */

interface PerformanceMetrics {
  startTime: number;
  endTime?: number;
  duration?: number;
  cached?: boolean;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private static instance: PerformanceMonitor;

  static getInstance(): PerformanceMonitor {
    if (!this.instance) {
      this.instance = new PerformanceMonitor();
    }
    return this.instance;
  }

  startOperation(operationId: string): void {
    this.metrics.set(operationId, {
      startTime: Date.now(),
    });
  }

  endOperation(operationId: string, cached: boolean = false): number {
    const metric = this.metrics.get(operationId);
    if (!metric) return 0;

    const endTime = Date.now();
    const duration = endTime - metric.startTime;

    this.metrics.set(operationId, {
      ...metric,
      endTime,
      duration,
      cached,
    });

    return duration;
  }

  getMetrics(operationId: string): PerformanceMetrics | undefined {
    return this.metrics.get(operationId);
  }

  getAllMetrics(): Record<string, PerformanceMetrics> {
    return Object.fromEntries(this.metrics);
  }

  logPerformance(operationId: string): void {
    const metric = this.metrics.get(operationId);
    if (metric && metric.duration) {
      console.log(`[Performance] ${operationId}: ${metric.duration}ms ${metric.cached ? '(cached)' : ''}`);
    }
  }

  clearMetrics(): void {
    this.metrics.clear();
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();