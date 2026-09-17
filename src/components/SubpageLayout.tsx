import type { ReactNode } from "react";
import Header from "./Header";

export default function SubpageLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
