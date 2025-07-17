import React from "react";
import A4Page from "../atoms/A4Page";
import CredentialSheet from "../organisms/CredencialSheet";


const CredentialPageGroup = ({ pages, side, printRef }) => {
  const isPrint = !!printRef;
  return (
    <>
      {pages.map((grupo, idx) => (
        <A4Page
          key={idx}
          ref={idx === 0 && isPrint ? printRef : null}
          forPrint={isPrint}
          style={{ marginBottom: "16px" }}
        >
          <CredentialSheet persons={grupo} side={side} />
        </A4Page>
      ))}
    </>
  );
};

export default CredentialPageGroup;
