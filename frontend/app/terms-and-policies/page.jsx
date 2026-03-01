import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import styles from "./page.module.css";

export const metadata = {
  title: "Terms, Disclaimer and Privacy Policy | CueBase",
  description: "CueBase Terms of Service, Privacy Policy and Disclaimers",
};

function getMarkdownContent() {
  const filePath = path.join(process.cwd(), "content", "TermsAndPolicies.md");
  return fs.readFileSync(filePath, "utf8");
}

export default function TermsAndPoliciesPage() {
  const content = getMarkdownContent();
  return (
    <main className={styles.page}>
      <article className={styles.article}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </main>
  );
}
