"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { isValidEmail, subscribeNewsletter } from "@/lib/newsletter";

interface INewsletterForm {
  email: string;
}

interface IFooterNewsletterProps {
  id?: string;
  layout?: "stack" | "inline";
  tone?: "paper" | "accent";
}

export const FooterNewsletter = (props: IFooterNewsletterProps) => {
  const { id = "footer-newsletter-email", layout = "stack", tone = "paper" } = props;
  const onAccent = tone === "accent";
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<INewsletterForm>({ defaultValues: { email: "" } });
  const emailField = register("email", {
    required: "Digite um e-mail válido.",
    validate: (value) => isValidEmail(value) || "Digite um e-mail válido.",
  });
  const feedback = errors.email?.message || message;
  const feedbackIsError = Boolean(errors.email) || isError;

  const onSubmit = handleSubmit(async (values) => {
    setMessage("");
    setIsError(false);

    const result = await subscribeNewsletter(values.email);
    setIsError(!result.ok);
    setMessage(result.message);
    if (result.ok) reset();
  });

  return (
    <form className={layout === "inline" ? "" : "mt-3"} onSubmit={onSubmit} noValidate>
      <div className={layout === "inline" ? "flex flex-col gap-2 sm:flex-row sm:items-center" : "flex flex-col gap-2"}>
        <label className="sr-only" htmlFor={id}>
          E-mail
        </label>
        <input
          id={id}
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          disabled={isSubmitting}
          {...emailField}
          placeholder="seu e-mail"
          className={
            onAccent
              ? "w-full border-b border-panel bg-transparent px-1 py-2 text-sm text-panel outline-none placeholder:text-panel/60 disabled:opacity-70 sm:max-w-xs"
              : "w-full border border-line bg-panel px-4 py-2 text-sm text-ink outline-none placeholder:text-muted focus:border-accent disabled:opacity-70 sm:max-w-xs"
          }
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={
            onAccent
              ? "utility-label-soft w-fit bg-panel px-5 py-2 text-xs font-semibold text-accent hover:bg-asphalt hover:text-panel disabled:opacity-70"
              : "utility-label-soft w-fit bg-accent px-5 py-2 text-xs font-semibold text-panel hover:bg-asphalt disabled:opacity-70"
          }
        >
          {isSubmitting ? "Enviando…" : "Assinar"}
        </button>
      </div>
      {feedback ? (
        <p role={feedbackIsError ? "alert" : "status"} className={`mt-2 text-xs ${feedbackIsError ? (onAccent ? "text-panel" : "text-accent") : onAccent ? "text-panel" : "text-highlight"}`}>
          {feedback}
        </p>
      ) : null}
    </form>
  );
};
