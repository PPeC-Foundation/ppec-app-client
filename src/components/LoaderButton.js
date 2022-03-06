import React from "react";
import "./LoaderButton.css";

export default function LoaderButton({
    isLoading,
    className = "",
    disabled = false,
    ...props
}) {
    return (
        <button
            className={`LoaderButton ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <i className='fa fa-spinner'></i>}
            {props.children}
        </button>
    );
}