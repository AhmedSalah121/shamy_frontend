import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-[#3A1011] bg-[#481617] text-[#EFE4DC] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-[#5C1F20]">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#9E2A22] text-[#FAF4F1] flex items-center justify-center font-bold text-sm">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </span>
              <span className="font-extrabold text-base tracking-tight text-white">Shamy</span>
            </div>
            <p className="text-[11px] text-[#D8C5BC] leading-relaxed">
              Egyptian office breakfast collaboration, pickup hero lottery, and multi-payer Fakka change settlement.
            </p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="w-3 h-3 rounded-full bg-[#68A8CF]" title="Sky Blue"></span>
              <span className="w-3 h-3 rounded-full bg-[#0E4D92]" title="Cobalt"></span>
              <span className="w-3 h-3 rounded-full bg-[#9E2A22]" title="Terracotta"></span>
              <span className="w-3 h-3 rounded-full bg-[#BD5346]" title="Coral"></span>
              <span className="w-3 h-3 rounded-full bg-[#F3B3A6]" title="Blush"></span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Navigation</h4>
            <ul className="space-y-2 text-[#D8C5BC]">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Active Orders</Link>
              </li>
              <li>
                <Link href="/orders/new" className="hover:text-white transition-colors">Start Breakfast Run</Link>
              </li>
              <li>
                <Link href="/notifications" className="hover:text-white transition-colors">Notifications</Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white transition-colors">InstaPay Profile</Link>
              </li>
            </ul>
          </div>

          {/* How it works */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Features</h4>
            <ul className="space-y-2 text-[#D8C5BC]">
              <li>
                <span className="hover:text-white cursor-default">Synchronized Team Cart</span>
              </li>
              <li>
                <span className="hover:text-white cursor-default">Fair Hero Randomizer</span>
              </li>
              <li>
                <span className="hover:text-white cursor-default">Fakka (&quot;فكة&quot;) Banknote Math</span>
              </li>
              <li>
                <span className="hover:text-white cursor-default">Multi-Payer Reimbursements</span>
              </li>
            </ul>
          </div>

          {/* Office Rules */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Office Etiquette</h4>
            <p className="text-[11px] text-[#D8C5BC] leading-relaxed">
              Order creator never runs downstairs. Change is tracked automatically down to 1 EGP. InstaPay transfers confirmed in 1 click.
            </p>
            <p className="text-[10px] text-[#BCA59C] mt-2">
              Hot Foul & Falafel tastes best together.
            </p>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#BCA59C]">
          <p>© {new Date().getFullYear()} Shamy Web. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition-colors">Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
