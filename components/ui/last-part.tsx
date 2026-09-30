import TextCompoment from "@/custom-components/text/custom-text";
import Link from "next/link";
import React from "react";
interface LastComponentAttributes {
  maincontainer?: string;
  accounttext: string;
  lasttext: string;
  LastTextStyle?:string
}
const  LastComponent: React.FC<LastComponentAttributes> = ({
  maincontainer,
  accounttext,
  lasttext,
}) => {
  return (
    <div className={maincontainer}>
      <TextCompoment text={accounttext} />
      <Link href='/page/auth/register'>
        <TextCompoment text={lasttext} />
      </Link>
    </div>
  );
};

export default LastComponent;
