'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Invoice } from '@/types';
import { X, Printer, Download, CheckCircle2, Building2, CreditCard } from 'lucide-react';

interface InvoicePdfModalProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export function InvoicePdfModal({ invoice, onClose }: InvoicePdfModalProps) {
  const { activeWorkspace } = useApp();

  if (!invoice) return null;

  const totalHt = Math.round((invoice.amount / 1.2) * 100) / 100;
  const tva = Math.round((invoice.amount - totalHt) * 100) / 100;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-3xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden my-8 relative print:m-0 print:p-0 print:shadow-none print:w-full">
        {/* Modal Controls (Hidden in print) */}
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Aperçu de Facture Conforme
            </span>
            <span className="text-xs text-slate-400">• {invoice.invoiceNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer / Sauvegarder PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-8 sm:p-12 font-sans space-y-8 bg-white print:p-6" id="printable-invoice">
          {/* Top Brand & Status */}
          <div className="flex items-start justify-between pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl">
                  M
                </span>
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  mon-saas-pro
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Plateforme SaaS Multitenant & Gestion Cloud
              </p>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {invoice.status === 'paid' ? 'Facture Acquittée' : 'En Attente'}
              </span>
              <div className="text-lg font-black text-slate-900 mt-2">
                {invoice.invoiceNumber}
              </div>
            </div>
          </div>

          {/* Companies Information */}
          <div className="grid grid-cols-2 gap-8 text-xs">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                Émetteur du service
              </div>
              <div className="font-bold text-slate-900 text-sm">mon-saas-pro SAS</div>
              <div className="text-slate-600 mt-0.5">14 Rue de la Bourse</div>
              <div className="text-slate-600">75002 Paris, France</div>
              <div className="text-slate-600">SIRET : 892 411 920 00018</div>
              <div className="text-slate-600">TVA Intracommunautaire : FR 88 892411920</div>
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                Client & Workspace
              </div>
              <div className="font-bold text-slate-900 text-sm flex items-center justify-end gap-1.5">
                <span>{activeWorkspace.logo}</span>
                <span>{activeWorkspace.name}</span>
              </div>
              <div className="text-slate-600 mt-0.5">{activeWorkspace.ownerEmail}</div>
              <div className="text-slate-600">Identifiant Mobile Money : {activeWorkspace.stripeCustomerId || 'cus_LiveClient'}</div>
              <div className="text-slate-600">Forfait actif : Formule {invoice.planName}</div>
            </div>
          </div>

          {/* Invoice Dates & Terms */}
          <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <div className="text-slate-500 font-medium">Date d’émission</div>
              <div className="font-bold text-slate-900 mt-0.5">
                {new Date(invoice.date).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>
            <div>
              <div className="text-slate-500 font-medium">Date d’échéance</div>
              <div className="font-bold text-slate-900 mt-0.5">
                {new Date(invoice.dueDate).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>
            <div>
              <div className="text-slate-500 font-medium">Règlement Stripe</div>
              <div className="font-bold text-slate-900 mt-0.5 font-mono text-[11px]">
                {invoice.stripePaymentId || 'Carte CB via Stripe'}
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <table className="w-full text-left text-xs">
              <thead className="border-b-2 border-slate-900 text-slate-900 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5">Description de la prestation</th>
                  <th className="py-2.5 text-center">Quantité</th>
                  <th className="py-2.5 text-right">Prix Unitaire HT</th>
                  <th className="py-2.5 text-right">Total HT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {invoice.items && invoice.items.length > 0 ? (
                  invoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 font-medium text-slate-900">{item.description}</td>
                      <td className="py-3 text-center">{item.qty}</td>
                      <td className="py-3 text-right">
                        {(item.unitPrice / 1.2).toFixed(2)} FCFA
                      </td>
                      <td className="py-3 text-right font-semibold text-slate-900">
                        {((item.amount) / 1.2).toFixed(2)} FCFA
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-3 font-medium text-slate-900">{invoice.planName}</td>
                    <td className="py-3 text-center">1</td>
                    <td className="py-3 text-right">{totalHt.toFixed(2)} FCFA</td>
                    <td className="py-3 text-right font-semibold text-slate-900">
                      {totalHt.toFixed(2)} FCFA
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end pt-4 border-t border-slate-200">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Sous-total HT</span>
                <span className="font-semibold text-slate-900">{totalHt.toFixed(2)} FCFA</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>TVA (20,0 %)</span>
                <span className="font-semibold text-slate-900">{tva.toFixed(2)} FCFA</span>
              </div>
              <div className="pt-2 border-t-2 border-slate-900 flex justify-between text-sm font-bold text-slate-900">
                <span>Total TTC Réglé</span>
                <span className="text-base text-indigo-700">
                  {invoice.amount.toFixed(2)} FCFA
                </span>
              </div>
            </div>
          </div>

          {/* Legal notes */}
          <div className="pt-8 border-t border-slate-100 text-[10px] text-slate-500 space-y-1">
            <p>
              Règlement effectué par prélèvement automatique carte bancaire sécurisé via Stripe Inc.
            </p>
            <p>
              Conformément à l’article L.441-6 du Code de commerce, aucun escompte pour paiement anticipé. En cas de retard de paiement, une indemnité forfaitaire de compensation de 40 FCFA
              FCFA s’applique.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
