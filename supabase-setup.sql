-- Execute este arquivo no Supabase: SQL Editor > New query > Run
create table if not exists public.obras (
  id text primary key,
  title text not null,
  artist text not null,
  year integer,
  status text not null default 'Concluído',
  location text,
  lat double precision not null,
  lng double precision not null,
  image_url text,
  manifesto text,
  impact text,
  community text,
  funding text,
  instagram text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.obras enable row level security;
drop policy if exists "Obras visiveis publicamente" on public.obras;
create policy "Obras visiveis publicamente" on public.obras for select to anon, authenticated using (true);
drop policy if exists "Curadores publicam obras" on public.obras;
create policy "Curadores publicam obras" on public.obras for insert to authenticated with check (true);
drop policy if exists "Curadores atualizam obras" on public.obras;
create policy "Curadores atualizam obras" on public.obras for update to authenticated using (true) with check (true);
drop policy if exists "Curadores removem obras" on public.obras;
create policy "Curadores removem obras" on public.obras for delete to authenticated using (true);

insert into storage.buckets (id,name,public) values ('imagens-obras','imagens-obras',true)
on conflict (id) do update set public=true;
drop policy if exists "Imagens publicas" on storage.objects;
create policy "Imagens publicas" on storage.objects for select to anon, authenticated using (bucket_id='imagens-obras');
drop policy if exists "Curadores enviam imagens" on storage.objects;
create policy "Curadores enviam imagens" on storage.objects for insert to authenticated with check (bucket_id='imagens-obras');
drop policy if exists "Curadores atualizam imagens" on storage.objects;
create policy "Curadores atualizam imagens" on storage.objects for update to authenticated using (bucket_id='imagens-obras');

alter publication supabase_realtime add table public.obras;
