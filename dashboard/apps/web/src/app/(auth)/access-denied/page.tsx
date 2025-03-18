export default function AccessDenied() {
  return (
    <div className="flex w-full pr-6 min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
        <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
        <a href="/agenda" className="text-violet-600 hover:underline">Voltar para a página inicial</a>
      </div>
    </div>
  );
}