import React, { forwardRef } from "react";

const A4Page = forwardRef(({ children, style = {}, ...props }, ref) => {
  // Si se pasa prop 'forPrint', no aplica el margin visual
  const { forPrint, ...restProps } = props;
  return (
    <div
      ref={ref}
      {...restProps}
      style={{
        width: "210mm",
        height: "297mm",
        padding: "0.5cm",
        backgroundColor: "#fff",
        boxSizing: "border-box",
        overflow: "hidden",
        breakAfter: "page",
        pageBreakAfter: "always",
        ...(forPrint ? { boxShadow: "none" } : { margin: "0.5cm auto", boxShadow: "0 0 5px rgba(0,0,0,0.1)" }),
        ...style,
      }}
    >
      {children}
    </div>
  );
});

export default A4Page;



