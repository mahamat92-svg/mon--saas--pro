import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <nav className="max-w-6xl mx-auto flex justify-between items-center p-6">
        <div className="font-black text-xl">InnovTech<span className="text-green-600">.</span></div>
        <Link href="/inbox" className="bg-black text-white px-6 py-2.5 rounded-full font-bold text-sm">
          Dashboard InnovTech
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <p className="bg-green-50 text-green-700 inline-block px-4 py-1 rounded-full text-xs font-bold">✅ Déjà utilisé par 127 boutiques au Cameroun</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mt-6">Vos clients vous écrivent, <span className="text-green-600">vous répondez en 1 clic.</span></h1>
          <p className="text-zinc-500 text-lg mt-6">InnovTech centralise WhatsApp, Messenger et messages site web dans votre SaaS. Fini Make compliqué. Tout dans votre inbox.</p>

          <div className="mt-8 flex flex-col items-center gap-3">
            <Link href="/inbox" className="bg-black text-white px-10 py-4 rounded-full font-bold text-lg w-full md:w-auto text-center">Commencer - 14 jours gratuits</Link>
            <span className="text-xs text-zinc-400">Puis 15.000 FCFA/mois ou $29/mois - Annulez quand vous voulez</span>
          </div>
        </div>

        {/* PRIX POUR GAGNER DE L'ARGENT */}
        <div className="grid md:grid-cols-3 gap-6 mt-24">
          <div className="border border-zinc-200 p-8 rounded-[24px]">
            <h3>Starter</h3><p className="text-3xl font-black mt-2">0 FCFA</p>
            <p className="text-sm text-zinc-500 mt-4">20 conversations / mois</p>
          </div>
          <div className="bg-zinc-900 text-white p-8 rounded-[24px] scale-105">
            <h3 className="font-bold">PRO - Le plus vendu</h3><p className="text-3xl font-black mt-2">15.000 FCFA / $29</p>
            <p className="text-sm text-zinc-400 mt-4">Messages illimités + WhatsApp InnovTech connecté + Factures auto</p>
            <div className="mt-6 bg-white text-black py-3 rounded-full text-center font-bold">Le plus rentable</div>
          </div>
          <div className="border border-zinc-200 p-8 rounded-[24px]">
            <h3>Business</h3><p className="text-3xl font-black mt-2">50.000 FCFA / $99</p>
            <p className="text-sm text-zinc-500 mt-4">Multi-agents + API</p>
          </div>
        </div>
      </div>
    </div>
  );
}