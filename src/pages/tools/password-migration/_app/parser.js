const TYPE_MAP = { 1: 'login', 2: 'secure_note', 3: 'card', 4: 'identity' };
const FIELD_TYPE_HIDDEN = 1;

export function mapFolders(folders) {
  const map = {};
  for (const f of folders) {
    map[f.id] = f.name;
  }
  return map;
}

export function parseBitwardenItem(item, folderMap) {
  const base = {
    bitwarden_id: item.id,
    name: item.name,
    type: TYPE_MAP[item.type] || 'unknown',
    notes: item.notes || null,
    is_favorite: item.favorite || false,
    folder_name: item.folderId ? (folderMap[item.folderId] || null) : null,
    custom_fields: (item.fields || []).map(f => ({
      name: f.name,
      value: f.value,
      is_hidden: f.type === FIELD_TYPE_HIDDEN,
    })),
    attachments: [],
    disposition: null,
    user_notes: '',
    is_pinned: false,
    field_statuses: {
      totp: null,
      notes: null,
      custom_fields: [],
      attachments: [],
    },
  };

  base.uris = [];
  base.username = null;
  base.password = null;
  base.totp = null;
  if (item.type === 1 && item.login) {
    base.uris = (item.login.uris || []).map(u => ({ uri: u.uri }));
    base.username = item.login.username || null;
    base.password = item.login.password || null;
    base.totp = item.login.totp || null;
  }

  base.cardholder_name = null;
  base.card_brand = null;
  base.card_number = null;
  base.card_exp_month = null;
  base.card_exp_year = null;
  base.card_code = null;
  if (item.type === 3 && item.card) {
    base.cardholder_name = item.card.cardholderName || null;
    base.card_brand = item.card.brand || null;
    base.card_number = item.card.number || null;
    base.card_exp_month = item.card.expMonth || null;
    base.card_exp_year = item.card.expYear || null;
    base.card_code = item.card.code || null;
  }

  base.identity_title = null;
  base.identity_first_name = null;
  base.identity_last_name = null;
  base.identity_email = null;
  base.identity_phone = null;
  base.identity_address = null;
  if (item.type === 4 && item.identity) {
    const id = item.identity;
    base.identity_title = id.title || null;
    base.identity_first_name = id.firstName || null;
    base.identity_last_name = id.lastName || null;
    base.identity_email = id.email || null;
    base.identity_phone = id.phone || null;
    base.identity_address = [id.address1, id.address2, id.address3, id.city, id.state, id.postalCode, id.country]
      .filter(Boolean)
      .join(', ') || null;
  }

  base.field_statuses.custom_fields = base.custom_fields.map(() => null);

  return base;
}

export async function parseZipExport(zipFile) {
  const JSZip = (await import('jszip')).default;
  const zip = await JSZip.loadAsync(zipFile);

  const dataFile = zip.file('data.json');
  if (!dataFile) throw new Error('No data.json found in zip');

  const dataJson = await dataFile.async('string');
  const data = JSON.parse(dataJson);

  const folderMap = mapFolders(data.folders || []);
  const entries = (data.items || []).map(item => parseBitwardenItem(item, folderMap));

  for (const entry of entries) {
    const itemAttachments = (data.items.find(i => i.id === entry.bitwarden_id)?.attachments) || [];
    for (const att of itemAttachments) {
      const attFile = zip.file(att.fileName);
      let content = null;
      let is_binary = false;
      if (attFile) {
        try {
          content = await attFile.async('string');
          if (/[\x00-\x08\x0E-\x1F]/.test(content.substring(0, 1000))) {
            content = null;
            is_binary = true;
          }
        } catch {
          is_binary = true;
        }
      }
      entry.attachments.push({ filename: att.fileName, content, is_binary });
    }
    entry.field_statuses.attachments = entry.attachments.map(() => null);
  }

  return entries;
}
