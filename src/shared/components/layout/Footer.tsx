/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function Footer() {
  const links = [
    { label: 'Términos de Servicio', href: '#' },
    { label: 'Política de Privacidad', href: '#' },
    { label: 'Juego Responsable', href: '#' },
    { label: 'Soporte Técnico', href: '#' },
    { label: 'Afiliados', href: '#' }
  ];

  return (
    <footer className="bg-slate-950 text-slate-500 w-full py-8 sm:py-12 px-4 border-t border-slate-900 flex flex-col items-center gap-4 sm:gap-6 text-center mt-auto">
      <div className="text-secondary/50 font-lexend font-bold text-lg tracking-widest">
        ELGRANCESAR
      </div>
      
      <nav className="flex flex-wrap justify-center gap-x-4 sm:gap-x-8 gap-y-3">
        {links.map((link) => (
          <a 
            key={link.label}
            href={link.href} 
            className="hover:text-tertiary transition-colors font-lexend text-xs uppercase tracking-tight"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="text-slate-600 font-lexend text-[9px] sm:text-[10px] uppercase tracking-widest px-2">
        © {new Date().getFullYear()} ELGRANCESAR. Todos los derechos reservados. 18+ Juega con responsabilidad.
      </div>
    </footer>
  );
}
