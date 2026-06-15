import ContactForm from "@/components/contact/ContactForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Contact | AcheronX",
};

export default async function ContactPage() {
  const user = await getCurrentUser();

  return (
    <div className="page-shell">
      <div className="page-shell-inner container">
        <header className="contact-page__header">
          <p className="contact-page__label">Get in touch</p>
          <h1 className="contact-page__title">Contact AcheronX</h1>
          <p className="contact-page__copy">Questions about this demo, a project, or working together? Send a message and I&apos;ll get back to you.</p>
        </header>
        <ContactForm
          defaultName={user?.name ?? ""}
          defaultEmail={user?.email ?? ""}
        />
      </div>
    </div>
  );
}
