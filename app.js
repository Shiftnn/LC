/* Limbus Company Meta Team Builder */

const SINNERS = ['Yi Sang', 'Don Quixote', 'Rodion', 'Faust', 'Heathcliff', 'Ishmael', 'Ryōshū', 'Outis', 'Gregor', 'Hong Lu', 'Meursault', 'Sinclair'];

const SINNER_PALETTE = {
  'Yi Sang': ['#0d3d3d', '#1a6b6b'],
  'Don Quixote': ['#4a3a10', '#9a7b1a'],
  'Rodion': ['#4a1a3a', '#9a3a6a'],
  'Faust': ['#1a2a4a', '#3a5a9a'],
  'Heathcliff': ['#3a1a4a', '#6a3a8a'],
  'Ishmael': ['#1a3a4a', '#3a7a9a'],
  'Ryōshū': ['#4a1a1a', '#8a3a3a'],
  'Outis': ['#2a2a3a', '#5a5a7a'],
  'Gregor': ['#3a2a1a', '#7a5a2a'],
  'Hong Lu': ['#1a4a2a', '#3a8a5a'],
  'Meursault': ['#2a3a2a', '#5a7a5a'],
  'Sinclair': ['#3a3a1a', '#7a7a3a'],
};

const PRIMARY_EFFECTS = ['Rupture', 'Bleed', 'Sinking', 'Burn', 'Poise', 'Charge', 'Tremor'];
const ATTACK_TYPES = ['Slash', 'Pierce', 'Blunt'];
const TIER_ORDER = ['SSS', 'SS', 'S', 'A', 'B', 'C'];
const FILTER_STATUSES = [...PRIMARY_EFFECTS];

const SINNER_ICON_SLUG = {
  'Yi Sang': 'yi sang',
  'Don Quixote': 'don quixote',
  Rodion: 'rodion',
  Faust: 'faust',
  Heathcliff: 'heathcliff',
  Ishmael: 'ishmael',
  'Ryōshū': 'ryoshu',
  Outis: 'outis',
  Gregor: 'gregor',
  'Hong Lu': 'hong lu',
  Meursault: 'mersault',
  Sinclair: 'sinclair',
};

function gllSinnerIcon(sinner) {
  const slug = SINNER_ICON_SLUG[sinner] || normSinnerKey(sinner);
  return GLL_BASE + '/images/sinners-icons/' + encodeURIComponent(slug) + '.webp';
}

function gllStatusIcon(status) {
  return GLL_BASE + '/images/tags/' + status.toLowerCase() + '.webp';
}

function gllAttackIcon(attack) {
  return GLL_BASE + '/images/guard-type/' + attack.toLowerCase() + '.webp';
}

function iconFilterButton(scope, group, value, title, iconUrl, isAll) {
  const active = value === '' ? ' active' : '';
  const inner = isAll
    ? '<span class="icon-filter-all" aria-hidden="true">○</span>'
    : '<img src="' + iconUrl + '" alt="" loading="lazy">';
  return '<button type="button" class="icon-filter-btn' + active + '" data-filter-scope="' + scope +
    '" data-filter-group="' + group + '" data-value="' + escapeAttr(value) + '" title="' + escapeAttr(title) + '">' +
    inner + '</button>';
}

function renderIconFilterRow(containerId, scope, group, items) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const parts = [iconFilterButton(scope, group, '', 'All', null, true)];
  items.forEach(function (it) {
    parts.push(iconFilterButton(scope, group, it.value, it.label, it.icon, false));
  });
  el.innerHTML = parts.join('');
}

function getFilterValue(scope, group) {
  const btn = document.querySelector(
    '.icon-filter-btn.active[data-filter-scope="' + scope + '"][data-filter-group="' + group + '"]'
  );
  return btn ? (btn.dataset.value || '') : '';
}

function resetIconFilters(scope) {
  ['sinner', 'attack', 'status'].forEach(function (group) {
    const row = document.getElementById(scope + '-' + group + '-filters');
    if (!row) return;
    row.querySelectorAll('.icon-filter-btn').forEach(function (b) {
      b.classList.toggle('active', b.dataset.value === '');
    });
  });
}

function initIconFilterBars() {
  renderIconFilterRow('modal-sinner-filters', 'modal', 'sinner', SINNERS.map(function (s) {
    return { value: s, label: s, icon: gllSinnerIcon(s) };
  }));
  renderIconFilterRow('modal-attack-filters', 'modal', 'attack', ATTACK_TYPES.map(function (a) {
    return { value: a, label: a, icon: gllAttackIcon(a) };
  }));
  renderIconFilterRow('modal-status-filters', 'modal', 'status', FILTER_STATUSES.map(function (s) {
    return { value: s, label: s, icon: gllStatusIcon(s) };
  }));
  renderIconFilterRow('tierlist-sinner-filters', 'tierlist', 'sinner', SINNERS.map(function (s) {
    return { value: s, label: s, icon: gllSinnerIcon(s) };
  }));
  renderIconFilterRow('tierlist-attack-filters', 'tierlist', 'attack', ATTACK_TYPES.map(function (a) {
    return { value: a, label: a, icon: gllAttackIcon(a) };
  }));
  renderIconFilterRow('tierlist-status-filters', 'tierlist', 'status', FILTER_STATUSES.map(function (s) {
    return { value: s, label: s, icon: gllStatusIcon(s) };
  }));
}

function bindIconFilterEvents() {
  document.body.addEventListener('click', function (e) {
    const btn = e.target.closest('.icon-filter-btn');
    if (!btn) return;
    const row = btn.parentElement;
    row.querySelectorAll('.icon-filter-btn').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    if (btn.dataset.filterScope === 'modal') refreshModalAllGrid();
    if (btn.dataset.filterScope === 'tierlist') renderTierList();
  });
}

function filterKeysForTierList() {
  const q = (document.getElementById('tierlist-search')?.value || '').toLowerCase();
  return filterAllKeys(
    q,
    getFilterValue('tierlist', 'sinner'),
    getFilterValue('tierlist', 'attack'),
    getFilterValue('tierlist', 'status')
  );
}

const GLL_BASE = 'https://gll-fun.com';
const GLL_API = 'https://admin.gll-fun.com';
const GLL_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIn0.t-9_E-M0Q8_D-L_M-G_E-M0Q8_D-L_M-G_E-M0Q8_D-L_M';
const GLL_CACHE_KEY = 'lc_gll_identities_v2';
const GLL_CACHE_TTL = 15 * 60 * 1000;

const SINNER_GLL = {
  'yi sang': 'Yi Sang',
  'don quixote': 'Don Quixote',
  rodion: 'Rodion',
  faust: 'Faust',
  heathcliff: 'Heathcliff',
  ishmael: 'Ishmael',
  ryoshu: 'Ryōshū',
  outis: 'Outis',
  gregor: 'Gregor',
  'hong lu': 'Hong Lu',
  mersault: 'Meursault',
  sinclair: 'Sinclair',
};

const SIN_KEY_MAP = {
  glut: 'Gluttony', lust: 'Lust', gloom: 'Gloom', wrath: 'Wrath',
  pride: 'Pride', envy: 'Envy', sloth: 'Sloth',
};

const ID_TIER_MAP = { SSS: 'SS', SS: 'SS', S: 'S', A: 'A', B: 'B', C: 'C' };

const EFFECT_KEYWORDS = [
  ...PRIMARY_EFFECTS,
  'Deathrite', 'Bloodfeast', 'Gloom', 'Echoes', 'Butterfly', 'Coffin', 'Dark Flame', 'Reverb',
];

let POOL = {};
let ALL_POOL_KEYS = [];
let gllLoaded = false;

function gllRarityDisplay(r) {
  return String(r || 'O').replace(/Ø/g, '0').replace(/O/g, '0');
}

