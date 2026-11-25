import { describe, expect, it } from "vitest";
import { readOtpType, safeNextPath } from "@/lib/auth-confirm";

describe("safeNextPath", () => {
  it("keeps a same-site path", () => {
    expect(safeNextPath("/")).toBe("/");
    expect(safeNextPath("/panel")).toBe("/panel");
    expect(safeNextPath("/directorio?barrio=Castilla")).toBe(
      "/directorio?barrio=Castilla",
    );
  });

  it("rejects absolute URLs", () => {
    expect(safeNextPath("https://evil.example/panel")).toBe("/");
    expect(safeNextPath("http://localhost:3000/panel")).toBe("/");
  });

  it("rejects protocol-relative and backslash tricks", () => {
    expect(safeNextPath("//evil.example")).toBe("/");
    expect(safeNextPath("/\\evil.example")).toBe("/");
  });

  it("rejects header-smuggling control characters", () => {
    expect(safeNextPath("/panel\nLocation: https://evil.example")).toBe("/");
    expect(safeNextPath("/panel\r\nSet-Cookie: x=y")).toBe("/");
  });

  it("falls back to the home page when the link carries no next", () => {
    expect(safeNextPath(null)).toBe("/");
    expect(safeNextPath(undefined)).toBe("/");
    expect(safeNextPath("")).toBe("/");
  });
});

describe("readOtpType", () => {
  it("defaults to the signup token of the confirmation e-mail", () => {
    expect(readOtpType(null)).toBe("signup");
  });

  it("accepts the types GoTrue can verify", () => {
    expect(readOtpType("signup")).toBe("signup");
    expect(readOtpType("recovery")).toBe("recovery");
    expect(readOtpType("magiclink")).toBe("magiclink");
  });

  it("refuses an unknown type instead of forwarding it", () => {
    expect(readOtpType("admin")).toBeNull();
    expect(readOtpType("")).toBe("signup");
  });
});
