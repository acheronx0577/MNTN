/** Normalize PocketBase single-relation field values to a record id. */
export function relationRecordId(value: unknown): string | null {
  if (typeof value === "string" && value.length > 0) return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  if (
    value &&
    typeof value === "object" &&
    "id" in value &&
    typeof (value as { id: unknown }).id === "string"
  ) {
    return (value as { id: string }).id;
  }
  return null;
}

export function recordOwnedByUser(
  recordUser: unknown,
  userId: string
): boolean {
  return relationRecordId(recordUser) === userId;
}
