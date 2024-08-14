export default function MainLayout({children, pageTitle, classNames}: {children: JSX.Element, pageTitle: string, classNames?: string}) {
  return (
    <main className="pt-14 md:pt-0 md:pl-64 h-screen w-screen overflow-hidden flex">
    <div className={`${classNames} shadow-lg px-6 py-6 md:m-4 rounded-2xl md:border h-screen md:h-auto w-full`}>
      <h1>{pageTitle}</h1>
      {children}
    </div>
  </main>
  )
}
