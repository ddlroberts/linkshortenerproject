import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import "./globals.css";

export const metadata: Metadata = {
  title: "Link Shortener",
  description: "Create secure, memorable short links and manage them from a simple dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased dark"
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider appearance={{ theme: shadcn }}>
          <header className="flex items-center justify-between border-b px-6 py-3">
            <span className="font-semibold text-sm">Link Shortener</span>
            <div className="flex items-center gap-3">
                <Show when="signed-out">
                <SignInButton>
                  <Button variant="ghost" size="sm">Sign in</Button>
                </SignInButton>
                <SignUpButton>
                  <Button variant="default" size="sm">Sign up</Button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}