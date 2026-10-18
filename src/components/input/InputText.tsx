import React from 'react'

interface InputTextProps {
    style?: string
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    id?: string
    value?: string
    type?: string

}

export const InputText: React.FC<InputTextProps> = ({
     style, type = "text", ...otherProps
} : InputTextProps) => {
    return (
        <input type={type} 
                {...otherProps}
                className={`${style} border px-3 py-2 roudend-lg text-gray-500`} />
                    
    )

}