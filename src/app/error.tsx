"use client";

interface IErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage = (props: IErrorPageProps) => {
  const { reset } = props;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8">
      <p className="utility-label text-[11px] font-semibold text-accent">Erro</p>
      <h1 className="mt-2 font-display text-4xl font-semibold">A mesa não respondeu</h1>
      <p className="mt-3 max-w-xl text-muted">A página falhou ao carregar. Tente de novo, ou volte para o início.</p>
      <button type="button" onClick={reset} className="utility-label-soft mt-6 bg-accent px-4 py-2 text-xs font-semibold text-panel">
        Tentar de novo
      </button>
    </div>
  );
};

export default ErrorPage;
