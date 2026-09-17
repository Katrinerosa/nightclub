"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavigationProps = {
  isLoggedIn: boolean;
  logoutAction: () => Promise<void>;
};

export default function Navigation({ isLoggedIn, logoutAction }: NavigationProps) {
  const pathname = usePathname();
  const activeClass = "border-b border-pink-500 pb-2 text-pink-500";
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const links = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    { href: "/book-table", label: "Book Table" },
    { href: "/contact", label: "Contact Us" },
  ];

  if (isLoggedIn) links.push(
    { href: "/my-comments", label: "My Comments" },
    { href: "/my-bookings", label: "My Bookings" },
  );

  return (
    <nav aria-label="Hovednavigation" className="mx-auto flex min-h-20 max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
      <Link href="/" className="text-xl font-bold">
        NIGHT<span className="text-pink-500">CLUB</span>
      </Link>
      <ul className="flex flex-wrap items-center gap-5 text-xs uppercase">
        {links.map((link) => {
          const active = isActive(link.href);
          return (
            <li key={link.href}>
              <Link href={link.href} aria-current={active ? "page" : undefined} className={active ? activeClass : undefined}>
                {link.label}
              </Link>
            </li>
          );
        })}
        <li>
          {isLoggedIn ? (
            <form action={logoutAction}>
              <button type="submit" className="cursor-pointer uppercase">Log out</button>
            </form>
          ) : (
            <Link href="/login" aria-current={pathname === "/login" ? "page" : undefined} className={pathname === "/login" ? activeClass : undefined}>Log in</Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
