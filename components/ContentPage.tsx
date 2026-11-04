import type { ReactNode } from "react";

type ContentPageProps = {
  title: string;
  lede?: string;
  children: ReactNode;
};

export function ContentPage({
  title,
  lede,
  children,
}: ContentPageProps) {
  return (
    <main
      id="main"
      className="content-page content-page--with-announcement"
    >
      <div className="content-page-inner">
        <header className="content-page-header">
          <h1>{title}</h1>
          {lede ? <p className="content-page-lede">{lede}</p> : null}
        </header>
        <div className="content-page-body">{children}</div>
      </div>
    </main>
  );
}
