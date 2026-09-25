import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "~/shared/components/button";
import { Field } from "~/shared/components/field";
import type { PasswordFieldTypes } from "./password-field.types";

export const PasswordField: React.FC<PasswordFieldTypes.Props> = (props) => {
  const [visible, setVisible] = useState(false);
  const visibilityLabel = visible ? "Скрыть пароль" : "Показать пароль";

  return (
    <Field
      {...props}
      type={visible ? "text" : "password"}
      endAdornment={
        <Button
          aria-label={visibilityLabel}
          aria-pressed={visible}
          hierarchy="quiet"
          iconOnly
          iconStart={
            visible ? (
              <EyeOff aria-hidden="true" size={18} strokeWidth={1.8} />
            ) : (
              <Eye aria-hidden="true" size={18} strokeWidth={1.8} />
            )
          }
          onClick={() => setVisible((current) => !current)}
          surface="bare"
          title={visibilityLabel}
          type="button"
        />
      }
    />
  );
};
