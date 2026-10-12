import * as Ably from 'ably';

export const clientId = crypto.randomUUID();

let client = null;

/** Connect, reporting each Ably connection state (`"connecting"`, `"connected"`, …) to `onStatus`. */
export function init(apiKey, onStatus) {
  client = new Ably.Realtime({ key: apiKey, clientId });
  client.connection.on((change) => onStatus(change.current));
}

export const channel = (name) => client.channels.get(name);

export function enterPresence(name) {
  channel(name).presence.enter().catch((e) => console.log('Presence enter failed:', e));
}

/** Leave `name`'s presence and drop every message and presence listener on it. */
export function leaveChannel(name) {
  const ch = channel(name);
  ch.unsubscribe();
  ch.presence.unsubscribe();
  ch.presence.leave().catch((e) => console.log('Presence leave failed:', e));
}

/** Call `callback` on every presence change on `name`, and once when the connection first comes up. */
export function onPresenceChange(name, callback) {
  channel(name).presence.subscribe(() => callback());
  client.connection.once('connected', callback);
}

export function presenceCount(name, callback) {
  channel(name)
    .presence.get()
    .then((members) => callback(members.length))
    .catch((e) => console.log('Get presence failed:', e));
}

export function publish(name, event, data) {
  channel(name)
    .publish(event, data)
    .catch((e) => console.log('Publish failed:', e));
}

export function subscribe(name, callback) {
  channel(name).subscribe(callback);
}
