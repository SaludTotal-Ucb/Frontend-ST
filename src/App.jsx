function App() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 text-slate-800">
      <section className="mx-auto flex max-w-4xl flex-col items-center px-6 py-20 text-center">
        <p className="mb-3 rounded-full bg-brand-100 px-4 py-1 text-sm font-semibold text-brand-700">
          React + Tailwind CSS
        </p>
        <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Frontend ST listo para construir interfaces modernas
        </h1>
        <p className="mt-5 max-w-2xl text-pretty text-base text-slate-600 sm:text-lg">
          Tu proyecto ahora usa React con Vite y Tailwind CSS. Puedes empezar creando componentes
          dentro de src/app/components y páginas en src/app/pages.
        </p>
        <div className="mt-10 grid w-full gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-brand-200/60 bg-white/80 p-6 shadow-sm backdrop-blur">
            <h2 className="text-lg font-semibold text-brand-800">Desarrollo rápido</h2>
            <p className="mt-2 text-sm text-slate-600">
              Ejecuta npm run dev para levantar el entorno local.
            </p>
          </div>
          <div className="rounded-2xl border border-brand-200/60 bg-white/80 p-6 shadow-sm backdrop-blur">
            <h2 className="text-lg font-semibold text-brand-800">Estilos utilitarios</h2>
            <p className="mt-2 text-sm text-slate-600">
              Usa clases de Tailwind para prototipar sin salir del JSX.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
