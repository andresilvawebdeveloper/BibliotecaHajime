"use client";

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const supabase = createClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg("Email ou password incorretos.");
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleLogin} style={formStyle}>
        {/* LOGO HAJIME */}
        <img 
          src="/icons/logo-hajime.png" 
          alt="Clube de Judo Hajime" 
          style={logoStyle} 
        />
        
        <h2 style={titleStyle}>Hajime Manager</h2>
        <p style={subtitleStyle}>Inicie sessão para aceder à biblioteca técnica.</p>

        {errorMsg && <div style={errorStyle}>{errorMsg}</div>}

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Email</label>
          <input 
            required 
            type="email" 
            style={inputStyle} 
            placeholder="seu@email.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={inputGroupStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
            <span 
              onClick={() => router.push('/forgot-password')} 
              style={forgotPasswordStyle}
            >
              Esqueceu-se da password?
            </span>
          </div>
          <input 
            required 
            type="password" 
            style={inputStyle} 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button disabled={loading} type="submit" style={btnStyle}>
          {loading ? 'A entrar...' : 'Entrar no Painel'}
        </button>

        <hr style={dividerStyle} />

        {/* REDIRECIONAMENTO PARA SIGN UP */}
        <div style={signupAreaStyle}>
          <p style={{ margin: 0 }}>Ainda não tem conta de treinador?</p>
          <button 
            type="button"
            onClick={() => router.push('/signup')} 
            style={signupBtnStyle}
          >
            Criar Nova Conta
          </button>
        </div>
      </form>
    </div>
  );
}

// ESTILOS DARK MODE
const containerStyle: React.CSSProperties = { 
  height: '100vh', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  backgroundColor: '#0F172A', // Fundo azul marinho muito escuro
  padding: '20px',
  fontFamily: 'sans-serif'
};

const formStyle: React.CSSProperties = { 
  backgroundColor: '#1E293B', // Slate escuro para o cartão
  padding: '40px', 
  borderRadius: '28px', 
  width: '100%', 
  maxWidth: '400px', 
  textAlign: 'center', 
  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
  border: '1px solid #334155'
};

const logoStyle: React.CSSProperties = { 
  width: '80px', 
  borderRadius: '18px', 
  marginBottom: '20px' 
};

const titleStyle: React.CSSProperties = { 
  fontSize: '22px', 
  fontWeight: '900', 
  color: '#FFFFFF', 
  margin: '0 0 8px 0' 
};

const subtitleStyle: React.CSSProperties = { 
  fontSize: '14px', 
  color: '#94A3B8', 
  marginBottom: '30px',
  lineHeight: '1.5'
};

const inputGroupStyle: React.CSSProperties = { 
  textAlign: 'left', 
  marginBottom: '16px' 
};

const labelStyle: React.CSSProperties = { 
  fontSize: '12px', 
  fontWeight: '700', 
  color: '#CBD5E1', 
  marginBottom: '6px', 
  display: 'block' 
};

const inputStyle: React.CSSProperties = { 
  width: '100%', 
  padding: '12px 16px', 
  borderRadius: '12px', 
  backgroundColor: '#0F172A',
  border: '1px solid #334155', 
  outline: 'none', 
  fontSize: '15px',
  boxSizing: 'border-box',
  color: 'white'
};

const forgotPasswordStyle: React.CSSProperties = {
  fontSize: '11px',
  color: '#38BDF8', // Azul brilhante para destacar no escuro
  cursor: 'pointer',
  fontWeight: '700'
};

const btnStyle: React.CSSProperties = { 
  width: '100%', 
  padding: '14px', 
  backgroundColor: '#0055A4', // Azul Hajime
  color: 'white', 
  border: 'none', 
  borderRadius: '12px', 
  fontWeight: '800', 
  cursor: 'pointer',
  fontSize: '15px',
  marginTop: '10px'
};

const errorStyle: React.CSSProperties = {
  backgroundColor: '#7F1D1D',
  color: '#FECACA',
  padding: '10px',
  borderRadius: '8px',
  fontSize: '13px',
  marginBottom: '20px',
  fontWeight: '600',
  border: '1px solid #991B1B'
};

const dividerStyle: React.CSSProperties = {
  margin: '25px 0',
  border: 'none',
  borderTop: '1px solid #334155'
};

const signupAreaStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#94A3B8'
};

const signupBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#38BDF8',
  fontWeight: '800',
  cursor: 'pointer',
  marginTop: '8px',
  textDecoration: 'underline',
  fontSize: '14px'
};