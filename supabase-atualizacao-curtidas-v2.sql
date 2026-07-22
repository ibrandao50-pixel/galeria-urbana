-- Execute uma vez no Supabase: SQL Editor > New query > Run
-- Garante uma única curtida por obra para cada identificador persistente do navegador.
create unique index if not exists obra_curtidas_uma_por_visitante
on public.obra_curtidas (obra_id, voter_id);

-- Mantém a leitura pública necessária para que todos vejam a mesma contagem.
drop policy if exists "Curtidas visiveis publicamente" on public.obra_curtidas;
create policy "Curtidas visiveis publicamente"
on public.obra_curtidas
for select
to anon, authenticated
using (true);

-- Garante que a tabela continue publicada para atualizações em tempo real.
do $$ begin
  alter publication supabase_realtime add table public.obra_curtidas;
exception when duplicate_object then null;
end $$;
