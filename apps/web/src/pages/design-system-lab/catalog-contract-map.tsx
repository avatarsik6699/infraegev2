import styles from "./design-system-lab.module.css";

export type CatalogContract = {
  name: string;
  status: "live" | "candidate" | "context";
  note: string;
};

type CatalogContractMapProps = {
  contracts: readonly CatalogContract[];
  label: string;
};

const statusLabels: Record<CatalogContract["status"], string> = {
  live: "Живой пример",
  candidate: "Кандидат",
  context: "Нужен контекст",
};

export const CatalogContractMap: React.FC<CatalogContractMapProps> = (
  props,
) => (
  <ul className={styles.contractMap} aria-label={props.label}>
    {props.contracts.map((contract) => (
      <li
        className={styles.contractMapItem}
        data-contract-name={contract.name}
        data-contract-status={contract.status}
        key={contract.name}
      >
        <code>{contract.name}</code>
        <span className={styles.contractStatus}>
          {statusLabels[contract.status]}
        </span>
        <span className={styles.contractNote}>{contract.note}</span>
      </li>
    ))}
  </ul>
);
