import { tv } from "tailwind-variants";

const navbarStyles = tv({
  base: "flex items-center justify-between border-b border-border-primary bg-bg-page px-10 py-3",
});

const navbarLogoStyles = tv({
  base: "flex items-center gap-2 font-mono",
});

interface NavbarProps extends React.HTMLAttributes<HTMLElement> {}

const Navbar = ({ className, children, ...props }: NavbarProps) => {
  return (
    <nav className={navbarStyles({ className })} {...props}>
      {children}
    </nav>
  );
};

interface NavbarLogoProps extends React.HTMLAttributes<HTMLDivElement> {}

const NavbarLogo = ({ className, ...props }: NavbarLogoProps) => {
  return (
    <div className={navbarLogoStyles({ className })} {...props}>
      <span className="text-xl font-bold text-accent-green">{">"}</span>
      <span className="text-lg font-medium text-text-primary">devroast</span>
    </div>
  );
};

export { Navbar, NavbarLogo, navbarStyles, navbarLogoStyles, type NavbarProps, type NavbarLogoProps };
