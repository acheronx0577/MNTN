import ContactForm from "@/components/contact/ContactForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Contact | MNTN",
};

export default async function ContactPage() {
  const user = await getCurrentUser();

  return (
    <div className="page-shell">
      <div className="page-shell-inner container">
        <header className="contact-page__header">
          <p className="contact-page__label">Get in touch</p>
          <h1 className="contact-page__title">Contact MNTN</h1>
          <p className="contact-page__copy">
            Questions about gear, trails, or the guide? Send a message and we&apos;ll
            get back to you.
          </p>
        </header>
        <div className="contact-form-wrap account-panel">
          <ContactForm
          defaultName={user?.name ?? ""}
          defaultEmail={user?.email ?? ""}
        />
        </div>
      </div>
    </div>
  );
}
