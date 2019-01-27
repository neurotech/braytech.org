// Bungie API access convenience methods
import { Globals } from './globals';

async function apiRequest(path) {
  const options = { headers: { 'X-API-Key': Globals.key.bungie } };

  const request = await fetch(`https://www.bungie.net${path}`, options).then(r => r.json());

  if (request.ErrorCode !== 1) {
    throw new Error(`Error retrieving ${path} from Bungie: (${request.ErrorStatus} code ${request.ErrorCode}) ${request.Message}`);
  }

  return request.Response;
}

const manifestIndex = async () => apiRequest('/Platform/Destiny2/Manifest/');

const settings = async () => apiRequest(`/Platform/Settings/`);

const milestones = async () => apiRequest('/Platform/Destiny2/Milestones/');

const manifest = async version => fetch(`https://www.bungie.net${version}`).then(a => a.json());

const memberProfile = async (membershipType, membershipId, components) => apiRequest(`/Platform/Destiny2/${membershipType}/Profile/${membershipId}/?components=${components}`);

const memberGroups = async (membershipType, membershipId) => apiRequest(`/Platform/GroupV2/User/${membershipType}/${membershipId}/0/1/`);

const playerSearch = async (membershipType, displayName) => apiRequest(`/Platform/Destiny2/SearchDestinyPlayer/${membershipType}/${encodeURIComponent(displayName)}/`);

export default {
  manifestIndex,
  settings,
  milestones,
  manifest,
  memberProfile,
  memberGroups,
  playerSearch
};
