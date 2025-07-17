import React, { forwardRef } from "react";

const A4Page = forwardRef(({ children, style = {}, ...props }, ref) => {
  // Si se pasa prop 'forPrint', no aplica el margin visual
  const { forPrint, ...restProps } = props;
  return (
    <div
      ref={ref}
      {...restProps}
      style={{
        width: "21cm",
        minHeight: "29.7cm",
        padding: "0.5cm",
        backgroundColor: "white",
        boxSizing: "border-box",
        boxShadow: "0 0 5px rgba(0,0,0,0.1)",
        breakAfter: "page",
        pageBreakAfter: "always",
        ...(forPrint ? {} : { margin: "0.5cm auto" }),
        ...style,
      }}
    >
      {children}
    </div>
  );
});

export default A4Page;



