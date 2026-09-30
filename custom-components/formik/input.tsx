import React from 'react'
import { Field,ErrorMessage } from 'formik'
import { FormikControllerProps } from './formik-controller'
function Input(props:FormikControllerProps) {
    const {label,name, ...rest} =props
  return (
    <div className={props.className}>
        <label htmlFor='name'>{label}</label>
        <Field id={name} name={name} {...rest} className={props.fieldstyle}/>
        <ErrorMessage name={name} className='text-red-400' />

    </div>
  )
}

export default Input