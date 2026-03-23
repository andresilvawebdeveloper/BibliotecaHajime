"use client";

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [dados, setDados] = useState({ nome: '', apelido: '', data_nascimento: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const supabase = createClient();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { data: authData, error: authError } = await supabase.auth.signUp({ 
      email: dados.email, 
      password: dados.password 
    });

    if (authError) {
      setErrorMsg(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      const { error: profileError } = await supabase.from('perfis').upsert({
        id: authData.user.id, 
        nome: dados.nome, 
        apelido: dados.apelido,
        data_nascimento: dados.data_nascimento, 
        email: dados.email, 
        role: 'treinador', 
        aprovado: false // Garante que começa como não aprovado
      });

      if (profileError) {
        setErrorMsg(profileError.message);
        setLoading(false);
      } else { 
        // REDIRECIONAMENTO CORRIGIDO: Vai para a página de espera
        router.push('/pendente'); 
        router.refresh(); 
      }
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSignup} style={formStyle}>
        <img src="/icons/logo-hajime-biblioteca.png" alt="Hajime" style={logoStyle} />
        <h2 style={titleStyle}>Novo Treinador</h2>
        <p style={subtitleStyle}>Crie a sua conta para solicitar acesso.</p>

        {errorMsg && <div style={errorStyle}>{errorMsg}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Nome</label>
            <input required style={inputStyle} placeholder="João" onChange={e => setDados({...dados, nome: e.target.value})} />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Apelido</label>
            <input required style={inputStyle} placeholder="Silva" onChange={e => setDados({...dados, apelido: e.target.value})} />
          </div>
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Data Nascimento</label>
          <input required type="date" style={inputStyle} onChange={e => setDados({...dados, data_nascimento: e.target.value})} />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Email</label>
          <input required type="email" style={inputStyle} placeholder="treinador@email.com" onChange={e => setDados({...dados, email: e.target.value})} />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Password</label>
          <input required type="password" style={inputStyle} placeholder="••••••••" onChange={e => setDados({...dados, password: e.target.value})} />
        </div>

        <button disabled={loading} type="submit" style={btnStyle}>
          {loading ? 'A processar...' : 'Solicitar Registo'}
        </button>

        <p onClick={() => router.push('/login')} style={backToLoginStyle}>
          Já tem conta? Iniciar Sessão
        </p>
      </form>
    </div>
  );
}

// ESTILOS
const containerStyle: React.CSSProperties = { 
  height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', 
  backgroundColor: '#0F172A', padding: '20px', fontFamily: 'sans-serif' 
};

const formStyle: React.CSSProperties = { 
  backgroundColor: '#1E293B', padding: '40px', borderRadius: '28px', 
  width: '100%', maxWidth: '450px', textAlign: 'center', 
  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid #334155' 
};

const logoStyle: React.CSSProperties = { width: '70px', borderRadius: '16px', marginBottom: '15px' };
const titleStyle: React.CSSProperties = { fontSize: '22px', fontWeight: '900', color: '#FFFFFF', margin: '0 0 5px 0' };
const subtitleStyle: React.CSSProperties = { fontSize: '13px', color: '#94A3B8', marginBottom: '25px' };
const inputGroupStyle: React.CSSProperties = { textAlign: 'left', marginBottom: '15px' };
const labelStyle: React.CSSProperties = { fontSize: '11px', fontWeight: '700', color: '#CBD5E1', marginBottom: '5px', display: 'block' };
const inputStyle: React.CSSProperties = { 
  width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: '#0F172A', 
  border: '1px solid #334155', color: 'white', fontSize: '14px', boxSizing: 'border-box' 
};
const btnStyle: React.CSSProperties = { 
  width: '100%', padding: '14px', backgroundColor: '#0055A4', color: 'white', 
  border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '15px', marginTop: '10px' 
};
const errorStyle: React.CSSProperties = { backgroundColor: '#7F1D1D', color: '#FECACA', padding: '10px', borderRadius: '8px', fontSize: '12px', marginBottom: '20px' };
const backToLoginStyle: React.CSSProperties = { cursor: 'pointer', fontSize: '13px', marginTop: '20px', color: '#38BDF8', fontWeight: '700', textDecoration: 'underline' };