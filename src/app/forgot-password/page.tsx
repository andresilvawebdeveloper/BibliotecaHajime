"use client";

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const supabase = createClient();
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setMessage({ text: "Erro: " + error.message, type: 'error' });
    } else {
      setMessage({ text: "Email enviado! Verifique a sua caixa de entrada.", type: 'success' });
    }
    setLoading(false);
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleReset} style={formStyle}>
        <button type="button" onClick={() => router.push('/login')} style={backBtnStyle}>
          <ChevronLeft size={18} /> Voltar ao Login
        </button>

        <h2 style={titleStyle}>Recuperar Password</h2>
        <p style={subtitleStyle}>Introduza o seu email para receber um link de recuperação.</p>

        {message.text && (
          <div style={message.type === 'error' ? errorStyle : successStyle}>
            {message.text}
          </div>
        )}

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Email de Registo</label>
          <input 
            required type="email" style={inputStyle} placeholder="seu@email.com" 
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button disabled={loading} type="submit" style={btnStyle}>
          {loading ? 'A enviar...' : 'Enviar Link de Recuperação'}
        </button>
      </form>
    </div>
  );
}

// ESTILOS DARK (Consistentes)
const containerStyle: React.CSSProperties = { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F172A', padding: '20px', fontFamily: 'sans-serif' };
const formStyle: React.CSSProperties = { backgroundColor: '#1E293B', padding: '40px', borderRadius: '28px', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid #334155' };
const titleStyle: React.CSSProperties = { fontSize: '20px', fontWeight: '900', color: '#FFFFFF', margin: '20px 0 8px 0' };
const subtitleStyle: React.CSSProperties = { fontSize: '13px', color: '#94A3B8', marginBottom: '25px' };
const inputGroupStyle: React.CSSProperties = { textAlign: 'left', marginBottom: '20px' };
const labelStyle: React.CSSProperties = { fontSize: '11px', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px', display: 'block' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 16px', borderRadius: '12px', backgroundColor: '#0F172A', border: '1px solid #334155', color: 'white', outline: 'none', boxSizing: 'border-box' };
const btnStyle: React.CSSProperties = { width: '100%', padding: '14px', backgroundColor: '#0055A4', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' };
const backBtnStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '13px' };
const errorStyle: React.CSSProperties = { backgroundColor: '#7F1D1D', color: '#FECACA', padding: '12px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px' };
const successStyle: React.CSSProperties = { backgroundColor: '#064E3B', color: '#D1FAE5', padding: '12px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px' };