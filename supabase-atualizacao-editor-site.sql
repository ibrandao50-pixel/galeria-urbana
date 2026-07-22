-- Execute uma vez no Supabase: SQL Editor > New query > Run
create table if not exists public.configuracao_site (
  id text primary key default 'principal',
  hero_eyebrow text not null,
  hero_title text not null,
  hero_highlight text not null,
  hero_intro text not null,
  hero_city text,
  hero_artwork text,
  hero_artist text,
  hero_image_url text,
  collection_title text not null,
  about_title text not null,
  about_text text not null,
  updated_at timestamptz not null default now()
);

alter table public.configuracao_site enable row level security;
drop policy if exists "Conteudo do site visivel publicamente" on public.configuracao_site;
create policy "Conteudo do site visivel publicamente" on public.configuracao_site for select to anon,authenticated using(true);
drop policy if exists "Curadores criam conteudo do site" on public.configuracao_site;
create policy "Curadores criam conteudo do site" on public.configuracao_site for insert to authenticated with check(true);
drop policy if exists "Curadores atualizam conteudo do site" on public.configuracao_site;
create policy "Curadores atualizam conteudo do site" on public.configuracao_site for update to authenticated using(true) with check(true);

do $$ begin
  alter publication supabase_realtime add table public.configuracao_site;
exception when duplicate_object then null;
end $$;