function normName(s) {
  return (s || '').toLowerCase().replace(/ō/g, 'o').replace(/[^\w\s:]/g, '').replace(/\s+/g, ' ').trim();
}

function normSinnerKey(s) {
  return (s || '').toLowerCase().replace(/ō/g, 'o').trim();
}

function parseEffectsFromGll(row) {
  const text = [row.statusUnik, row.reviewEN, row.descriptionPassive1EN].filter(Boolean).join(' ');
  const found = [];
  EFFECT_KEYWORDS.forEach((label) => {
    if (text.toLowerCase().includes(label.toLowerCase())) found.push(label);
  });
  return found.length ? [...new Set(found)] : [];
}

function parseAttackTypes(skillsDmgType) {
  const map = { slash: 'Slash', pierce: 'Pierce', blunt: 'Blunt' };
  const types = new Set();
  (skillsDmgType || '').split(',').forEach((s) => {
    const t = map[s.trim().toLowerCase()];
    if (t) types.add(t);
  });
  return [...types];
}

function parseStatusTags(text) {
  const found = new Set();
  const src = (text || '').toLowerCase();
  PRIMARY_EFFECTS.forEach((p) => {
    if (src.includes('#' + p.toLowerCase()) || src.includes(p.toLowerCase())) found.add(p);
  });
  if (/rupture|deathrite/.test(src)) found.add('Rupture');
  if (/bleed|bloodfeast|bloodmist/.test(src)) found.add('Bleed');
  if (/sinking|gloom|uiter|drown/.test(src)) found.add('Sinking');
  if (/burn|ash|combust|ignit/.test(src)) found.add('Burn');
  if (/poise|breath/.test(src)) found.add('Poise');
  if (/tremor|quake/.test(src)) found.add('Tremor');
  if (/charge|current/.test(src)) found.add('Charge');
  return [...found];
}

function collectGllStatuses(row) {
  const chunks = [
    row.statusUnik, row.reviewEN, row.descriptionPassive1EN, row.descriptionPassive2EN,
    row.descriptionCoinEN1, row.descriptionCoinEN2, row.descriptionCoinEN3, row.descriptionCoinEN4,
  ];
  const tags = new Set();
  chunks.filter(Boolean).forEach((c) => parseStatusTags(c).forEach((s) => tags.add(s)));
  parseEffectsFromGll(row).forEach((e) => tags.add(e));
  return [...tags];
}

function identityFromGll(row) {
  const statuses = collectGllStatuses(row);
  const effects = parseEffectsFromGll(row);
  return {
    key: row.imgUrl,
    gllId: row.imgUrl,
    name: row.nameEN || row.nameRU || row.imgUrl,
    sinner: SINNER_GLL[normSinnerKey(row.sinner)] || row.sinner,
    rarity: gllRarityDisplay(row.rarity),
    effects: effects.length ? effects : statuses,
    statuses,
    attackTypes: parseAttackTypes(row.skillsDmgType),
    sins: [...new Set((row.skillsSin || '').split(',').map((s) => SIN_KEY_MAP[s.trim()] || s).filter(Boolean))],
    role: 'Identity',
    gllTier: row.idTier || 'C',
    tier: ID_TIER_MAP[row.idTier] || row.idTier || 'B',
    wiki: null,
    img: null,
  };
}

function sinnerFromGllRow(row) {
  return SINNER_GLL[normSinnerKey(row.sinner)] || row.sinner;
}

function findGllRow(rows, meta) {
  const nn = normName(meta.name);
  const ns = normSinnerKey(meta.sinner);
  const exact = rows.find((r) => normSinnerKey(sinnerFromGllRow(r)) === ns && normName(r.nameEN) === nn);
  if (exact) return exact;
  return rows.find((r) => {
    const rs = normSinnerKey(sinnerFromGllRow(r));
    const rn = normName(r.nameEN);
    return rs === ns && (rn.includes(nn.slice(0, 14)) || nn.includes(rn.slice(0, 14)));
  }) || null;
}

function readGllCache() {
  try {
    const raw = localStorage.getItem(GLL_CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts < GLL_CACHE_TTL && Array.isArray(data)) return data;
  } catch (_) { /* ignore */ }
  return null;
}

