import Breadcrumb from "./Breadcrumb";

export default function PageHero({ title, subtitle, items = [], children }) {
  return (
    <section className="surface-deep">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
        <Breadcrumb items={items} />
        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-sm opacity-80 sm:text-base">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-7">{children}</div>}
      </div>
    </section>
  );
}
