import { LegalDocument } from "./legal-document";
import { refundText } from "./model/legal-documents";

/** /vozvrat: how a refund for unused days works (ЗоЗПП ст. 32). */
export const RefundPage: React.FC = () => (
  <LegalDocument markdown={refundText} />
);
