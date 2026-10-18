import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";

describe("EmptyState", () => {
  it("renders custom title and description", () => {
    render(
      <EmptyState
        title="Custom Empty Title"
        description="Custom description text"
      />
    );
    expect(screen.getByText("Custom Empty Title")).toBeInTheDocument();
    expect(screen.getByText("Custom description text")).toBeInTheDocument();
  });

  it("calls onReset callback when clicked", () => {
    const handleReset = vi.fn();
    render(<EmptyState onReset={handleReset} resetLabel="Reset All" />);

    const button = screen.getByRole("button", { name: /reset all/i });
    fireEvent.click(button);
    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});

describe("ErrorState", () => {
  it("renders error message and retry button", () => {
    const handleRetry = vi.fn();
    render(
      <ErrorState
        title="Network Failed"
        message="Could not reach the server"
        onRetry={handleRetry}
      />
    );
    expect(screen.getByText("Network Failed")).toBeInTheDocument();
    expect(screen.getByText("Could not reach the server")).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /try again/i });
    fireEvent.click(button);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});
