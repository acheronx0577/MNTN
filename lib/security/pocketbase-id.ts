/** PocketBase record ids and demo fallback hike ids (e.g. step-1). */
const SAFE_RECORD_ID = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,29}$/;

export function isSafeRecordId(id: string) {
  return SAFE_RECORD_ID.test(id);
}

/** Real PocketBase record ids (relations), not demo fallback ids like step-1. */
export function isPocketBaseRecordId(id: string) {
  return /^[a-z0-9]{15}$/.test(id);
}
