import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, LayoutDashboard, Link2, ShieldCheck } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Link Shortener",
  description: "Create secure, memorable short links and manage them from a simple dashboard.",
};

const features: Array<{
  icon: LucideIcon;
  title: string;
  description: string;
}> = [
  {
    icon: Link2,
    title: "Memorable short links",
    description: "Turn long URLs into clean, branded links that are easier to share anywhere.",
  },
  {
    icon: LayoutDashboard,
    title: "One place to manage links",
    description: "Keep your shortened links organized in a dedicated dashboard built for quick updates.",
  },
  {
    icon: ShieldCheck,
    title: "Protected with authentication",
    description: "Sign in before managing your links so your workspace stays secure and private.",
  },
];

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main className="flex-1 bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-16 sm:px-10 lg:px-12">
        <section className="grid gap-10 rounded-3xl border bg-card p-8 shadow-sm dark:bg-card/80 lg:grid-cols-[minmax(0,1.4fr)_minmax(20rem,1fr)] lg:items-center lg:p-12">
          <div className="flex flex-col gap-6">
            <span className="w-fit rounded-full border bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
              Shorten, organize, and share links faster
            </span>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                A simple link shortener for clean URLs and quick sharing.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Link Shortener helps you create memorable short links, keep them organized in one
                place, and protect access with secure sign-in before you manage your workspace.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                <Button size="lg">
                  Start shortening
                  <ArrowRight className="size-4" />
                </Button>
              </SignUpButton>
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <Button variant="outline" size="lg">Sign in to continue</Button>
              </SignInButton>
            </div>
          </div>
          <div className="grid gap-4 rounded-2xl border bg-muted/40 p-6">
            <div className="rounded-2xl border bg-background p-5 shadow-sm">
              <p className="text-sm font-medium text-muted-foreground">Built for everyday sharing</p>
              <p className="mt-3 text-2xl font-semibold text-foreground">Create links you can remember</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Replace long, hard-to-read URLs with short links that look cleaner in messages,
                docs, and campaigns.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border bg-background p-4">
                <p className="text-sm font-medium text-foreground">Secure access</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Authentication keeps link management behind sign-in.
                </p>
              </div>
              <div className="rounded-2xl border bg-background p-4">
                <p className="text-sm font-medium text-foreground">Central dashboard</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Manage every short link from a single place after you sign in.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="grid gap-6 lg:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-2xl border bg-card p-6 shadow-sm">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-muted text-foreground">
                <feature.icon className="size-5" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-foreground">{feature.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{feature.description}</p>
            </article>
          ))}
        </section>

        <section className="flex flex-col gap-6 rounded-3xl border bg-muted/40 p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">Ready to share shorter links?</h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Create an account to start managing links from your dashboard, or explore the app
              first if you already have access.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
              <Button>Create your account</Button>
            </SignUpButton>
            <Link
              href="#features"
              className={cn(buttonVariants({ variant: "outline" }), "justify-center")}
            >
              Explore the features
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
