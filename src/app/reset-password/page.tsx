"use client";

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function ResetPasswordPage() {
  const [novaPassword, setNovaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const supabase = createClient();
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (novaPassword !== confirmarPassword) {
      setMessage({ text: "As passwords não coincidem.", type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    const { error } = await supabase.auth.updateUser({
      password: novaPassword
    });

    if (error) {
      setMessage({ text: "Erro: " + error.message, type: 'error' });
    } else {
      setMessage({ text: "Password atualizada com sucesso!", type: 'success' });
      // Redireciona após 2 segundos
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
    setLoading(false);
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleUpdatePassword} style={formStyle}>
        <div style={iconCircleStyle}>
          <Lock size={24} color="#38BDF8" />
        </div>

        <h2 style={titleStyle}>Nova Password</h2>
        <p style={subtitleStyle}>Defina a sua nova chave de acesso ao Hajime Manager.</p>

        {message.text && (
          <div style={message.type === 'error' ? errorStyle : successStyle}>
            {message.text}
          </div>
        )}

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Nova Password</label>
          <input 
            required 
            type="password" 
            style={inputStyle} 
            placeholder="Minímo 6 caracteres" 
            value={novaPassword}
            onChange={(e) => setNovaPassword(e.target.value)}
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Confirmar Nova Password</label>
          <input 
            required 
            type="password" 
            style={inputStyle} 
            placeholder="Repita a password" 
            value={confirmarPassword}
            onChange={(e) => setConfirmarPassword(e.target.value)}
          />
        </div>

        <button disabled={loading} type="submit" style={btnStyle}>
          {loading ? 'A atualizar...' : 'Confirmar Nova Password'}
        </button>
      </form>
    </div>
  );
}

// ESTILOS DARK MODE (Consistentes)
const containerStyle: React.CSSProperties = { 
  height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', 
  backgroundColor: '#0F172A', padding: '20px', fontFamily: 'sans-serif' 
};

const formStyle: React.CSSProperties = { 
  backgroundColor: '#1E293B', padding: '40px', borderRadius: '28px', 
  width: '100%', maxWidth: '400px', textAlign: 'center', 
  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid #334155' 
};

const iconCircleStyle: React.CSSProperties = {
  width: '50px', height: '50px', backgroundColor: '#0F172A', borderRadius: '50%',
  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
};

const titleStyle: React.CSSProperties = { fontSize: '22px', fontWeight: '900', color: '#FFFFFF', margin: '0 0 8px 0' };
const subtitleStyle: React.CSSProperties = { fontSize: '14px', color: '#94A3B8', marginBottom: '30px' };
const inputGroupStyle: React.CSSProperties = { textAlign: 'left', marginBottom: '16px' };
const labelStyle: React.CSSProperties = { fontSize: '12px', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px', display: 'block' };
const inputStyle: React.CSSProperties = { 
  width: '100%', padding: '12px 16px', borderRadius: '12px', backgroundColor: '#0F172A', 
  border: '1px solid #334155', color: 'white', outline: 'none', fontSize: '15px', boxSizing: 'border-box' 
};

const btnStyle: React.CSSProperties = { 
  width: '100%', padding: '14px', backgroundColor: '#0055A4', color: 'white', 
  border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '15px', marginTop: '10px' 
};

const errorStyle: React.CSSProperties = { backgroundColor: '#7F1D1D', color: '#FECACA', padding: '12px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px' };
const successStyle: React.CSSProperties = { backgroundColor: '#064E3B', color: '#D1FAE5', padding: '12px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px' };