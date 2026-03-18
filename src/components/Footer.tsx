"use client";

import React from 'react';
import { Shield, Scale, Info, MapPin, Mail } from 'lucide-react';

export default function Footer() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        
        {/* COLUNA 1: IDENTIDADE */}
        <div style={columnStyle}>
          <div style={logoFlex}>
            <img src="/icons/logo-hajime.jpg" alt="Logo Hajime" style={logoStyle} />
            <div>
              <h4 style={brandTitle}>Clube de Judo Hajime</h4>
              <p style={brandSub}>Hajime Manager v1.0</p>
            </div>
          </div>
          <p style={description}>
            Plataforma exclusiva para apoio ao ensino e planeamento técnico dos treinadores do clube.
          </p>
        </div>

        {/* COLUNA 2: LEGAL E PRIVACIDADE */}
        <div style={columnStyle}>
          <h4 style={titleStyle}><Shield size={16} /> Jurídico</h4>
          <nav style={navStyle}>
            <a href="#" style={linkStyle}>Termos de Utilização</a>
            <a href="#" style={linkStyle}>Política de Privacidade (RGPD)</a>
            <a href="#" style={linkStyle}>Gestão de Cookies</a>
          </nav>
        </div>

        {/* COLUNA 3: APOIO E CONTACTO */}
        <div style={columnStyle}>
          <h4 style={titleStyle}><Info size={16} /> Suporte Técnico</h4>
          <div style={contactStyle}>
            <div style={contactItem}><MapPin size={14} /> Portugal</div>
            <div style={contactItem}><Mail size={14} /> geral@clubedejudohajime.pt</div>
          </div>
        </div>
      </div>

      {/* BARRA INFERIOR DE COPYRIGHT */}
      <div style={bottomBarStyle}>
        <div style={bottomContainer}>
          <span>© {anoAtual} Clube de Judo Hajime. Todos os direitos reservados.</span>
          <span style={legalText}>
            Registado de acordo com a legislação desportiva portuguesa.
          </span>
        </div>
      </div>
    </footer>
  );
}

// ESTILOS
const footerStyle: React.CSSProperties = { backgroundColor: '#FFFFFF', borderTop: '1px solid #E5E7EB', padding: '60px 0 0 0', marginTop: 'auto' };
const containerStyle: React.CSSProperties = { maxWidth: '1100px', margin: '0 auto', padding: '0 20px 40px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' };
const columnStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '15px' };
const logoFlex: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' };
const logoStyle: React.CSSProperties = { width: '45px', borderRadius: '10px' };
const brandTitle: React.CSSProperties = { margin: 0, fontSize: '16px', fontWeight: '900', color: '#111827' };
const brandSub: React.CSSProperties = { margin: 0, fontSize: '11px', color: '#94A3B8', fontWeight: '700', letterSpacing: '1px' };
const description: React.CSSProperties = { fontSize: '13px', color: '#64748B', lineHeight: '1.6', margin: 0 };
const titleStyle: React.CSSProperties = { fontSize: '14px', fontWeight: '800', color: '#0055A4', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' };
const navStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '10px' };
const linkStyle: React.CSSProperties = { fontSize: '13px', color: '#64748B', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' };
const contactStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '8px' };
const contactItem: React.CSSProperties = { fontSize: '13px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px' };
const bottomBarStyle: React.CSSProperties = { backgroundColor: '#F9FAFB', borderTop: '1px solid #E5E7EB', padding: '20px 0' };
const bottomContainer: React.CSSProperties = { maxWidth: '1100px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '11px', color: '#94A3B8', fontWeight: '600' };
const legalText: React.CSSProperties = { textTransform: 'uppercase', letterSpacing: '0.5px' };