import type { ReactNode } from "react";
import SubpageLayout from "../../components/SubpageLayout";

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return <SubpageLayout>{children}</SubpageLayout>;
}
