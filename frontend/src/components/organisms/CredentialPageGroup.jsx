import React from "react";
import A4Page from "../atoms/A4Page";
import CredentialSheet from "../organisms/CredencialSheet";

const CredentialPageGroup = ({ pages, side, printRef, cargos, accesoComputo }) => {
  const isPrint = !!printRef;
  return (
    <>
      {pages.map((grupo, idx) => (
        <A4Page
          key={idx}
          ref={idx === 0 && isPrint ? printRef : null}
          forPrint={isPrint}
        >
          <CredentialSheet
            persons={grupo}
            side={side}
            cargos={cargos}
            accesoComputo={accesoComputo} // PASAMOS A CredentialSheet
          />
        </A4Page>
      ))}
    </>
  );
};


export default CredentialPageGroup;
