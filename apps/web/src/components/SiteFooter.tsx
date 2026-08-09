import { Link } from "@tanstack/react-router";

/**
 * Feedback link + age marking, per docs/SPEC.md §5.2/§8. No feedback form — a Telegram/VK link
 * is zero-cost and reuses the same channel monitoring alerts land in (docs/SPEC.md §7.2).
 */
export function SiteFooter() {
  return (
    <footer
      className="container"
      style={{ borderTop: "1px solid var(--color-muted)" }}
    >
      <p>
        <a
          href="https://t.me/REPLACE_WITH_FEEDBACK_CHANNEL"
          target="_blank"
          rel="noreferrer"
        >
          Сообщить о проблеме
        </a>
      </p>
      <p>
        <Link to="/privacy">Политика обработки персональных данных</Link>
        {" · "}
        <Link to="/terms">Пользовательское соглашение</Link>
      </p>
      {/* 436-ФЗ marking — exact category still needs a lawyer, see docs/SPEC.md §11. */}
      <p aria-label="Возрастная маркировка">12+</p>
    </footer>
  );
}
