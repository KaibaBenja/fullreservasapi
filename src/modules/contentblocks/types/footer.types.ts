export interface IFooter {
  id?: string;
  key: "legal_terms" | "usage_rules" | "privacy_policy" | "faq" | "footer_content";
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}
