import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0e27] text-white">
      {/* HEADER - PUBLIQUE */}
      <header className="flex justify-between items-center p-6 max-w-6xl mx-auto">
        <h1 className="text-xl font-bold flex items-center gap-2">
          🚀 Acme Cloud Solutions
        </h1>
        <Link href="/inbox" className="bg-white text-black px-4 py-2 rounded-lg font-bold">
          Connexion
        </Link>
      </header>

      {/* HERO - INTERFACE PUBLIQUE POUR CLIENTÈLE */}
      <main className="max-w-6xl mx-auto px-6 py-20 text-center">
        <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-sm">
          ESPACE MULTITENANT OPÉRATIONNEL
        </span>

        <h2 className="text-5xl font-bold mt-6 leading-tight">
          Bienvenue sur <br />Acme Cloud Solutions
        </h2>

        <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-lg">
          Supervisez l'ensemble de vos sprints, suivez vos tâches en Kanban interactif et synchronisez vos factures déductibles Stripe sans friction.
        </p>

        <div className="mt-8 flex gap-4 justify-center">
          <Link href="/inbox" className="bg-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-700">
            Commencer - 15000 FCFA/mois
          </Link>
          <a href="#prix" className="border border-gray-700 px-8 py-3 rounded-lg hover:bg-gray-800">
            Voir les prix
          </a>
        </div>

        {/* 3 CARTES PRIX */}
        <div id="prix" className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-[#141a3a] p-6 rounded-xl">
            <h3 className="font-bold">4 membres</h3>
            <p className="text-sm text-gray-400 mt-1">Rôles & Invitations</p>
          </div>
          <div className="bg-[#141a3a] p-6 rounded-xl">
            <h3 className="font-bold">1/2 tâches terminées</h3>
            <p className="text-sm text-gray-400 mt-1">Vélocité sprint optimale 60%</p>
          </div>
          <div className="bg-[#141a3a] p-6 rounded-xl border border-blue-600">
            <h3 className="text-2xl font-bold">15000 FCFA / mois</h3>
            <p className="text-sm text-green-400 mt-1">Forfait PRO actif +14.5%</p>
            <Link href="/inbox" className="mt-4 block bg-blue-600 text-center py-2 rounded-lg font-bold hover:bg-blue-700">
              Gérer les Factures
            </Link>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center text-gray-600 text-sm py-8">
        © 2026 Acme Cloud Solutions - Garoua, Cameroun
      </footer>
    </div>
  );
}