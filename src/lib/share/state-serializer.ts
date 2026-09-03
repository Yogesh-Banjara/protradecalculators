/**
 * Shareable Calculator State Serializer
 * ProTrade Calculators (https://protradecalculators.com)
 *
 * Encodes and decodes calculator input state for copy/share links.
 * Guarantees zero crashes on malformed, corrupted, or tampered input strings.
 */

import type { ShareStatePayload, ShareStateResult } from "@/types/share";
import { sanitizeString } from "./sanitizer";

export const CURRENT_SHARE_VERSION = 1;

/**
 * Base64 URL safe encoder (compatible with Browser & Node.js).
 */
function toBase64Url(jsonStr: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(jsonStr, "utf-8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }
  // Browser fallback
  return btoa(unescape(encodeURIComponent(jsonStr)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Base64 URL safe decoder (compatible with Browser & Node.js).
 */
function fromBase64Url(base64UrlStr: string): string {
  let base64 = base64UrlStr.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  if (typeof Buffer !== "undefined") {
    return Buffer.from(base64, "base64").toString("utf-8");
  }
  // Browser fallback
  return decodeURIComponent(escape(atob(base64)));
}

/**
 * Serializes calculator inputs into a URL-safe compact string.
 */
export function encodeCalculatorState(
  toolSlug: string,
  values: Record<string, string | number | boolean>
): string {
  // Strip null, undefined, empty string, and functions
  const cleanValues: Record<string, string | number | boolean> = {};
  for (const [key, val] of Object.entries(values)) {
    if (val !== null && val !== undefined && val !== "") {
      const cleanKey = sanitizeString(key, "", 50);
      if (cleanKey && cleanKey !== "__proto__" && cleanKey !== "prototype" && cleanKey !== "constructor") {
        if (typeof val === "number" && Number.isFinite(val)) {
          cleanValues[cleanKey] = val;
        } else if (typeof val === "boolean") {
          cleanValues[cleanKey] = val;
        } else if (typeof val === "string") {
          cleanValues[cleanKey] = sanitizeString(val, "", 100);
        }
      }
    }
  }

  const payload: ShareStatePayload = {
    version: CURRENT_SHARE_VERSION,
    toolSlug: sanitizeString(toolSlug, "calculator", 50),
    values: cleanValues,
    timestamp: Date.now(),
  };

  try {
    const json = JSON.stringify(payload);
    return toBase64Url(json);
  } catch {
    return "";
  }
}

/**
 * Deserializes and validates a shareable calculator state string.
 * Never throws an unhandled error; returns clean fallback state with warnings on error.
 */
export function decodeCalculatorState<T extends Record<string, unknown> = Record<string, unknown>>(
  expectedToolSlug: string,
  encodedState: string
): ShareStateResult<T> {
  const warnings: string[] = [];

  if (!encodedState || typeof encodedState !== "string") {
    return {
      isValid: false,
      version: CURRENT_SHARE_VERSION,
      toolSlug: expectedToolSlug,
      data: {} as Partial<T>,
      warnings: ["No state provided"],
    };
  }

  // Guard against excessively long strings (DDoS / Memory exhaustion protection)
  if (encodedState.length > 2048) {
    return {
      isValid: false,
      version: CURRENT_SHARE_VERSION,
      toolSlug: expectedToolSlug,
      data: {} as Partial<T>,
      warnings: ["State payload exceeds maximum allowed size (2KB)"],
    };
  }

  try {
    const jsonStr = fromBase64Url(encodedState);
    const parsed = JSON.parse(jsonStr);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {
        isValid: false,
        version: CURRENT_SHARE_VERSION,
        toolSlug: expectedToolSlug,
        data: {} as Partial<T>,
        warnings: ["Malformed JSON payload structure"],
      };
    }

    const version = typeof parsed.version === "number" ? parsed.version : 1;
    const toolSlug = typeof parsed.toolSlug === "string" ? parsed.toolSlug : "";

    if (toolSlug && toolSlug !== expectedToolSlug) {
      warnings.push(`Tool slug mismatch: expected '${expectedToolSlug}', found '${toolSlug}'`);
    }

    const rawValues = parsed.values && typeof parsed.values === "object" && !Array.isArray(parsed.values)
      ? parsed.values
      : {};

    const cleanData: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(rawValues)) {
      // Prototype pollution defense
      if (k === "__proto__" || k === "prototype" || k === "constructor") {
        continue;
      }
      cleanData[k] = v;
    }

    return {
      isValid: true,
      version,
      toolSlug: expectedToolSlug,
      data: cleanData as Partial<T>,
      warnings,
    };
  } catch (err) {
    return {
      isValid: false,
      version: CURRENT_SHARE_VERSION,
      toolSlug: expectedToolSlug,
      data: {} as Partial<T>,
      warnings: [`Deserialization failed: ${err instanceof Error ? err.message : "Unknown error"}`],
    };
  }
}

/**
 * Builds a full share URL for the calculator state.
 */
export function buildShareUrl(
  basePath: string,
  toolSlug: string,
  values: Record<string, string | number | boolean>
): string {
  const encoded = encodeCalculatorState(toolSlug, values);
  if (!encoded) return basePath;

  const url = new URL(basePath, "https://protradecalculators.com");
  url.searchParams.set("cfg", encoded);
  return `${url.pathname}?${url.searchParams.toString()}`;
}

/**
 * Strips all share query parameters from a URL to guarantee clean canonical indexing.
 */
export function stripShareQueryParams(urlOrPath: string): string {
  try {
    const url = new URL(urlOrPath, "https://protradecalculators.com");
    url.searchParams.delete("cfg");
    url.searchParams.delete("s");
    url.searchParams.delete("state");
    return `${url.pathname}${url.search ? `?${url.searchParams.toString()}` : ""}`;
  } catch {
    return urlOrPath.split("?")[0];
  }
}
