import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/sequalize.config";

interface SiteContentAttributes {
  id: Buffer;
  key: "legal_terms" | "usage_rules" | "privacy_policy" | "faq" | "footer_content";
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SiteContentCreationAttributes
  extends Optional<SiteContentAttributes, "id" | "createdAt" | "updatedAt"> {}

class SiteContent extends Model<SiteContentAttributes, SiteContentCreationAttributes>
  implements SiteContentAttributes {
  public id!: Buffer;
  public key!: "legal_terms" | "usage_rules" | "privacy_policy" | "faq" | "footer_content";
  public content!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SiteContent.init(
  {
    id: {
      type: DataTypes.BLOB,
      allowNull: false,
      primaryKey: true,
      defaultValue: sequelize.literal("UUID_TO_BIN(UUID())"),
    },
    key: {
      type: DataTypes.ENUM("legal_terms", "usage_rules", "privacy_policy", "faq", "footer_content"),
      allowNull: false,
      unique: true,
    },
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at",
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "site_content",
    timestamps: false,
    underscored: true,
  }
);

export default SiteContent;
