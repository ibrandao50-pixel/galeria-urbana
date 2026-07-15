-- Execute uma vez no Supabase: SQL Editor > New query > Run
-- Permite que curadores autenticados removam do Storage a fotografia de uma obra excluída.
drop policy if exists "Curadores excluem imagens" on storage.objects;
create policy "Curadores excluem imagens"
on storage.objects
for delete
to authenticated
using (bucket_id = 'imagens-obras');
