"use client";

type SubmitButtonProps = {
  children: React.ReactNode;
  pending?: boolean;
  icon?: string;
  pendingLabel?: string;
};

export default function SubmitButton({
  children,
  pending = false,
  icon = "bx-log-in",
  pendingLabel = "Please wait…",
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className="btn-primary btn-primary--icon"
      disabled={pending}
    >
      {pending ? (
        <>
          <i className="bx bx-loader-alt bx-spin" aria-hidden="true" />
          {pendingLabel}
        </>
      ) : (
        <>
          {children}
          <i className={`bx ${icon}`} aria-hidden="true" />
        </>
      )}
    </button>
  );
}
