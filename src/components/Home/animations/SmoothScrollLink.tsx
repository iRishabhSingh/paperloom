"use client";

import { ReactNode, MouseEvent } from "react";
import Link from "next/link";

interface SmoothScrollLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  [key: string]: ReactNode | string | undefined;
}

const SmoothScrollLink = ({
  href,
  children,
  className,
  ...props
}: SmoothScrollLinkProps) => {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith("#")) return; // Only handle internal hash links

    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      });

      // Update the URL without causing a full page reload
      window.history.pushState(null, "", href);
    }
  };

  return (
    <Link href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
};

export default SmoothScrollLink;