function writeGllCache(data) {
  try {
    localStorage.setItem(GLL_CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch (_) { /* ignore */ }
}

async function fetchGllRows() {
  const cached = readGllCache();
  if (cached) return cached;
  const fields = [
    'imgUrl', 'sinner', 'nameEN', 'nameRU', 'rarity', 'idTier', 'skillsSin', 'skillsDmgType',
    'statusUnik', 'reviewEN', 'descriptionPassive1EN', 'descriptionPassive2EN',
    'descriptionCoinEN1', 'descriptionCoinEN2', 'descriptionCoinEN3', 'descriptionCoinEN4',
  ].join(',');
  const url = `${GLL_API}/rest/v1/ids?select=${fields}&apikey=${GLL_ANON_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GLL API ${res.status}`);
  const data = await res.json();
  writeGllCache(data);
  return data;
}

async function loadGllCatalog() {
  const rows = await fetchGllRows();
  const next = {};
  rows.forEach((row) => {
    next[row.imgUrl] = identityFromGll(row);
  });
  Object.keys(META_POOL).forEach((legacyKey) => {
    const meta = META_POOL[legacyKey];
    const row = findGllRow(rows, meta);
    if (row) {
      next[legacyKey] = { ...identityFromGll(row), ...meta, key: legacyKey, gllId: row.imgUrl };
    } else {
      next[legacyKey] = { ...meta, key: legacyKey, gllId: null };
    }
  });
  POOL = next;
  ALL_POOL_KEYS = rows
    .map((r) => r.imgUrl)
    .sort((a, b) => (POOL[a]?.name || a).localeCompare(POOL[b]?.name || b));
  gllLoaded = true;
}

function wikiPath(slug) {
  return slug.replace(/:/g, '%3A').replace(/&/g, '%26');
}

function WIKI_IMG(slug, w = 280) {
  if (!slug) return null;
  const p = wikiPath(slug);
  return `https://limbuscompany.wiki.gg/images/thumb/${p}.png/${w}px-${p}.png`;
}

function gllProfileUrls(imgUrl, rarity) {
  if (!imgUrl) return [];
  const profile = `${GLL_BASE}/images/identities-profiles/${imgUrl}`;
  const icon = `${GLL_BASE}/images/identities/${imgUrl}.webp`;
  if (rarity === '000' || rarity === '00') {
    return [`${profile}.2_profile.webp`, `${profile}.1_profile.webp`, icon];
  }
  return [`${profile}.1_profile.webp`, `${profile}.2_profile.webp`, icon];
}

function placeholderArt(sinner) {
  const [c1, c2] = SINNER_PALETTE[sinner] || ['#1a1a26', '#2a2a3a'];
  const initial = (sinner || '?')[0];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="420" viewBox="0 0 280 420">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient></defs>
    <rect width="280" height="420" fill="url(#g)"/>
    <text x="140" y="200" text-anchor="middle" fill="rgba(255,255,255,0.15)" font-size="120" font-family="serif" font-weight="bold">${initial}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function imageSources(id) {
  const src = [];
  if (id.img) src.push(id.img);
  const gllId = id.gllId || (id.key && id.key.startsWith('id_') ? id.key : null);
  if (gllId) src.push(...gllProfileUrls(gllId, id.rarity));
  if (id.wiki) src.push(WIKI_IMG(id.wiki));
  return src;
}

function cardArt(id) {
  const src = imageSources(id);
  return src[0] || placeholderArt(id.sinner);
}

function imgFallback(el) {
  const list = JSON.parse(el.dataset.sources || '[]');
  const i = parseInt(el.dataset.fi || '0', 10);
  if (i < list.length) {
    el.dataset.fi = String(i + 1);
    el.src = list[i];
    return;
  }
  el.onerror = null;
  el.src = el.dataset.placeholder || placeholderArt('?');
}

const ID = (key, name, sinner, wiki, rarity, effects, sins, role, tier = 'A', img = null) =>
  ({ key, name, sinner, wiki, rarity, effects, sins, role, tier, img });

const META_POOL = {
  lord_honglu: ID('lord_honglu', 'The Lord of Hongyuan', 'Hong Lu', 'The_Lord_of_Hongyuan_Hong_Lu', '000', ['Rupture', 'Deathrite'], ['Gluttony'], 'Core', 'SS'),
  mao_faust: ID('mao_faust', 'Heishou Pack - Mao Branch Adept', 'Faust', 'Heishou_Pack_-_Mao_Branch_Adept_Faust', '000', ['Rupture', 'Deathrite'], ['Sloth', 'Gluttony'], 'DPS', 'SS'),
  mao_ryoshu: ID('mao_ryoshu', 'Heishou Pack - Mao Branch', 'Ryōshū', 'Heishou_Pack_-_Mao_Branch_Ry%C5%8Dsh%C5%AB', '00', ['Rupture', 'Deathrite'], ['Gluttony'], 'DPS', 'S'),
  mao_outis: ID('mao_outis', 'Heishou Pack - Mao Branch', 'Outis', 'Heishou_Pack_-_Mao_Branch_Outis', '00', ['Rupture', 'Deathrite'], ['Gluttony'], 'DPS', 'S'),
  si_rodion: ID('si_rodion', 'Heishou Pack - Si Branch', 'Rodion', 'Heishou_Pack_-_Si_Branch_Rodion', '00', ['Rupture', 'Deathrite'], ['Gluttony'], 'DPS', 'S'),
  hierarch_ishmael: ID('hierarch_ishmael', 'Family Hierarch Candidate', 'Ishmael', 'Family_Hierarch_Candidate_Ishmael', '00', ['Rupture'], ['Gluttony'], 'Support', 'A'),
  devyat_rodion: ID('devyat_rodion', "Devyat' Assoc. North Section 3", 'Rodion', "Devyat'_Assoc._North_Section_3_Rodion", '00', ['Rupture'], ['Gluttony'], 'Burst', 'A'),
  lantern_yisang: ID('lantern_yisang', 'LCE E.G.O::Lantern', 'Yi Sang', 'LCE_E.G.O::Lantern_Yi_Sang', '00', ['Rupture'], ['Gluttony'], 'Sacrifice', 'B'),
  lantern_don: ID('lantern_don', 'Lobotomy E.G.O::Lantern', 'Don Quixote', 'Lobotomy_E.G.O::Lantern_Don_Quixote', '00', ['Rupture'], ['Gluttony'], 'Support', 'B'),
  seven_heathcliff: ID('seven_heathcliff', 'Seven Assoc. South Section 4', 'Heathcliff', 'Seven_Assoc._South_Section_4_Heathcliff', '0', ['Rupture'], ['Gluttony'], 'Flex', 'B'),
  wu_yisang: ID('wu_yisang', 'Heishou Pack - Wu Branch Adept', 'Yi Sang', 'Heishou_Pack_-_Wu_Branch_Adept_Yi_Sang', '000', ['Rupture'], ['Sloth'], 'Support', 'S'),
  you_heathcliff: ID('you_heathcliff', 'Heishou Pack - You Branch Adept', 'Heathcliff', 'Heishou_Pack_-_You_Branch_Adept_Heathcliff', '000', ['Rupture', 'Burn'], ['Pride'], 'Flex', 'A'),
  cinq_meursault: ID('cinq_meursault', 'Cinq Assoc. West Section 3', 'Meursault', 'Cinq_Assoc._West_Section_3_Meursault', '00', ['Rupture'], ['Gluttony'], 'Flex', 'B'),
  wcorp_yisang: ID('wcorp_yisang', 'W. Corp L3 Cleanup Agent', 'Yi Sang', 'W._Corp._L3_Cleanup_Agent_Yi_Sang', '00', ['Rupture'], ['Gluttony'], 'Flex', 'A'),

  manager_don: ID('manager_don', 'The Manager of La Manchaland', 'Don Quixote', 'The_Manager_of_La_Manchaland_Don_Quixote', '000', ['Bleed', 'Bloodfeast'], ['Lust'], 'Core', 'SS'),
  ring_yisang: ID('ring_yisang', 'Pointillist Ring', 'Yi Sang', 'The_Ring_Pointillist_Student_Yi_Sang', '00', ['Bleed'], ['Lust'], 'DPS', 'S'),
  princess_rodion: ID('princess_rodion', 'The Princess of La Manchaland', 'Rodion', 'The_Princess_of_La_Manchaland_Rodion', '00', ['Bleed', 'Bloodfeast'], ['Lust'], 'DPS', 'S'),
  kk_heathcliff: ID('kk_heathcliff', 'Kurokumo Clan Wakashu', 'Heathcliff', 'Kurokumo_Clan_Wakashu_Heathcliff', '00', ['Bleed'], ['Lust'], 'DPS', 'S'),
  kk_ishmael: ID('kk_ishmael', 'Kurokumo Clan Captain', 'Ishmael', 'Kurokumo_Clan_Captain_Ishmael', '00', ['Bleed'], ['Lust'], 'DPS', 'S'),
  barber_outis: ID('barber_outis', 'The Barber of La Manchaland', 'Outis', 'The_Barber_of_La_Manchaland_Outis', '00', ['Bleed', 'Bloodfeast'], ['Lust'], 'Support', 'A'),
  priest_gregor: ID('priest_gregor', 'The Priest of La Manchaland', 'Gregor', 'The_Priest_of_La_Manchaland_Gregor', '00', ['Bleed', 'Bloodfeast'], ['Lust'], 'Tank', 'A'),
  ring_outis: ID('ring_outis', 'Pointillist Ring', 'Outis', 'The_Ring_Pointillist_Student_Outis', '00', ['Bleed'], ['Lust'], 'DPS', 'B'),
  red_eyes_ryoshu: ID('red_eyes_ryoshu', 'Red Eyes & Penitence', 'Ryōshū', 'Lobotomy_E.G.O::Red_Eyes_%26_Penitence_Ry%C5%8Dsh%C5%AB', '00', ['Bleed'], ['Lust'], 'Flex', 'A'),
  tingtang_honglu: ID('tingtang_honglu', 'Ting Tang Gang Leader', 'Hong Lu', 'Tingtang_Gang_Gangleader_Hong_Lu', '0', ['Bleed'], ['Lust'], 'Flex', 'B'),
  grips_faust: ID('grips_faust', 'The One Who Grips', 'Faust', 'The_One_Who_Grips_Faust', '00', ['Bleed'], ['Lust'], 'Support', 'B'),
  rcorp_meursault: ID('rcorp_meursault', 'R Corp. 4th Pack Rhino', 'Meursault', 'R_Corp._4th_Pack_Rhino_Meursault', '00', ['Bleed'], ['Lust'], 'Flex', 'A'),

  knight_rodion: ID('knight_rodion', 'Knight of Despair', 'Rodion', 'Lobotomy_E.G.O::The_Sword_Sharpened_with_Tears_Rodion', '000', ['Sinking', 'Gloom'], ['Gloom'], 'Core', 'SS'),
  spicebush_yisang: ID('spicebush_yisang', 'Spicebush', 'Yi Sang', 'Effloresced_E.G.O::Spicebush_Yi_Sang', '000', ['Sinking', 'Gloom'], ['Gloom'], 'Burst', 'SS'),
  dongbaek_yisang: ID('dongbaek_yisang', 'Dongbaek', 'Yi Sang', 'Dongbaek_Yi_Sang', '000', ['Sinking', 'Gloom'], ['Gloom'], 'Burst', 'S'),
  butler_faust: ID('butler_faust', 'Butler', 'Faust', 'Wuthering_Heights_Butler_Faust', '00', ['Sinking', 'Echoes'], ['Gloom'], 'Enabler', 'S'),
  wildhunt_heathcliff: ID('wildhunt_heathcliff', 'Wild Hunt', 'Heathcliff', 'Wild_Hunt_Heathcliff', '000', ['Sinking', 'Coffin'], ['Gloom'], 'DPS', 'S'),
  index_don: ID('index_don', 'Index Proselyte', 'Don Quixote', 'The_Index_Proxy_-_Effloresced_E.G.O::Procuration_Don_Quixote', '000', ['Sinking', 'Rupture'], ['Gloom'], 'Hybrid', 'S'),
  butler_outis: ID('butler_outis', 'Butler', 'Outis', 'Wuthering_Heights_Chief_Butler_Outis', '00', ['Sinking'], ['Gloom'], 'Flex', 'A'),
  molar_ishmael: ID('molar_ishmael', 'Molar Boatworks Fixer', 'Ishmael', 'Molar_Boatworks_Fixer_Ishmael', '0', ['Sinking'], ['Gloom'], 'Flex', 'B'),
  bygone_ishmael: ID('bygone_ishmael', 'Bygone Days', 'Ishmael', 'Bygone_Days_Ishmael', '00', ['Sinking', 'Echoes'], ['Gloom'], 'Enabler', 'A'),
  bygone_yisang: ID('bygone_yisang', 'Bygone Days', 'Yi Sang', 'Bygone_Days_Yi_Sang', '00', ['Sinking'], ['Gloom'], 'Stack', 'A'),
  solemn_yisang: ID('solemn_yisang', 'Solemn Lament', 'Yi Sang', 'Lobotomy_E.G.O::Solemn_Lament_Yi_Sang', '00', ['Sinking', 'Butterfly'], ['Gloom'], 'Core', 'S'),
  butler_ryoshu: ID('butler_ryoshu', 'Butler', 'Ryōshū', 'Wuthering_Heights_Chief_Butler_Ry%C5%8Dsh%C5%AB', '00', ['Sinking'], ['Gloom'], 'Support', 'A'),
  edgar_gregor: ID('edgar_gregor', 'Edgar Family Heir', 'Gregor', 'Edgar_Family_Heir_Gregor', '00', ['Sinking', 'Butterfly'], ['Gloom'], 'DPS', 'A'),

  magic_outis: ID('magic_outis', 'Magic Bullet', 'Outis', 'Magic_Bullet_Outis', '000', ['Burn', 'Dark Flame'], ['Wrath'], 'Core', 'SS'),
  thumb_meursault: ID('thumb_meursault', 'Thumb East Capo', 'Meursault', 'The_Thumb_East_Capo_IIII_Meursault', '00', ['Burn'], ['Wrath'], 'DPS', 'S'),
  firefist_gregor: ID('firefist_gregor', 'Firefist Office Survivor', 'Gregor', 'Firefist_Office_Survivor_Gregor', '00', ['Burn'], ['Wrath'], 'DPS', 'S'),
  liu_yisang: ID('liu_yisang', 'Liu Assoc. South Section 3', 'Yi Sang', 'Liu_Association_South_Section_3_Yi_Sang', '00', ['Burn'], ['Wrath'], 'Stack', 'S'),
  ardor_faust: ID('ardor_faust', 'LCE E.G.O::Ardor Blossom Star', 'Faust', 'LCE_E.G.O::Ardor_Blossom_Star_Faust', '000', ['Burn'], ['Wrath'], 'Burst', 'S'),
  liu_rodion: ID('liu_rodion', 'Liu Assoc. South Section 4', 'Rodion', 'Liu_Assoc._South_Section_4_Director_Rodion', '00', ['Burn'], ['Wrath'], 'Flex', 'A'),
  you_sinclair: ID('you_sinclair', 'Heishou Pack - You Branch', 'Sinclair', 'Heishou_Pack_-_You_Branch_Sinclair', '00', ['Burn'], ['Pride'], 'Flex', 'A'),
  lamp_gregor: ID('lamp_gregor', 'Lobotomy E.G.O::Lamp', 'Gregor', 'Lobotomy_E.G.O::Lamp_Gregor', '00', ['Burn'], ['Wrath'], 'Flex', 'B'),
  liu_gregor: ID('liu_gregor', 'Liu Assoc. South Section 6', 'Gregor', 'Liu_Association_South_Section_6_Gregor', '00', ['Burn'], ['Wrath'], 'Flex', 'A'),

  fullstop_ryoshu: ID('fullstop_ryoshu', 'Fullstop Office Rep.', 'Ryōshū', 'Fullstop_Office_Rep._Ry%C5%8Dsh%C5%AB', '00', ['Poise'], ['Pride'], 'DPS', 'S'),
  blade_yisang: ID('blade_yisang', 'Blade Lineage Salsu', 'Yi Sang', 'Blade_Lineage_Salsu_Yi_Sang', '00', ['Poise'], ['Pride'], 'DPS', 'A'),
  seven_ryoshu: ID('seven_ryoshu', 'Seven Assoc. South Section 6', 'Ryōshū', 'Seven_Association_South_Section_6_Ry%C5%8Dsh%C5%AB', '0', ['Poise'], ['Gluttony'], 'Flex', 'B'),
  everlasting_faust: ID('everlasting_faust', 'LCE E.G.O::Everlasting', 'Faust', 'LCE_E.G.O::Everlasting_Faust', '000', ['Tremor', 'Reverb'], ['Sloth'], 'DPS', 'S'),
  yuro_ryoshu: ID('yuro_ryoshu', 'District 20 Yuromotion', 'Ryōshū', 'District_20_Yurodivy_Ry%C5%8Dsh%C5%AB', '00', ['Tremor'], ['Sloth'], 'Flex', 'B'),
  rodion_charge: ID('rodion_charge', 'Rosespanner Workshop Rep.', 'Rodion', 'Rosespanner_Workshop_Rep._Rodion', '00', ['Charge'], ['Envy'], 'DPS', 'A'),
  wcorp_outis: ID('wcorp_outis', 'W Corp. L3 Cleanup Agent', 'Outis', 'W._Corp._L3_Cleanup_Agent_Outis', '00', ['Charge'], ['Envy'], 'Core', 'S'),
};

const META_TIERS = [
  { tier: 'S', label: 'Dominant Meta', effects: ['Rupture', 'Bleed', 'Sinking'] },
  { tier: 'A', label: 'Strong / Niche', effects: ['Burn', 'Poise'] },
  { tier: 'B', label: 'Below Meta', effects: ['Charge', 'Tremor'] },
];

const CUSTOM_TEAM = {
  id: 'custom',
  isCustom: true,
  name: 'My Custom Team',
  tier: '—',
  color: 'var(--accent2)',
  effect: null,
  desc: 'Pick any 6 identities. Set a team name, then analyze synergy and status coverage.',
  coreKeys: [],
  slots: Array.from({ length: 6 }, () => ({ key: null, alts: [] })),
};

const TEAMS = [
  CUSTOM_TEAM,
  {
    id: 'rupture',
    name: 'Heishou Rupture',
    tier: 'S',
    color: 'var(--rupture)',
    effect: 'Rupture',
    desc: 'Stack Rupture + Deathrite via Heishou Mao Branch. Lord of Hongyuan enables Skill 3 chains. Best vs bosses & single targets.',
    coreKeys: ['lord_honglu', 'mao_faust', 'mao_ryoshu', 'mao_outis'],
    slots: [
      { key: 'lord_honglu', alts: ['devyat_rodion', 'seven_heathcliff', 'you_heathcliff', 'wu_yisang'] },
      { key: 'mao_faust', alts: ['wu_yisang', 'hierarch_ishmael', 'lantern_yisang', 'cinq_meursault'] },
      { key: 'mao_ryoshu', alts: ['si_rodion', 'devyat_rodion', 'seven_heathcliff', 'wcorp_yisang'] },
      { key: 'mao_outis', alts: ['si_rodion', 'lantern_don', 'seven_heathcliff', 'cinq_meursault'] },
      { key: 'si_rodion', alts: ['devyat_rodion', 'hierarch_ishmael', 'mao_faust', 'you_heathcliff'] },
      { key: 'hierarch_ishmael', alts: ['wu_yisang', 'lantern_yisang', 'seven_heathcliff', 'devyat_rodion'] },
    ],
  },
  {
    id: 'bleed',
    name: 'Bloodfiend + Kurokumo Bleed',
    tier: 'S',
    color: 'var(--bleed)',
    effect: 'Bleed',
    desc: 'Bloodfeast synergy with 3+ Lust resonance. Manager Don + Kurokumo core for bleed count and burst. Top MD & human fights.',
    coreKeys: ['manager_don', 'ring_yisang', 'princess_rodion', 'kk_heathcliff'],
    slots: [
      { key: 'manager_don', alts: ['ring_yisang', 'red_eyes_ryoshu', 'grips_faust', 'priest_gregor'] },
      { key: 'ring_yisang', alts: ['ring_outis', 'manager_don', 'red_eyes_ryoshu', 'barber_outis'] },
      { key: 'princess_rodion', alts: ['barber_outis', 'priest_gregor', 'tingtang_honglu', 'kk_ishmael'] },
      { key: 'kk_heathcliff', alts: ['kk_ishmael', 'red_eyes_ryoshu', 'priest_gregor', 'ring_outis'] },
      { key: 'kk_ishmael', alts: ['barber_outis', 'ring_outis', 'red_eyes_ryoshu', 'rcorp_meursault'] },
      { key: 'barber_outis', alts: ['priest_gregor', 'red_eyes_ryoshu', 'tingtang_honglu', 'grips_faust'] },
    ],
  },
  {
    id: 'sinking-deluge',
    name: 'Sinking — Deluge Burst',
    tier: 'S',
    color: 'var(--sinking)',
    effect: 'Sinking',
    desc: 'Echoes of the Manor + Spicebush S3 for massive Gloom burst. Knight of Despair stacks Sinking. Best vs Gloom-weak bosses.',
    coreKeys: ['knight_rodion', 'spicebush_yisang', 'butler_faust'],
    slots: [
      { key: 'knight_rodion', alts: ['dongbaek_yisang', 'butler_outis', 'molar_ishmael', 'bygone_yisang'] },
      { key: 'spicebush_yisang', alts: ['dongbaek_yisang', 'bygone_yisang', 'solemn_yisang', 'wildhunt_heathcliff'] },
      { key: 'butler_faust', alts: ['bygone_ishmael', 'butler_outis', 'wildhunt_heathcliff', 'molar_ishmael'] },
      { key: 'wildhunt_heathcliff', alts: ['index_don', 'molar_ishmael', 'butler_ryoshu', 'edgar_gregor'] },
      { key: 'index_don', alts: ['dongbaek_yisang', 'butler_outis', 'molar_ishmael', 'solemn_yisang'] },
      { key: 'bygone_ishmael', alts: ['butler_faust', 'molar_ishmael', 'butler_outis', 'knight_rodion'] },
    ],
  },
  {
    id: 'sinking-butterfly',
    name: 'Sinking — Butterfly',
    tier: 'A',
    color: 'var(--sinking)',
    effect: 'Sinking',
    desc: 'Butterfly + Owl damage on top of Sinking. Solemn Lament Yi Sang core. Strong vs Gloom weak; slightly below Deluge in burst.',
    coreKeys: ['solemn_yisang', 'knight_rodion', 'bygone_yisang'],
    slots: [
      { key: 'solemn_yisang', alts: ['bygone_yisang', 'spicebush_yisang', 'dongbaek_yisang', 'butler_faust'] },
      { key: 'bygone_yisang', alts: ['spicebush_yisang', 'solemn_yisang', 'dongbaek_yisang', 'wildhunt_heathcliff'] },
      { key: 'knight_rodion', alts: ['butler_outis', 'molar_ishmael', 'index_don', 'spicebush_yisang'] },
      { key: 'bygone_ishmael', alts: ['butler_faust', 'butler_outis', 'molar_ishmael', 'wildhunt_heathcliff'] },
      { key: 'edgar_gregor', alts: ['butler_ryoshu', 'wildhunt_heathcliff', 'molar_ishmael', 'priest_gregor'] },
      { key: 'butler_ryoshu', alts: ['butler_outis', 'butler_faust', 'index_don', 'edgar_gregor'] },
    ],
  },
  {
    id: 'burn',
    name: 'Burn — Magic Bullet Core',
    tier: 'A',
    color: 'var(--burn)',
    effect: 'Burn',
    desc: 'Magic Bullet Outis mandatory — Dark Flame doubles Burn cap. Stack Burn + multi-source damage. Strong but below Rupture/Bleed/Sinking.',
    coreKeys: ['magic_outis', 'firefist_gregor', 'liu_yisang'],
    slots: [
      { key: 'magic_outis', alts: ['thumb_meursault', 'ardor_faust', 'lamp_gregor', 'liu_rodion'] },
      { key: 'thumb_meursault', alts: ['firefist_gregor', 'liu_rodion', 'you_sinclair', 'liu_gregor'] },
      { key: 'firefist_gregor', alts: ['lamp_gregor', 'liu_rodion', 'you_heathcliff', 'liu_gregor'] },
      { key: 'liu_yisang', alts: ['ardor_faust', 'you_sinclair', 'liu_rodion', 'magic_outis'] },
      { key: 'ardor_faust', alts: ['liu_rodion', 'magic_outis', 'you_sinclair', 'firefist_gregor'] },
      { key: 'liu_rodion', alts: ['you_sinclair', 'thumb_meursault', 'lamp_gregor', 'ardor_faust'] },
    ],
  },
];

const teamState = {};
let customTeamName = 'My Custom Team';
let modalContext = null;
let modalTab = 'recommended';

function initState() {
  TEAMS.forEach(t => {
    if (t.isCustom) {
      teamState[t.id] = [null, null, null, null, null, null];
    } else {
      teamState[t.id] = t.slots.map(s => s.key);
    }
  });
}

function getId(key) {
  if (!key) return null;
  if (POOL[key]) return POOL[key];
  return {
    key, name: key, sinner: '?', wiki: '', rarity: '0', effects: [], statuses: [],
    attackTypes: [], sins: [], role: 'Unknown', tier: 'C', gllTier: 'C', gllId: null,
  };
}

function getTeam(teamId) {
  return TEAMS.find(t => t.id === teamId);
}

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
/* UI + boot — appended to app.js */

function buildEmptyCard(slotNum, teamId, slotIdx) {
  return [
    '<div class="identity-card empty-card" data-team="', teamId, '" data-slot="', slotIdx, '" title="Click to add identity">',
    '<span class="card-slot">', slotNum, '</span>',
    '<span class="empty-plus">+</span>',
    '<span class="empty-label">Add ID</span>',
    '</div>',
  ].join('');
}

function buildCard(id, slotNum, teamId, slotIdx, swapped, extraClass) {
  extraClass = extraClass || '';
  if (!id) return buildEmptyCard(slotNum, teamId, slotIdx);
  const sources = imageSources(id);
  const primary = sources[0] || placeholderArt(id.sinner);
  const fallbacks = sources.slice(1);
  const placeholder = placeholderArt(id.sinner);
  const srcJson = escapeAttr(JSON.stringify(fallbacks));
  const slotLabel = slotNum !== '' ? '<span class="card-slot">' + slotNum + '</span>' : '';
  const rClass = (id.rarity || '0').replace(/[^0]/g, '') || '0';
  return [
    '<div class="identity-card', swapped ? ' swapped' : '', extraClass, '" data-team="', teamId, '" data-slot="', slotIdx, '" title="Click to swap identity">',
    slotLabel,
    '<span class="card-swap-hint">Swap</span>',
    '<img src="', primary, '" alt="', escapeAttr(id.name), '" loading="lazy" data-sources="', srcJson, '" data-fi="0" data-placeholder="', escapeAttr(placeholder), '" onerror="imgFallback(this)">',
    '<span class="card-rarity rarity-', rClass, '">', id.rarity, '</span>',
    '<div class="card-nameplate"><div class="card-name">', id.name, '</div><div class="card-sinner">', id.sinner, '</div></div>',
    '</div>',
  ].join('');
}

function usedSinners(teamId, excludeSlot) {
  const keys = teamState[teamId] || [];
  const set = new Set();
  keys.forEach(function (k, i) {
    if (i === excludeSlot || !k) return;
    const id = getId(k);
    if (id) set.add(id.sinner);
  });
  return set;
}

function renderMetaOverview() {
  const el = document.getElementById('meta-overview');
  el.innerHTML = META_TIERS.map(function (t) {
    return '<div class="tier-card tier-' + t.tier.toLowerCase() + '"><h3>Tier ' + t.tier + ' — ' + t.label + '</h3><div class="tier-tags">' +
      t.effects.map(function (e) { return '<span class="tag tag-' + e.toLowerCase() + '">' + e + '</span>'; }).join('') +
      '</div></div>';
  }).join('');
}

function renderTeams() {
  const root = document.getElementById('teams-root');
  root.innerHTML = TEAMS.map(function (team) {
    const defaultKeys = team.isCustom ? [null, null, null, null, null, null] : team.slots.map(function (s) { return s.key; });
    const currentKeys = teamState[team.id];
    const tierBadge = team.isCustom ? 'tier-custom-badge' : (team.tier === 'S' ? 'tier-s-badge' : 'tier-a-badge');
    const tierLabel = team.isCustom ? 'CUSTOM' : ('TIER ' + team.tier);

    const cards = currentKeys.map(function (key, i) {
      const id = key ? getId(key) : null;
      const swapped = !team.isCustom && key !== defaultKeys[i];
      return buildCard(id, i + 1, team.id, i, swapped);
    }).join('');

    const nameBlock = team.isCustom
      ? '<input type="text" class="custom-name-input" id="custom-team-name" value="' + escapeAttr(customTeamName) + '" placeholder="Team name">'
      : '';

    return '<section class="team-section' + (team.isCustom ? ' custom-team' : '') + '" data-team-id="' + team.id + '">' +
      '<div class="team-header"><div class="team-title-wrap"><h2>' + (team.isCustom ? customTeamName : team.name) +
      ' <span class="team-tier ' + tierBadge + '">' + tierLabel + '</span></h2>' + nameBlock +
      '<p class="team-desc">' + team.desc + '</p></div>' +
      '<div class="team-actions">' +
      (team.isCustom ? '' : '<button class="btn btn-ghost" data-reset="' + team.id + '">Reset Team</button>') +
      '<button class="btn btn-primary" data-analyze="' + team.id + '">Analyze Effectiveness</button>' +
      '<label class="btn btn-ghost btn-upload"><input type="file" accept="image/*" hidden data-image-analyze="' + team.id + '">Analyze Screenshot</label>' +
      '</div></div>' +
      '<div class="identity-row">' + cards + '</div>' +
      '<div class="analysis-panel" id="analysis-' + team.id + '"></div></section>';
  }).join('');

  root.querySelectorAll('.identity-card').forEach(function (card) {
    card.addEventListener('click', function () {
      openSwapModal(card.dataset.team, +card.dataset.slot);
    });
  });

  root.querySelectorAll('[data-analyze]').forEach(function (btn) {
    btn.addEventListener('click', function () { analyzeTeam(btn.dataset.analyze); });
  });

  root.querySelectorAll('[data-image-analyze]').forEach(function (input) {
    input.addEventListener('change', function () {
      const file = input.files && input.files[0];
      if (file) analyzeTeamFromImage(input.dataset.imageAnalyze, file);
      input.value = '';
    });
  });

  root.querySelectorAll('[data-reset]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const t = getTeam(btn.dataset.reset);
      teamState[t.id] = t.slots.map(function (s) { return s.key; });
      renderTeams();
    });
  });

  const nameInput = document.getElementById('custom-team-name');
  if (nameInput) {
    nameInput.addEventListener('input', function () {
      customTeamName = nameInput.value.trim() || 'My Custom Team';
      var title = document.querySelector('.custom-team h2');
      if (title) title.childNodes[0].textContent = customTeamName + ' ';
    });
  }
}

