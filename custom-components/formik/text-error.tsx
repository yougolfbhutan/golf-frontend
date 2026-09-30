import React, { ReactNode } from 'react'
interface TextErrorProps {
  children: ReactNode;
}
function TextError({children}:TextErrorProps) {
  return (
    <div className='error'>
        {children}
    </div>
  )
}

export default TextError