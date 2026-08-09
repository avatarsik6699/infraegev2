import { createFileRoute } from "@tanstack/react-router";

/** docs/SPEC.md §5.1/§13.3 — terms of use for the free service. */
export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Пользовательское соглашение" }] }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <main className="container">
      <h1>Пользовательское соглашение</h1>
      <p>
        [Черновик — условия использования бесплатного сервиса, docs/SPEC.md
        §11.]
      </p>
    </main>
  );
}
