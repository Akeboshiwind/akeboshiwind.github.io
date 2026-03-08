import React, { useState } from 'react';

function RevealField({ label, value }) {
  const [revealed, setRevealed] = useState(false);

  if (!value) return null;

  return (
    <div className="mb-3">
      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</div>
      {revealed ? (
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-gray-900 dark:text-gray-100 break-all">{value}</span>
          <button
            onClick={() => setRevealed(false)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline shrink-0"
          >
            Hide
          </button>
        </div>
      ) : (
        <button
          title="Reveal"
          onClick={() => setRevealed(true)}
          className="flex items-center gap-2 text-left"
        >
          <span className="text-sm text-gray-400 dark:text-gray-500">Click to reveal</span>
          <span className="text-xs text-blue-600 dark:text-blue-400 hover:underline shrink-0">
            Reveal
          </span>
        </button>
      )}
    </div>
  );
}

function PlainField({ label, value }) {
  if (!value) return null;

  return (
    <div className="mb-3">
      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</div>
      <div className="text-sm text-gray-900 dark:text-gray-100 break-all">{value}</div>
    </div>
  );
}

function FieldStatusToggle({ value, onChange }) {
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value || null)}
      className="text-xs border border-gray-300 dark:border-gray-600 rounded px-1 py-0.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
    >
      <option value="">Untracked</option>
      <option value="migrated">Migrated</option>
      <option value="discarded">Discarded</option>
    </select>
  );
}

const DISPOSITIONS = [
  { key: 'apple_passwords', label: 'Apple Passwords' },
  { key: 'uplock', label: 'Uplock' },
  { key: 'apple_wallet', label: 'Apple Wallet' },
  { key: 'deleted', label: 'Deleted' },
];

export function EntryDetail({
  entry,
  onSetDisposition,
  onClearDisposition,
  onUnpin,
  onUpdateNotes,
  onSetFieldStatus,
}) {
  const {
    bitwarden_id, name, type, uris, username, password, totp, notes,
    folder_name, custom_fields, attachments,
    cardholder_name, card_brand, card_number, card_exp_month, card_exp_year, card_code,
    identity_title, identity_first_name, identity_last_name,
    identity_email, identity_phone, identity_address,
    disposition, user_notes, field_statuses,
  } = entry;

  const hasCard = cardholder_name || card_brand || card_number || card_exp_month || card_code;
  const hasIdentity = identity_title || identity_first_name || identity_last_name ||
    identity_email || identity_phone || identity_address;

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              {type}
            </span>
            {folder_name && (
              <span className="text-xs text-gray-500 dark:text-gray-400">{folder_name}</span>
            )}
          </div>
        </div>
        <button
          onClick={() => onUnpin(bitwarden_id)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none"
          title="Close"
        >
          &times;
        </button>
      </div>

      {/* Login fields */}
      {uris?.map((u, i) => (
        <PlainField key={i} label={`URI ${i + 1}`} value={u.uri} />
      ))}
      <PlainField label="Username" value={username} />
      <RevealField label="Password" value={password} />
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <RevealField label="TOTP" value={totp} />
        </div>
        {totp && (
          <FieldStatusToggle
            value={field_statuses?.totp}
            onChange={(v) => onSetFieldStatus(bitwarden_id, 'totp', v)}
          />
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <RevealField label="Notes" value={notes} />
        </div>
        {notes && (
          <FieldStatusToggle
            value={field_statuses?.notes}
            onChange={(v) => onSetFieldStatus(bitwarden_id, 'notes', v)}
          />
        )}
      </div>

      {/* Card fields */}
      {hasCard && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Card</h3>
          <PlainField label="Cardholder" value={cardholder_name} />
          <PlainField label="Brand" value={card_brand} />
          <RevealField label="Number" value={card_number} />
          {(card_exp_month || card_exp_year) && (
            <PlainField label="Expiry" value={`${card_exp_month || '??'}/${card_exp_year || '??'}`} />
          )}
          <RevealField label="CVV" value={card_code} />
        </div>
      )}

      {/* Identity fields */}
      {hasIdentity && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Identity</h3>
          <PlainField label="Title" value={identity_title} />
          <PlainField
            label="Name"
            value={[identity_first_name, identity_last_name].filter(Boolean).join(' ') || null}
          />
          <PlainField label="Email" value={identity_email} />
          <PlainField label="Phone" value={identity_phone} />
          <PlainField label="Address" value={identity_address} />
        </div>
      )}

      {/* Custom fields */}
      {custom_fields?.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Custom Fields</h3>
          {custom_fields.map((field, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <div className="flex-1">
                {field.is_hidden ? (
                  <RevealField label={field.name} value={field.value} />
                ) : (
                  <PlainField label={field.name} value={field.value} />
                )}
              </div>
              <FieldStatusToggle
                value={field_statuses?.[`custom_field_${i}`]}
                onChange={(v) => onSetFieldStatus(bitwarden_id, `custom_field_${i}`, v)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Attachments */}
      {attachments?.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Attachments</h3>
          {attachments.map((att, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <div className="flex-1">
                {att.is_binary ? (
                  <PlainField label={att.filename} value="(binary file)" />
                ) : (
                  <RevealField label={att.filename} value={att.content} />
                )}
              </div>
              <FieldStatusToggle
                value={field_statuses?.[`attachment_${i}`]}
                onChange={(v) => onSetFieldStatus(bitwarden_id, `attachment_${i}`, v)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Disposition buttons */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Disposition</h3>
        <div className="flex flex-wrap gap-2">
          {DISPOSITIONS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() =>
                disposition === key
                  ? onClearDisposition(bitwarden_id)
                  : onSetDisposition(bitwarden_id, key)
              }
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                disposition === key
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* User notes */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Your Notes</h3>
        <textarea
          value={user_notes || ''}
          onChange={(e) => onUpdateNotes(bitwarden_id, e.target.value)}
          placeholder="Add notes about this entry..."
          className="w-full h-24 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-y"
        />
      </div>
    </div>
  );
}
