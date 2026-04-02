import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProductForm } from "../src/components/ProductForm";

describe("ProductForm", () => {
  const setup = (onSubmit = vi.fn().mockResolvedValue(undefined)) => {
    render(<ProductForm onSubmit={onSubmit} />);
    return {
      input:  screen.getByLabelText(/product name/i),
      button: screen.getByRole("button", { name: /add product/i }),
      onSubmit,
    };
  };

  // ── Successful submission ──────────────────────────────────────────────
  it("calls onSubmit with trimmed name on valid input", async () => {
    const { input, button, onSubmit } = setup();

    await userEvent.type(input, "  Widget  ");
    await userEvent.click(button);

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith("Widget"));
  });

  it("clears the input after a successful submit", async () => {
    const { input, button } = setup();

    await userEvent.type(input, "Gadget");
    await userEvent.click(button);

    await waitFor(() => expect(input).toHaveValue(""));
  });

  it("shows Added! feedback briefly after success", async () => {
    const { input, button } = setup();

    await userEvent.type(input, "Widget");
    await userEvent.click(button);

    await waitFor(() =>
      expect(screen.getByRole("button")).toHaveTextContent(/added/i)
    );
  });

  // ── Validation ─────────────────────────────────────────────────────────
  it("shows required error when submitted empty", async () => {
    const { button, onSubmit } = setup();

    await userEvent.click(button);

    expect(screen.getByRole("alert")).toHaveTextContent(/required/i);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows required error when name is only whitespace", async () => {
    const { input, button, onSubmit } = setup();

    await userEvent.type(input, "   ");
    await userEvent.click(button);

    expect(screen.getByRole("alert")).toHaveTextContent(/required/i);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("clears the error when user starts typing after a failed submit", async () => {
    const { input, button } = setup();

    await userEvent.click(button);
    expect(screen.getByRole("alert")).toBeInTheDocument();

    await userEvent.type(input, "W");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  // ── API errors ─────────────────────────────────────────────────────────
  it("shows API error message when submit fails", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("Server error"));
    const { input, button } = setup(onSubmit);

    await userEvent.type(input, "Bad product");
    await userEvent.click(button);

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("Server error")
    );
  });

  it("re-enables the button after a failed submit", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("Server error"));
    const { input, button } = setup(onSubmit);

    await userEvent.type(input, "Bad product");
    await userEvent.click(button);

    await waitFor(() => expect(button).not.toBeDisabled());
  });

  // ── Disabled state ─────────────────────────────────────────────────────
  it("disables the button and input while submitting", async () => {
    // Never resolves — keeps the button in loading state
    const onSubmit = vi.fn().mockReturnValue(new Promise(() => {}));
    const { input, button } = setup(onSubmit);

    await userEvent.type(input, "Widget");
    await userEvent.click(button);

    expect(button).toBeDisabled();
    expect(input).toBeDisabled();
  });
});