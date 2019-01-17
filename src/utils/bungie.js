// Bungie API access convenience methods
import { Globals } from './globals';

async function apiRequest(path) {
  const options = { headers: { 'X-API-Key': Globals.key.bungie } };

  const request = await fetch(`https://www.bungie.net${path}`, options).then(r => r.json());

  if (request.ErrorCode !== 1) {
    throw `Error retrieving ${path} from Bungie`;
  }

  return request.Response;
}

async function manifestIndex() {
  return apiRequest('/Platform/Destiny2/Manifest/');
}

async function settings() {
  return apiRequest('/Platform/Settings/');
}

async function manifest(version) {
  return fetch(`https://www.bungie.net${version}`).then(a => a.json());
}

export default {
  manifestIndex,
  settings,
  manifest
};