function getRecommendedKeys(team, slotIdx) {
  if (team.isCustom) return [];
  const slot = team.slots[slotIdx];
  const current = teamState[team.id][slotIdx];
  const keys = [slot.key];
  slot.alts.forEach(function (k) { if (keys.indexOf(k) === -1) keys.push(k); });
  if (current && keys.indexOf(current) === -1) keys.unshift(current);
  return keys;
}

function renderAltGrid(container, keys, teamId, slotIdx, currentKey, taken) {
  container.innerHTML = keys.map(function (key) {
    const id = getId(key);
    const selected = key === currentKey;
    const disabled = taken.has(id.sinner) && key !== currentKey;
    return '<div class="alt-card' + (selected ? ' selected' : '') + (disabled ? ' disabled' : '') + '" data-key="' + key + '">' +
      buildCard(id, '', '', '', false) + '</div>';
  }).join('');

  container.querySelectorAll('.alt-card:not(.disabled)').forEach(function (el) {
    el.addEventListener('click', function () {
      teamState[teamId][slotIdx] = el.dataset.key;
      closeModal();
      renderTeams();
    });
  });
}

function identityHasAttack(id, attackFilter) {
  if (!attackFilter) return true;
  return (id.attackTypes || []).indexOf(attackFilter) >= 0;
}

