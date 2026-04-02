"use client";

import { tv } from "tailwind-variants";

const navbarStyles = tv({
  base: "flex items-center justify-between border-b border-border-primary bg-bg-page px-10 py-3",
});

const navbarLogoStyles = tv({
  base: "flex items-center gap-2 font-mono",
});

const navbarLinkStyles = tv({
  base: "cursor-pointer font-mono text-sm text-text-primary transition-colors hover:text-accent-green",
});

interface NavbarProps extends React.HTMLAttributes<HTMLElement> {}

const Navbar = ({ className, children, ...props }: NavbarProps) => {
  return (
    <nav className={navbarStyles({ className })} {...props}>
      {children}
    </nav>
  );
};

interface NavbarLogoProps extends React.HTMLAttributes<HTMLAnchorElement> {}

const NavbarLogo = ({ className, ...props }: NavbarLogoProps) => {
  return (
    <a href="/" className={navbarLogoStyles({ className })} {...props}>
      <span className="text-xl font-bold text-accent-green">{">"}</span>
      <span className="text-lg font-medium text-text-primary">devroast</span>
    </a>
  );
};

interface NavbarLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string;
}

const NavbarLink = ({
  className,
  href,
  children,
  ...props
}: NavbarLinkProps) => {
  return (
    <a href={href} className={navbarLinkStyles({ className })} {...props}>
      {children}
    </a>
  );
};

export {
  Navbar,
  NavbarLink,
  type NavbarLinkProps,
  NavbarLogo,
  type NavbarLogoProps,
  type NavbarProps,
  navbarLinkStyles,
  navbarLogoStyles,
  navbarStyles,
};
