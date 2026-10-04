import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PC Builder - Build Your Custom PC",
  description: "Configure and build your customized PC in Bangladesh with real-time component compatibility.",
};

export default function PCBuilderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