function identityHasStatus(id, statusFilter) {
  if (!statusFilter) return true;
  const pool = [...(id.statuses || []), ...(id.effects || [])];
  return pool.some(function (s) {
    return s.toLowerCase().indexOf(statusFilter.toLowerCase()) >= 0;
  });
}

function filterAllKeys(query, sinnerFilter, attackFilter, statusFilter) {
  const q = (query || '').toLowerCase();
  return ALL_POOL_KEYS.filter(function (key) {
    const id = getId(key);
    if (sinnerFilter && id.sinner !== sinnerFilter) return false;
    if (!identityHasAttack(id, attackFilter)) return false;
    if (!identityHasStatus(id, statusFilter)) return false;
    if (!q) return true;
    return id.name.toLowerCase().indexOf(q) >= 0 || id.sinner.toLowerCase().indexOf(q) >= 0 || key.indexOf(q) >= 0;
  });
}

function refreshModalAllGrid() {
  if (!modalContext) return;
  const search = document.getElementById('modal-search').value;
  const sinner = getFilterValue('modal', 'sinner');
  const attack = getFilterValue('modal', 'attack');
  const status = getFilterValue('modal', 'status');
  const taken = usedSinners(modalContext.teamId, modalContext.slotIdx);
  const currentKey = teamState[modalContext.teamId][modalContext.slotIdx];
  const keys = filterAllKeys(search, sinner, attack, status);
  const grid = document.getElementById('alt-grid-all');
  if (!keys.length) {
    grid.innerHTML = '<p class="alt-note">No identities match these filters.</p>';
    return;
  }
  renderAltGrid(grid, keys, modalContext.teamId, modalContext.slotIdx, currentKey, taken);
}

