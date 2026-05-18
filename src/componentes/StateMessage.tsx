import { FiLoader, FiAlertTriangle, FiInbox } from "react-icons/fi";
import Button from "./Button";

type Props = {
  title: string;
  type: "empty" | "loading" | "error";
  description?: string;
  actionText?: string;
  onAction?: () => void;
};

export default function StateMessage({
  title,
  type,
  description,
  actionText,
  onAction,
}: Props) {
  const Icon =
    type === "loading"
      ? FiLoader
      : type === "error"
        ? FiAlertTriangle
        : FiInbox;

  const iconClass =
    type === "error"
      ? "state-message__icon state-message__icon--error"
      : type === "loading"
        ? "state-message__icon state-message__icon--loading"
        : "state-message__icon state-message__icon--empty";

  return (
    <div className="state-message">
      <div className={iconClass}>
        <Icon className={type === "loading" ? "spin" : ""} />
      </div>

      <h2 className="state-message__title">{title}</h2>

      {description && (
        <p className="state-message__desc">{description}</p>
      )}

      {actionText && onAction && (
        <div className="mt-4 flex justify-center">
          <Button variant="secondary" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
}
