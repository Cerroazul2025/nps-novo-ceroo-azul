import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [suite, setSuite] = useState('');
  const [nota, setNota] = useState(null);
  const [comentario, setComentario] = useState('');
  const [enviado, setEnviado] = useState(false);

  const coresNotas = [
    '#d32f2f', '#e53935', '#fb8c00', '#f57c00', '#fbc02d',
    '#fdd835', '#fdd835', '#cddc39', '#9ccc65', '#7cb342', '#388e3c'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nota === null || suite.trim() === '') {
      alert('Por favor, preencha a suíte e escolha uma nota.');
      return;
    }

    const { error } = await supabase.from('respostas_nps').insert([
      {
        suite,
        score: nota,
        comentario,
        origem: 'site'
      }
    ]);

    if (error) {
      console.error(error);
      alert('Erro ao enviar. Tente novamente.');
    } else {
      setEnviado(true);
    }
  };

  if (enviado) {
    return (
      <div style={{ textAlign: 'center', color: 'green', fontSize: '18px' }}>
        Obrigado pela sua resposta!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{
      maxWidth: 500,
      margin: '0 auto',
      padding: 20,
      background: '#fff',
      borderRadius: 8,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
        Pesquisa de Satisfação
      </h1>

      <label style={{ display: 'block', marginBottom: 10 }}>
        <span style={{ display: 'block', marginBottom: 5 }}>Número da Suíte:</span>
        <input
          type="text"
          value={suite}
          onChange={(e) => setSuite(e.target.value)}
          required
          style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
      </label>

      <div style={{ marginBottom: 20 }}>
        <p style={{ marginBottom: 10 }}>
          De 0 a 10, o quanto você recomendaria o Cerro Azul Hotel Fazenda para um amigo ou familiar?
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {Array.from({ length: 11 }, (_, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setNota(i)}
              style={{
                width: 40,
                height: 40,
                backgroundColor: coresNotas[i],
                color: '#fff',
                border: nota === i ? '2px solid #000' : 'none',
                borderRadius: 6,
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <label style={{ display: 'block', marginBottom: 10 }}>
        <span style={{ display: 'block', marginBottom: 5 }}>Observações e/ou elogios:</span>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          rows={4}
          style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
      </label>

      <button type="submit" style={{
        width: '100%',
        padding: 10,
        backgroundColor: '#388e3c',
        color: '#fff',
        border: 'none',
        borderRadius: 4
      }}>
        Enviar resposta
      </button>
    </form>
  );
}
