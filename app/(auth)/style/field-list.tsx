/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useFormikContext } from "formik";
import FormikController from "@/custom-components/formik-controller";
import type { AuthField } from "../interface";
import { AUTH_STYLES } from "./auth-styles";

export function FieldList({ fields }: { fields: AuthField[] }) {
  const { values, setFieldValue, setFieldTouched } =
    useFormikContext<Record<string, any>>();

  // Clear dependent fields when their controlling switch is turned off
  useEffect(() => {
    fields.forEach((f) => {
      if (f.showWhen && !values[f.showWhen] && values[f.name]) {
        setFieldValue(f.name, "");
        setFieldTouched(f.name, false, false);
      }
    });
  }, [fields, values, setFieldValue, setFieldTouched]);

  return (
    <>
      {fields
        .filter((field) => !field.showWhen || values[field.showWhen])
        .map((field) => (
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