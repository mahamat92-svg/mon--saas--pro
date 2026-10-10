'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Invoice } from '@/types';
import {
  FileText,
  Download,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Key,
  ShieldCheck,
  Printer,
  Sparkles,
} from 'lucide-react';
import { InvoicePdfModal } from './InvoicePdfModal';
import { StripeApiConfigModal } from './StripeApiConfigModal';
import confetti from 'canvas-confetti';

export function InvoicesTable() {
  const { invoices, payInvoice, activeWorkspace, stripeConfig, searchQuery } = useApp();
  const [selectedInvoiceForPdf, setSelectedInvoiceForPdf] = useState<Invoice | null>(null);
  const [isStripeConfigOpen, setIsStripeConfigOpen] = useState(false);

  const filteredInvoices = invoices.filter((inv) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.planName.toLowerCase().includes(q) ||
      inv.amount.toString().includes(q) ||
      (inv.stripePaymentId && inv.stripePaymentId.toLowerCase().includes(q))
    );
  });

  const handlePay = (invoiceId: string) => {
    payInvoice(invoiceId);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleExportCsv = () => {
    if (filteredInvoices.length === 0) return;
    const csvRows = [
      'Numero;Date;Echeance;Montant;Devise;Statut;RefStripe;Forfait',
      ...filteredInvoices.map((inv) =>
        `"${inv.invoiceNumber}";"${inv.date}";"${inv.dueDate}";"${inv.amount}";"${inv.currency}";"${inv.status}";"${inv.stripePaymentId || ''}";"${inv.planName}"`
      ),
    ];
    const blob = new Blob([csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `factures_${activeWorkspace.slug}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Payée
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" />
            En attente
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3 h-3" />
            Échouée
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Stripe Payment Method & Credentials Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Payment Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800 backdrop-blur-xl flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-xs text-white">
              VISA
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>•••• •••• •••• 4242</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded font-mono">
                  Par défaut
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Expire 12/28 • Facturé à {activeWorkspace.name}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsStripeConfigOpen(true)}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            Modifier
          </button>
        </div>

        {/* Stripe API Status */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Stripe Gateway Connecté</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Clé test : <code className="text-slate-300">{stripeConfig.publishableKey.slice(0, 16)}...</code>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsStripeConfigOpen(true)}
            className="px-3 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Key className="w-3.5 h-3.5 text-indigo-400" />
            <span>Clés API</span>
          </button>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Historique des Factures Stripe</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Consultez vos reçus déductibles et téléchargez les duplicatas PDF aux normes françaises
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400">
              {filteredInvoices.length} facture{filteredInvoices.length > 1 ? 's' : ''} affichée{filteredInvoices.length > 1 ? 's' : ''}
            </span>
            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Exporter CSV</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Facture</th>
                <th className="py-3 px-4">Date d’émission</th>
                <th className="py-3 px-4">Prestation / Forfait</th>
                <th className="py-3 px-4">Montant TTC</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4">Réf. Stripe</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Aucune facture ne correspond aux critères.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      <span>{inv.invoiceNumber}</span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(inv.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-200">
                      {inv.planName}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-white">
                      {inv.amount.toFixed(2)} €
                    </td>

                    <td className="py-3.5 px-4">{getStatusBadge(inv.status)}</td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {inv.stripePaymentId || 'En attente'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {inv.status === 'pending' && (
                          <button
                            onClick={() => handlePay(inv.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] shadow-sm transition-colors"
                          >
                            Payer
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedInvoiceForPdf(inv)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/20 text-indigo-400 hover:text-white font-semibold text-[11px] flex items-center gap-1 transition-all"
                        >
                          <Printer className="w-3 h-3" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF Modal */}
      <InvoicePdfModal
        invoice={selectedInvoiceForPdf}
        onClose={() => setSelectedInvoiceForPdf(null)}
      />

      {/* Stripe Credentials Modal */}
      <StripeApiConfigModal
        isOpen={isStripeConfigOpen}
        onClose={() => setIsStripeConfigOpen(false)}
      />
    </div>
  );
}
