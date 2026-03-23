"use client";
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Clock, LogOut } from 'lucide-react';

export default function PendentePage() {
  const supabase = createClient();
  const router = useRouter();

  const sair = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <Clock size={48} color="#0055A4" style={{ marginBottom: '20px' }} />
        <h1 style={{ fontSize: '22px', fontWeight: '900' }}>Acesso Pendente</h1>
        <p style={{ color: '#64748B', lineHeight: '1.6' }}>
          Olá! O teu registo foi efetuado com sucesso. <br />
          Agora, o <strong>Administrador do Clube</strong> precisa de aprovar a tua conta.
        </p>
        <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#F1F5F9', borderRadius: '12px', fontSize: '13px' }}>
          Assim que fores aprovado, poderás aceder à Biblioteca Técnica e ao Planeamento.
        </div>
        <button onClick={sair} style={btnSair}><LogOut size={16} /> Sair / Voltar</button>
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' };
const cardStyle: React.CSSProperties = { backgroundColor: 'white', padding: '40px', borderRadius: '24px', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' };
const btnSair: React.CSSProperties = { marginTop: '20px', background: 'none', border: 'none', color: '#EF4444', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', margin: '20px auto 0' };