function updateModalFiltersVisibility() {
  const team = modalContext && getTeam(modalContext.teamId);
  const show = modalTab === 'all' || (team && team.isCustom);
  document.getElementById('modal-filters').hidden = !show;
}

function setModalTab(tab) {
  modalTab = tab;
  document.querySelectorAll('.modal-tab').forEach(function (btn) {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  document.getElementById('modal-recommended-wrap').hidden = tab !== 'recommended';
  document.getElementById('modal-all-wrap').hidden = tab !== 'all';
  updateModalFiltersVisibility();
}

function openSwapModal(teamId, slotIdx) {
  const team = getTeam(teamId);
  modalContext = { teamId: teamId, slotIdx: slotIdx };
  const currentKey = teamState[teamId][slotIdx];
  const taken = usedSinners(teamId, slotIdx);
  const slotDefault = team.isCustom ? null : team.slots[slotIdx].key;

  document.getElementById('modal-title').textContent = 'Slot ' + (slotIdx + 1) + ' — Choose Identity';
  document.getElementById('modal-note').textContent = team.isCustom
    ? 'Pick any identity. Filter by attack type & status. One identity per Sinner.'
    : ('Recommended replacements if you don\'t own ' + getId(slotDefault).name + '. Duplicates lower your score.');

  const recKeys = getRecommendedKeys(team, slotIdx);
  const recGrid = document.getElementById('alt-grid-recommended');
  if (recKeys.length === 0) {
    recGrid.innerHTML = '<p class="alt-note">No preset recommendations for this slot — switch to <strong>All Identities</strong>.</p>';
  } else {
    renderAltGrid(recGrid, recKeys, teamId, slotIdx, currentKey, taken);
  }

  document.getElementById('modal-search').value = '';
  resetIconFilters('modal');
  const recTab = document.querySelector('.modal-tab[data-tab="recommended"]');
  if (recTab) recTab.hidden = !!team.isCustom;
  refreshModalAllGrid();
  setModalTab(team.isCustom ? 'all' : 'recommended');
  document.getElementById('swap-modal').classList.add('open');
}

function closeModal() {
  document.getElementById('swap-modal').classList.remove('open');
  modalContext = null;
}

function matchesEffect(id, effect) {
  if (!effect) return false;
  return id.effects.some(function (e) {
    if (e.toLowerCase().indexOf(effect.toLowerCase()) >= 0) return true;
    if (effect === 'Rupture' && e.indexOf('Deathrite') >= 0) return true;
    return false;
  });
}

function detectPrimaryEffect(ids) {
  const counts = {};
  ids.forEach(function (id) {
    id.effects.forEach(function (e) {
      PRIMARY_EFFECTS.forEach(function (p) {
        if (e.indexOf(p) >= 0) counts[p] = (counts[p] || 0) + 1;
      });
    });
  });
  const sorted = Object.entries(counts).sort(function (a, b) { return b[1] - a[1]; });
  return sorted[0] ? sorted[0][0] : 'Mixed';
}

let tesseractPromise = null;

function loadTesseract() {
  if (window.Tesseract) return Promise.resolve(window.Tesseract);
  if (!tesseractPromise) {
    tesseractPromise = new Promise(function (resolve, reject) {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
      s.onload = function () { resolve(window.Tesseract); };
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  return tesseractPromise;
}

function readFileAsDataUrl(file) {
  return new Promise(function (resolve, reject) {
    const r = new FileReader();
    r.onload = function () { resolve(r.result); };
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function matchIdentitiesFromOcr(text) {
  const hay = normName(text);
  const candidates = [];
  ALL_POOL_KEYS.forEach(function (key) {
    const id = getId(key);
    const nn = normName(id.name);
    if (nn.length < 5) return;
    if (hay.indexOf(nn) >= 0) candidates.push({ key: key, name: id.name, sinner: id.sinner, score: nn.length });
    else {
      const parts = nn.split(' ').filter(function (w) { return w.length > 4; });
      const hits = parts.filter(function (w) { return hay.indexOf(w) >= 0; }).length;
      if (hits >= 2 || (parts.length === 1 && hits === 1)) {
        candidates.push({ key: key, name: id.name, sinner: id.sinner, score: hits * 10 });
      }
    }
  });
  candidates.sort(function (a, b) { return b.score - a.score; });
  const bySinner = {};
  candidates.forEach(function (m) {
    if (!bySinner[m.sinner]) bySinner[m.sinner] = m;
  });
  return Object.values(bySinner);
}

async function analyzeTeamFromImage(teamId, file) {
  const panel = document.getElementById('analysis-' + teamId);
  panel.classList.add('visible');
  panel.innerHTML = '<p class="ocr-loading">Reading screenshot with OCR…</p>';

  try {
    const dataUrl = await readFileAsDataUrl(file);
    const Tesseract = await loadTesseract();
    const result = await Tesseract.recognize(dataUrl, 'eng');
    const text = result.data.text || '';
    const detected = matchIdentitiesFromOcr(text);

    if (teamId === 'custom' && detected.length) {
      detected.slice(0, 6).forEach(function (m, i) {
        teamState.custom[i] = m.key;
      });
      for (let i = detected.length; i < 6; i++) teamState.custom[i] = null;
      renderTeams();
    }

    analyzeTeam(teamId, {
      imageUrl: dataUrl,
      ocrText: text,
      detectedKeys: detected.map(function (d) { return d.key; }),
    });
  } catch (err) {
    console.error(err);
    panel.innerHTML = '<p style="color:var(--danger)">Could not read the image. Try a clearer screenshot.</p>';
  }
}

function renderTierList() {
  const root = document.getElementById('tierlist-root');
  if (!root || !gllLoaded) return;

  const buckets = {};
  TIER_ORDER.forEach(function (t) { buckets[t] = []; });

  filterKeysForTierList().forEach(function (key) {
    const id = getId(key);
    const tier = id.gllTier || 'C';
    if (!buckets[tier]) buckets[tier] = [];
    buckets[tier].push(key);
  });

  const tierColors = {
    SSS: '#fbbf24', SS: '#f59e0b', S: '#a78bfa', A: '#60a5fa', B: '#8b8899', C: '#6b7280',
  };

  const sections = TIER_ORDER.filter(function (t) { return buckets[t] && buckets[t].length; }).map(function (tier) {
    const cards = buckets[tier].map(function (key) {
      const id = getId(key);
      return '<div class="tierlist-card" title="' + escapeAttr(id.name) + '">' + buildCard(id, '', '', '', false) + '</div>';
    }).join('');
    return '<section class="gll-tier-section" style="--tier-color:' + (tierColors[tier] || '#8b8899') + '">' +
      '<h2 class="gll-tier-heading">Tier ' + tier + ' <span class="gll-tier-count">' + buckets[tier].length + '</span></h2>' +
      '<div class="tierlist-grid">' + cards + '</div></section>';
  });
  root.innerHTML = sections.join('') || '<p class="alt-note">No identities match filters.</p>';
}

function setPage(page) {
  const teamsPage = document.getElementById('page-teams');
  const tierPage = document.getElementById('page-tierlist');
  const metaBanner = document.querySelector('.meta-banner');
  if (teamsPage) teamsPage.hidden = page !== 'teams';
  if (tierPage) tierPage.hidden = page !== 'tierlist';
  if (metaBanner) metaBanner.hidden = page !== 'teams';
  document.querySelectorAll('.main-nav-btn').forEach(function (btn) {
    btn.classList.toggle('active', btn.dataset.page === page);
  });
  if (page === 'tierlist') renderTierList();
}

function analyzeTeam(teamId, opts) {
  opts = opts || {};
  const team = getTeam(teamId);
  const keys = opts.detectedKeys && opts.detectedKeys.length
    ? opts.detectedKeys
    : teamState[teamId].filter(function (k) { return k; });
  const panel = document.getElementById('analysis-' + teamId);

  if (keys.length < 6) {
    let partial = '<p style="color:var(--warn)">Need 6 identities for full analysis. Found: ' + keys.length + '.</p>';
    if (opts.detectedKeys && opts.detectedKeys.length) {
      partial += '<p class="ocr-detected">Detected: ' + keys.map(function (k) { return getId(k).name; }).join(', ') + '</p>';
    }
    if (opts.imageUrl) {
      partial += '<img class="analysis-screenshot" src="' + opts.imageUrl + '" alt="Team screenshot">';
    }
    if (teamId === 'custom' && opts.detectedKeys && opts.detectedKeys.length) {
      partial += '<p style="font-size:0.85rem;color:var(--muted)">Matched identities were applied to empty custom slots where possible.</p>';
    }
    panel.innerHTML = partial;
    panel.classList.add('visible');
    return;
  }

  const ids = keys.map(getId);
  const effect = team.isCustom ? detectPrimaryEffect(ids) : team.effect;
  const sinners = ids.map(function (i) { return i.sinner; });
  const dupes = sinners.filter(function (s, i) { return sinners.indexOf(s) !== i; });

  let score = team.isCustom ? 50 : 55;
  const pros = [];
  const cons = [];
  const tips = [];

  if (!team.isCustom && team.coreKeys.length) {
    const hasCore = team.coreKeys.filter(function (k) { return keys.indexOf(k) >= 0; }).length;
    const coreRatio = hasCore / team.coreKeys.length;
    score += Math.round(coreRatio * 25);
    if (coreRatio === 1) pros.push('Full meta core — maximum status synergy and passive triggers.');
    else if (coreRatio >= 0.5) {
      pros.push(hasCore + '/' + team.coreKeys.length + ' core identities present.');
      tips.push('Missing core: ' + team.coreKeys.filter(function (k) { return keys.indexOf(k) < 0; }).map(function (k) { return getId(k).name; }).join(', ') + '.');
    } else {
      cons.push('Several core identities missing — team may lack key passive chains.');
      score -= 10;
    }
  }

  const effectMatch = ids.filter(function (i) { return matchesEffect(i, effect); }).length;
  score += Math.min(15, effectMatch * 2);

  if (effectMatch >= 4) pros.push('Strong ' + effect + ' coverage across ' + effectMatch + '/6 slots.');
  else if (effectMatch >= 2) {
    tips.push('Only ' + effectMatch + ' units align with ' + effect + '. Consider more specialists.');
    score -= 5;
  } else {
    cons.push('Weak ' + effect + ' synergy — mixed archetypes hurt consistency.');
    score -= 15;
  }

  if (dupes.length) {
    cons.push('Duplicate Sinner: ' + Array.from(new Set(dupes)).join(', ') + ' — only one identity per character.');
    score -= 20;
  } else pros.push('No duplicate Sinners — valid 6-unit roster.');

  if (opts.imageUrl) {
    pros.push('Analysis based on uploaded team screenshot (' + keys.length + ' identities recognized).');
  }

  const avgTier = ids.reduce(function (a, i) {
    const t = i.gllTier || i.tier;
    return a + ({ SSS: 6, SS: 5, S: 4, A: 3, B: 2, C: 1 }[t] || 1);
  }, 0) / 6;
  score += Math.round((avgTier - 2.5) * 4);
  score = Math.max(15, Math.min(99, score));

  if (team.isCustom) {
    pros.push('Primary archetype detected: ' + effect + '.');
    if (effect === 'Mixed') tips.push('Team spans multiple status effects — consider focusing on one for better synergy.');
  }

  if (!team.isCustom) {
    const swapped = keys.filter(function (k, i) { return k !== team.slots[i].key; }).length;
    if (swapped) tips.push(swapped + ' slot(s) modified from default meta build.');
    if (teamId === 'rupture' && keys.indexOf('lord_honglu') < 0) {
      cons.push('Without Lord of Hongyuan, Heishou Skill 3 chains are much harder.');
      score -= 8;
    }
    if (teamId === 'bleed' && keys.filter(function (k) { return ['manager_don', 'princess_rodion', 'barber_outis', 'priest_gregor'].indexOf(k) >= 0; }).length < 2) {
      tips.push('Bloodfeast works best with 2+ La Manchaland identities.');
    }
    if (teamId === 'burn' && keys.indexOf('magic_outis') < 0) {
      cons.push('Magic Bullet Outis is mandatory for Burn — Dark Flame breaks the damage cap.');
      score -= 12;
    }
    if (teamId === 'sinking-deluge' && keys.indexOf('spicebush_yisang') >= 0 && keys.indexOf('knight_rodion') >= 0) {
      pros.push('Spicebush + Knight of Despair — optimal Deluge burst pairing.');
    }
  }

  let rating, color;
  if (score >= 85) { rating = 'Excellent'; color = 'var(--success)'; }
  else if (score >= 70) { rating = 'Good'; color = 'var(--warn)'; }
  else if (score >= 55) { rating = 'Average'; color = '#fb923c'; }
  else { rating = 'Weak'; color = 'var(--danger)'; }

  const keywords = Array.from(new Set(ids.flatMap(function (i) { return i.effects; })));
  const tagClass = effect === 'Mixed' ? 'other' : effect.toLowerCase();

  const screenshotBlock = opts.imageUrl
    ? '<img class="analysis-screenshot" src="' + opts.imageUrl + '" alt="Team screenshot">'
    : '';
  const ocrBlock = opts.detectedKeys && opts.detectedKeys.length
    ? '<p class="ocr-detected">OCR roster: ' + ids.map(function (i) { return i.name; }).join(' · ') + '</p>'
    : '';

  panel.innerHTML =
    screenshotBlock +
    '<h4 style="margin-bottom:0.25rem;">Synergy Analysis — <span style="color:' + color + '">' + rating + '</span></h4>' +
    ocrBlock +
    '<div class="score-bar-wrap"><div class="score-label"><span>Effectiveness</span><strong>' + score + '%</strong></div>' +
    '<div class="score-bar"><div class="score-fill" style="width:' + score + '%;background:' + color + '"></div></div></div>' +
    '<div class="status-keywords">' + keywords.map(function (k) {
      return '<span class="tag tag-' + tagClass + '">' + k + '</span>';
    }).join('') + '</div>' +
    '<ul class="analysis-list">' +
    pros.map(function (p) { return '<li class="pro">' + p + '</li>'; }).join('') +
    cons.map(function (c) { return '<li class="con">' + c + '</li>'; }).join('') +
    tips.map(function (t) { return '<li class="tip">' + t + '</li>'; }).join('') +
    '</ul>';

  panel.classList.add('visible');
}

function bindModalEvents() {
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('swap-modal').addEventListener('click', function (e) {
    if (e.target.id === 'swap-modal') closeModal();
  });
  document.querySelectorAll('.modal-tab').forEach(function (btn) {
    btn.addEventListener('click', function () { setModalTab(btn.dataset.tab); });
  });
  document.getElementById('modal-search').addEventListener('input', refreshModalAllGrid);
  const tierSearch = document.getElementById('tierlist-search');
  if (tierSearch) tierSearch.addEventListener('input', renderTierList);
  document.querySelectorAll('.main-nav-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { setPage(btn.dataset.page); });
  });
}

function updateAllIdentitiesTitle() {
  const title = document.getElementById('modal-all-title');
  if (title) title.textContent = 'All identities (' + ALL_POOL_KEYS.length + ')';
}

async function bootApp() {
  window.imgFallback = imgFallback;
  const root = document.getElementById('teams-root');
  root.innerHTML = '<p class="loading-msg">Loading identity database…</p>';

  try {
    await loadGllCatalog();
  } catch (err) {
    console.error(err);
    root.innerHTML = '<p class="loading-msg loading-error">Could not load database. Check your connection and refresh.</p>';
    return;
  }

  initState();
  renderMetaOverview();
  renderTeams();
  updateAllIdentitiesTitle();
  initIconFilterBars();
  bindIconFilterEvents();
  bindModalEvents();
}
