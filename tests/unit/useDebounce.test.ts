import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "@/hooks/useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 300));
    expect(result.current).toBe("initial");
  });

  it("should debounce value changes until delay has elapsed", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "first", delay: 300 },
      }
    );

    expect(result.current).toBe("first");

    // Update prop
    rerender({ value: "second", delay: 300 });

    // Value should not change immediately
    expect(result.current).toBe("first");

    // Advance timer halfway
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe("first");

    // Advance remainder
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe("second");
  });
});
