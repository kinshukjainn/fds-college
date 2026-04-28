import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech || Mscada",
  description: "Technical details and documentation of fds.ai project ",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
