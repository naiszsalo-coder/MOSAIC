import type { TKey } from "../i18n";

export type Rule = "req" | "email" | "phone" | "phoneopt" | "pass" | "check";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+\d][\d\s()-]{7,}$/;

export const isEmail = (v: string) => EMAIL.test(v.trim());

/** Returns the i18n key of the error message, or null when the value is valid. */
export function check(rule: Rule, value: string | boolean): TKey | null {
  const v = typeof value === "string" ? value.trim() : value;
  switch (rule) {
    case "req":
      return v ? null : "e_req";
    case "email":
      return typeof v === "string" && EMAIL.test(v) ? null : "e_email";
    case "phone":
      return typeof v === "string" && PHONE.test(v) ? null : "e_phone";
    case "phoneopt":
      return !v || (typeof v === "string" && PHONE.test(v)) ? null : "e_phone";
    case "pass":
      return typeof v === "string" && v.length >= 6 ? null : "e_short";
    case "check":
      return v === true ? null : "e_agree";
  }
}

export type Errors<K extends string> = Partial<Record<K, TKey>>;

/** Validates a whole form. `rules` maps field name → rule. */
export function validate<K extends string>(values: Record<K, string | boolean>, rules: Partial<Record<K, Rule>>): Errors<K> {
  const errors: Errors<K> = {};
  (Object.keys(rules) as K[]).forEach((k) => {
    const rule = rules[k];
    if (!rule) return;
    const err = check(rule, values[k]);
    if (err) errors[k] = err;
  });
  return errors;
}

/** Focuses the first invalid control inside a form, after React has painted the error state. */
export function focusFirstError(form: HTMLFormElement | null) {
  requestAnimationFrame(() => {
    form?.querySelector<HTMLElement>(".fld.bad input, .fld.bad select, .fld.bad textarea")?.focus();
  });
}
