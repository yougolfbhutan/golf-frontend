"use client";

import FormikController from "@/custom-components/formik-controller";
import type { AuthField } from "../interface";
import { AUTH_STYLES } from "./auth-styles";


/** Same idea as your `formloginFields.map(...)`, with the golfer styles applied. */
export function FieldList({ fields }: { fields: AuthField[] }) {
  return (
    <>
      {fields.map((field) => (
        <FormikController
          key={field.name}
          fieldConfig={field}
          label={field.label}
          name={field.name}
          className={AUTH_STYLES.group}
          fieldstyle={AUTH_STYLES.input}
          errorstyle={AUTH_STYLES.error}
        />
      ))}
    </>
  );
}