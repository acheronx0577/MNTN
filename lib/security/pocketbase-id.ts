/** PocketBase record ids and demo fallback hike ids (e.g. step-1). */
const SAFE_RECORD_ID = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,29}$/;

export function isSafeRecordId(id: string) {
  return SAFE_RECORD_ID.test(id);
}
