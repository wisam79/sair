import { createServiceClient } from './test-helpers';
import { expect } from 'vitest';

export async function getTableRow(table: string, id: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function insertRow(table: string, data: any) {
  const supabase = createServiceClient();
  const { data: inserted, error } = await supabase
    .from(table)
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return inserted;
}

export async function deleteRow(table: string, id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function assertRowExists(table: string, id: string) {
  const row = await getTableRow(table, id);
  expect(row).not.toBeNull();
  return row;
}

export async function assertRowNotExists(table: string, id: string) {
  const row = await getTableRow(table, id);
  expect(row).toBeNull();
}
