-- Execute uma vez no Supabase: SQL Editor > New query > Run
create table if not exists public.obra_curtidas (
  obra_id text not null references public.obras(id) on delete cascade,
  voter_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (obra_id, voter_id)
);

alter table public.obra_curtidas enable row level security;
drop policy if exists "Curtidas visiveis publicamente" on public.obra_curtidas;
create policy "Curtidas visiveis publicamente" on public.obra_curtidas
for select to anon, authenticated using (true);

create or replace function public.alternar_curtida(p_obra_id text,p_voter_id uuid)
returns table(liked boolean,like_count bigint)
language plpgsql security definer set search_path=public
as $$
begin
  if exists(select 1 from public.obra_curtidas where obra_id=p_obra_id and voter_id=p_voter_id) then
    delete from public.obra_curtidas where obra_id=p_obra_id and voter_id=p_voter_id;
    liked:=false;
  else
    insert into public.obra_curtidas(obra_id,voter_id) values(p_obra_id,p_voter_id);
    liked:=true;
  end if;
  select count(*) into like_count from public.obra_curtidas where obra_id=p_obra_id;
  return next;
end;
$$;

revoke all on function public.alternar_curtida(text,uuid) from public;
grant execute on function public.alternar_curtida(text,uuid) to anon,authenticated;

do $$ begin
  alter publication supabase_realtime add table public.obra_curtidas;
exception when duplicate_object then null;
end $$;
