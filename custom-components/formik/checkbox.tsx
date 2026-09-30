import React from "react";
import { Field, ErrorMessage, FieldProps } from "formik";
import { FormikControllerProps } from "./formik-controller";
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link";
import TextCompoment from "../text/custom-text";

function CheckBox(props: FormikControllerProps) {
  const { label, name, checkmainstyle, id } = props;
  return (
    <div className={checkmainstyle}>
      <div className="flex items-center justify-between  ">
        <div className="flex gap-2">
          <Field
          name={name}
          render={({ field }: FieldProps) => (

            <Checkbox {...field} id={id} className="w-6 h-6 bg-amber-600" />
          )}
        />
        <TextCompoment text="Remember Me"/>
        </div>
        <Link href="/#">
           <label htmlFor={name}>{label}</label>
        </Link>
       
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-400 text-sm"
      />
    </div>
  );
}

export default CheckBox;
