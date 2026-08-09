/** Required by 152-ФЗ whenever personal data (including IP addresses via analytics/Nginx logs)
 * is processed — docs/SPEC.md §8. Placeholder copy pending legal review (docs/SPEC.md §11). */
type Props = Record<string, never>;

export const PrivacyPage: React.FC<Props> = () => {
  return (
    <main className="container">
      <h1>Политика обработки персональных данных</h1>
      <p>
        [Черновик — требует юридического ревью перед публичным запуском,
        docs/SPEC.md §8/§11.]
      </p>
    </main>
  );
};
