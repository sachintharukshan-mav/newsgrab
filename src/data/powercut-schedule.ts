// Sri Lanka Power Cut Schedule Data & Area Mappings
// Grounded in official PUCSL & CEB Schedule notices (October 19, 20, 21, 2026)

export interface FeederGroupEntry {
  gss: string;
  feeders: string[];
  district: string;
  majorAreas: string[];
}

export interface PowerCutGroup {
  id: number;
  name: string;
  gssList: FeederGroupEntry[];
  description: string;
}

export interface DaySchedule {
  date: string; // YYYY-MM-DD
  dayLabel: string;
  slots: {
    groupId: number;
    start: string; // HH:mm (24h)
    end: string;
    displayTime: string;
  }[];
}

export interface DistrictInfo {
  id: string; // d1 to d25
  name: string;
  sinhalaName: string;
  tamilName: string;
  province: string;
  color: string;
  pathD: string;
  groups: number[]; // which groups operate in this district
  gssNames: string[];
  majorTowns: string[];
  center: { x: number; y: number };
}

export const PROVINCE_COLORS: Record<string, { fill: string; stroke: string; text: string; bgBadge: string }> = {
  'Western': { fill: '#1e242c', stroke: '#333b47', text: '#cbd5e1', bgBadge: 'bg-stone-800 text-stone-200 border-stone-700' },
  'Central': { fill: '#1b2229', stroke: '#303945', text: '#cbd5e1', bgBadge: 'bg-stone-800 text-stone-200 border-stone-700' },
  'Southern': { fill: '#1f252e', stroke: '#353e4b', text: '#cbd5e1', bgBadge: 'bg-stone-800 text-stone-200 border-stone-700' },
  'Northern': { fill: '#1c222a', stroke: '#313a47', text: '#cbd5e1', bgBadge: 'bg-stone-800 text-stone-200 border-stone-700' },
  'Eastern': { fill: '#1d232c', stroke: '#333c48', text: '#cbd5e1', bgBadge: 'bg-stone-800 text-stone-200 border-stone-700' },
  'North Western': { fill: '#1e242d', stroke: '#343d4a', text: '#cbd5e1', bgBadge: 'bg-stone-800 text-stone-200 border-stone-700' },
  'North Central': { fill: '#1a2027', stroke: '#2e3743', text: '#cbd5e1', bgBadge: 'bg-stone-800 text-stone-200 border-stone-700' },
  'Uva': { fill: '#1d232b', stroke: '#323b47', text: '#cbd5e1', bgBadge: 'bg-stone-800 text-stone-200 border-stone-700' },
  'Sabaragamuwa': { fill: '#1f2630', stroke: '#36404f', text: '#cbd5e1', bgBadge: 'bg-stone-800 text-stone-200 border-stone-700' }
};

// Uber Design System Accents (Electric Blue, Slate, Safety Green, Urgent Red)
export const GROUP_COLORS: Record<number, { name: string; fill: string; stroke: string; badge: string; accentBorder: string }> = {
  1: { name: 'Group 01', fill: '#276ef1', stroke: '#1b56c4', badge: 'bg-[#276ef1]/15 text-[#276ef1] dark:text-[#5b94f8] border-[#276ef1]/40', accentBorder: 'border-[#276ef1]' },
  2: { name: 'Group 02', fill: '#0ea5e9', stroke: '#0284c7', badge: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30', accentBorder: 'border-sky-500' },
  3: { name: 'Group 03', fill: '#7c3aed', stroke: '#6d28d9', badge: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30', accentBorder: 'border-purple-500' },
  4: { name: 'Group 04', fill: '#eab308', stroke: '#ca8a04', badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30', accentBorder: 'border-amber-500' }
};

// Expiry Timestamp: 00:00:00 on 22 October 2026 Sri Lanka Time (UTC+5:30)
// 2026-10-22T00:00:00+05:30 is equivalent to 2026-10-21T18:30:00.000Z
export const POWERCUT_EXPIRY_TIMESTAMP = 1792607400000;
export const POWERCUT_EXPIRY_DATE_STR = '2026-10-22T00:00:00+05:30';

export function isPowercutScheduleExpired(customDate?: Date): boolean {
  const time = customDate ? customDate.getTime() : Date.now();
  return time >= POWERCUT_EXPIRY_TIMESTAMP;
}

// Daily Rotational Schedules approved by PUCSL for 1-hour cuts
export const POWER_CUT_SCHEDULES: DaySchedule[] = [
  {
    date: '2026-10-19',
    dayLabel: 'Monday, Oct 19',
    slots: [
      { groupId: 1, start: '16:30', end: '17:30', displayTime: '4:30 PM – 5:30 PM' },
      { groupId: 2, start: '17:30', end: '18:30', displayTime: '5:30 PM – 6:30 PM' },
      { groupId: 3, start: '18:30', end: '19:30', displayTime: '6:30 PM – 7:30 PM' },
      { groupId: 4, start: '19:30', end: '20:30', displayTime: '7:30 PM – 8:30 PM' },
    ]
  },
  {
    date: '2026-10-20',
    dayLabel: 'Tuesday, Oct 20',
    slots: [
      { groupId: 4, start: '16:30', end: '17:30', displayTime: '4:30 PM – 5:30 PM' },
      { groupId: 1, start: '17:30', end: '18:30', displayTime: '5:30 PM – 6:30 PM' },
      { groupId: 2, start: '18:30', end: '19:30', displayTime: '6:30 PM – 7:30 PM' },
      { groupId: 3, start: '19:30', end: '20:30', displayTime: '7:30 PM – 8:30 PM' },
    ]
  },
  {
    date: '2026-10-21',
    dayLabel: 'Wednesday, Oct 21 (Today)',
    slots: [
      { groupId: 3, start: '16:30', end: '17:30', displayTime: '4:30 PM – 5:30 PM' },
      { groupId: 4, start: '17:30', end: '18:30', displayTime: '5:30 PM – 6:30 PM' },
      { groupId: 1, start: '18:30', end: '19:30', displayTime: '6:30 PM – 7:30 PM' },
      { groupId: 2, start: '19:30', end: '20:30', displayTime: '7:30 PM – 8:30 PM' },
    ]
  }
];

// Area mapping metadata: GSS to District & Towns
export const GSS_METADATA: Record<string, { district: string; majorAreas: string[] }> = {
  'Ambalangoda': { district: 'Galle', majorAreas: ['Ambalangoda', 'Hikkaduwa', 'Balapitiya', 'Ahungalla', 'Meetiyagoda'] },
  'Ampara': { district: 'Ampara', majorAreas: ['Ampara Town', 'Uhana', 'Kalmunai', 'Sammanthurai', 'Akkaraipattu', 'Damana'] },
  'Aniyakanda': { district: 'Gampaha', majorAreas: ['Kandana', 'Ragama', 'Mahabage', 'Ja-Ela South', 'Batuwatta'] },
  'Anuradhapura': { district: 'Anuradhapura', majorAreas: ['Anuradhapura Sacred City', 'Mihintale', 'Kekirawa', 'Galenbindunuwewa'] },
  'New Anuradhapura': { district: 'Anuradhapura', majorAreas: ['Anuradhapura New Town', 'Medawachchiya', 'Rambewa', 'Nochchiyagama'] },
  'New_Anuradhapura': { district: 'Anuradhapura', majorAreas: ['Anuradhapura New Town', 'Medawachchiya', 'Rambewa', 'Nochchiyagama'] },
  'Athurugiriya': { district: 'Colombo', majorAreas: ['Athurugiriya', 'Malabe', 'Kaduwela', 'Hokandara', 'Habarakada', 'Oruwala'] },
  'Badulla': { district: 'Badulla', majorAreas: ['Badulla City', 'Bandarawela', 'Hali-Ela', 'Passara', 'Welimada', 'Ella'] },
  'Balangoda': { district: 'Ratnapura', majorAreas: ['Balangoda', 'Opanayake', 'Imbulpe', 'Maratenna'] },
  'Beliatta': { district: 'Hambantota', majorAreas: ['Beliatta', 'Tangalle', 'Walasmulla', 'Weeraketiya'] },
  'Biyagama': { district: 'Gampaha', majorAreas: ['Biyagama', 'Malwana', 'Delgoda', 'Makola', 'Pattiwila'] },
  'Bolawatta': { district: 'Puttalam', majorAreas: ['Wennappuwa', 'Bolawatta', 'Lunuwila', 'Dankotuwa West', 'Waikkal'] },
  'Chilaw': { district: 'Puttalam', majorAreas: ['Chilaw', 'Marawila', 'Madampe', 'Nattandiya', 'Mahawewa'] },
  'Chunnakam': { district: 'Jaffna', majorAreas: ['Jaffna City', 'Chunnakam', 'Nallur', 'Chavakachcheri', 'Point Pedro', 'Kopay'] },
  'Dehiwala': { district: 'Colombo', majorAreas: ['Dehiwala', 'Mount Lavinia', 'Wellawatte', 'Nedimala', 'Kawdana', 'Kohuwala'] },
  'Deniyaya': { district: 'Matara', majorAreas: ['Deniyaya', 'Kotapola', 'Morawaka', 'Pitabeddara'] },
  'Embilipitiya': { district: 'Hambantota', majorAreas: ['Embilipitiya', 'Sooriyawewa', 'Middeniya', 'Katuwana'] },
  'Habarana': { district: 'Polonnaruwa', majorAreas: ['Habarana', 'Hingurakgoda', 'Minneriya', 'Medirigiriya'] },
  'Hambantota': { district: 'Hambantota', majorAreas: ['Hambantota Port/City', 'Ambalantota', 'Mirijjawila', 'Tissamaharama'] },
  'Horana': { district: 'Kalutara', majorAreas: ['Horana', 'Bandaragama', 'Ingiriya', 'Anguruwatota', 'Gonapola'] },
  'Kalutara': { district: 'Kalutara', majorAreas: ['Kalutara North & South', 'Nagoda', 'Katukurunda', 'Payagala', 'Bombuwala'] },
  'Kappalthurai': { district: 'Trincomalee', majorAreas: ['Kappalthurai', 'China Bay', 'Clappenburg', 'Trincomalee Port Area'] },
  'Kappalthure': { district: 'Trincomalee', majorAreas: ['Kappalthurai', 'China Bay', 'Clappenburg', 'Trincomalee Port Area'] },
  'Katunayaka': { district: 'Gampaha', majorAreas: ['Katunayake Airport/EPZ', 'Seeduwa', 'Raddoluwa', 'Awariwatta'] },
  'Kegalla': { district: 'Kegalle', majorAreas: ['Kegalle Town', 'Mawanella', 'Rambukkana', 'Galigamuwa'] },
  'Kegalle': { district: 'Kegalle', majorAreas: ['Kegalle Town', 'Mawanella', 'Rambukkana', 'Galigamuwa'] },
  'Kelaniya': { district: 'Gampaha', majorAreas: ['Kelaniya', 'Peliyagoda', 'Kiribathgoda', 'Dalugama', 'Waragoda'] },
  'Kerawalapitiya': { district: 'Gampaha', majorAreas: ['Wattala', 'Hendala', 'Kerawalapitiya', 'Nayakakanda', 'Elakanda'] },
  'Kesbewa': { district: 'Colombo', majorAreas: ['Kesbewa', 'Piliyandala', 'Kahathuduwa', 'Bokundara', 'Honnanthara'] },
  'Kilinochchi': { district: 'Kilinochchi', majorAreas: ['Kilinochchi Town', 'Paranthan', 'Poonakary', 'Pallai'] },
  'Kiribathkumbura': { district: 'Kandy', majorAreas: ['Kandy City', 'Peradeniya', 'Pilimathalawa', 'Kadugannawa', 'Gelioya'] },
  'Kolonnawa': { district: 'Colombo', majorAreas: ['Kolonnawa', 'Dematagoda', 'Wellampitiya', 'Orugodawatta', 'Sedawatta'] },
  'Kolonnawa GIS': { district: 'Colombo', majorAreas: ['Kolonnawa', 'Grandpass', 'Bloemendhal', 'Orugodawatta'] },
  'Kolonnawa old': { district: 'Colombo', majorAreas: ['Kolonnawa Industrial Zone', 'Sedawatta', 'Wellampitiya'] },
  'Kosgama': { district: 'Colombo', majorAreas: ['Kosgama', 'Hanwella', 'Puwakpitiya', 'Kaluaggala', 'Salawa'] },
  'Kotugoda': { district: 'Gampaha', majorAreas: ['Kotugoda', 'Minuwangoda', 'Ekala', 'Ja-Ela North', 'Raddoluwa'] },
  'Kurunegala': { district: 'Kurunegala', majorAreas: ['Kurunegala City', 'Mawathagama', 'Narammala', 'Wariyapola', 'Mallawapitiya'] },
  'Mahiyanganaya': { district: 'Badulla', majorAreas: ['Mahiyanganaya', 'Dehiattakandiya', 'Girandurukotte', 'Mapakadawewa'] },
  'Maho': { district: 'Kurunegala', majorAreas: ['Maho', 'Polpithigama', 'Yapahuwa', 'Nikaweratiya East'] },
  'Maliboda': { district: 'Kegalle', majorAreas: ['Deraniyagala', 'Maliboda', 'Noori', 'Kithulgala West'] },
  'Mannar': { district: 'Mannar', majorAreas: ['Mannar Island', 'Murunkan', 'Pesalai', 'Thalaimannar'] },
  'Matara': { district: 'Matara', majorAreas: ['Matara City', 'Weligama', 'Dondra', 'Mirissa', 'Dikwella', 'Hakmana'] },
  'Mathugama': { district: 'Kalutara', majorAreas: ['Mathugama', 'Agalawatta', 'Dodangoda', 'Neboda', 'Baduraliya'] },
  'Monaragala': { district: 'Monaragala', majorAreas: ['Monaragala Town', 'Wellawaya', 'Buttala', 'Bibile', 'Kataragama'] },
  'Naula': { district: 'Matale', majorAreas: ['Naula', 'Dambulla', 'Galewela', 'Sigiriya', 'Kandalama'] },
  'Nawalapitiya': { district: 'Kandy', majorAreas: ['Nawalapitiya', 'Gampola', 'Ulapane', 'Kothmale'] },
  'New Galle': { district: 'Galle', majorAreas: ['Galle Fort', 'Galle City', 'Karapitiya', 'Unawatuna', 'Koggala', 'Labuduwa'] },
  'Nuwara_Eliya': { district: 'Nuwara Eliya', majorAreas: ['Nuwara Eliya Town', 'Nanu Oya', 'Hawa Eliya', 'Blackpool'] },
  'Pallekele': { district: 'Kandy', majorAreas: ['Kundasale', 'Digana', 'Menikhinna', 'Teldeniya', 'Pallekele SIIT'] },
  'Panadura': { district: 'Kalutara', majorAreas: ['Panadura City', 'Wadduwa', 'Walana', 'Morontuduwa', 'Bekgegama'] },
  'Pannala': { district: 'Kurunegala', majorAreas: ['Pannala', 'Giriulla', 'Kuliyapitiya', 'Dankotuwa East'] },
  'Pannipitiya': { district: 'Colombo', majorAreas: ['Pannipitiya', 'Maharagama', 'Kottawa', 'Homagama', 'Rukmalgama', 'Godagama'] },
  'Polonnaruwa': { district: 'Polonnaruwa', majorAreas: ['Polonnaruwa City', 'Kaduruwela', 'Thamankaduwa', 'Bakamuna'] },
  'Puttalam': { district: 'Puttalam', majorAreas: ['Puttalam Town', 'Kalpitiya', 'Anamaduwa', 'Palanawi', 'Vanathavillu'] },
  'Ragala': { district: 'Nuwara Eliya', majorAreas: ['Ragala', 'Walapane', 'Kandapola', 'Halgranoya'] },
  'Ratmalana': { district: 'Colombo', majorAreas: ['Ratmalana', 'Moratuwa', 'Attidiya', 'Katubedda', 'Soysapura', 'Borupana'] },
  'Ratnapura': { district: 'Ratnapura', majorAreas: ['Ratnapura City', 'Pelmadulla', 'Kuruwita', 'Nivithigala', 'Kahawatta'] },
  'Sapugaskanda': { district: 'Gampaha', majorAreas: ['Sapugaskanda', 'Gonawala', 'Heiyanthuduwa', 'Makola South'] },
  'Seethawaka': { district: 'Colombo', majorAreas: ['Avissawella', 'Seethawaka EPZ', 'Puwakpitiya East', 'Ruwanwella Border'] },
  'Sri_Jpura': { district: 'Colombo', majorAreas: ['Sri Jayawardenepura Kotte', 'Battaramulla', 'Rajagiriya', 'Thalawathugoda', 'Pelawatte', 'Madiwela'] },
  'SUB A': { district: 'Colombo', majorAreas: ['Colombo Fort', 'Slave Island', 'Galle Face', 'Pettah Inner'] },
  'SUB C': { district: 'Colombo', majorAreas: ['Kollupitiya', 'Bambalapitiya', 'Cinnamon Gardens (Colombo 07)', 'Havelock Town'] },
  'SUB I': { district: 'Colombo', majorAreas: ['Maradana', 'Panchikawatte', 'Maligawatta', 'Kotahena', 'Colombo 10/12'] },
  'Sub M': { district: 'Colombo', majorAreas: ['Borella', 'Narahenpita', 'Kirulapone', 'Thimbirigasyaya'] },
  'Sub N': { district: 'Colombo', majorAreas: ['Mattakkuliya', 'Modara', 'Crow Island', 'Mutwal (Colombo 15)'] },
  'Thulhiriya': { district: 'Kegalle', majorAreas: ['Thulhiriya', 'Warakapola', 'Ambepussa', 'Alawwa Border'] },
  'Trincomalee': { district: 'Trincomalee', majorAreas: ['Trincomalee Town', 'Kinniya', 'Muttur', 'Kantale', 'Nilaveli'] },
  'Ukuwela': { district: 'Matale', majorAreas: ['Matale Town', 'Ukuwela', 'Rattota', 'Palapathwela'] },
  'Valachchenai': { district: 'Batticaloa', majorAreas: ['Valachchenai', 'Pasikudah', 'Kalkudah', 'Oddamavadi', 'Vakarai'] },
  'Vavunathivu': { district: 'Batticaloa', majorAreas: ['Batticaloa City', 'Kattankudy', 'Eravur', 'Chenkalady', 'Vavunathivu'] },
  'Vavuniya': { district: 'Vavuniya', majorAreas: ['Vavuniya Town', 'Cheddikulam', 'Nedunkeni', 'Omanthai'] },
  'Veyangoda': { district: 'Gampaha', majorAreas: ['Veyangoda', 'Nittambuwa', 'Mirigama', 'Pasyala', 'Weweldeniya'] },
  'Wewelwatta': { district: 'Ratnapura', majorAreas: ['Wewelwatta', 'Balangoda Highland', 'Alupola'] },
  'Wimalasurendra': { district: 'Nuwara Eliya', majorAreas: ['Norton Bridge', 'Laxapana', 'Maskeliya', 'Hatton', 'Ginigathena'] }
};

// Official Groups (01, 02, 03, 04) structured from the attached OCR PDFs
export const POWER_CUT_GROUPS: PowerCutGroup[] = [
  {
    id: 1,
    name: 'Group 01',
    description: 'Western South, Sabaragamuwa, Central & Southern Grid Feeders',
    gssList: [
      { gss: 'Ambalangoda', feeders: ['1', '2', '3', '5'], district: 'Galle', majorAreas: GSS_METADATA['Ambalangoda'].majorAreas },
      { gss: 'Athurugiriya', feeders: ['1', '2', '3', '4', '6'], district: 'Colombo', majorAreas: GSS_METADATA['Athurugiriya'].majorAreas },
      { gss: 'Balangoda', feeders: ['2', '3', '4', '5', '6', '7', '8', '10'], district: 'Ratnapura', majorAreas: GSS_METADATA['Balangoda'].majorAreas },
      { gss: 'Beliatta', feeders: ['2', '3'], district: 'Hambantota', majorAreas: GSS_METADATA['Beliatta'].majorAreas },
      { gss: 'Deniyaya', feeders: ['1'], district: 'Matara', majorAreas: GSS_METADATA['Deniyaya'].majorAreas },
      { gss: 'Embilipitiya', feeders: ['5', '7', '8'], district: 'Hambantota', majorAreas: GSS_METADATA['Embilipitiya'].majorAreas },
      { gss: 'Habarana', feeders: ['1', '6'], district: 'Polonnaruwa', majorAreas: GSS_METADATA['Habarana'].majorAreas },
      { gss: 'Hambantota', feeders: ['5', '11'], district: 'Hambantota', majorAreas: GSS_METADATA['Hambantota'].majorAreas },
      { gss: 'Horana', feeders: ['2', '3', '12'], district: 'Kalutara', majorAreas: GSS_METADATA['Horana'].majorAreas },
      { gss: 'Kalutara', feeders: ['3', '6', '7'], district: 'Kalutara', majorAreas: GSS_METADATA['Kalutara'].majorAreas },
      { gss: 'Kegalle', feeders: ['2', '4', '7'], district: 'Kegalle', majorAreas: GSS_METADATA['Kegalle'].majorAreas },
      { gss: 'Kesbewa', feeders: ['1'], district: 'Colombo', majorAreas: GSS_METADATA['Kesbewa'].majorAreas },
      { gss: 'Kiribathkumbura', feeders: ['2', '4', '6', '7', '9', '11'], district: 'Kandy', majorAreas: GSS_METADATA['Kiribathkumbura'].majorAreas },
      { gss: 'Kosgama', feeders: ['2', '3', '6'], district: 'Colombo', majorAreas: GSS_METADATA['Kosgama'].majorAreas },
      { gss: 'Kurunegala', feeders: ['2', '8', '10'], district: 'Kurunegala', majorAreas: GSS_METADATA['Kurunegala'].majorAreas },
      { gss: 'Maliboda', feeders: ['2'], district: 'Kegalle', majorAreas: GSS_METADATA['Maliboda'].majorAreas },
      { gss: 'Matara', feeders: ['2', '3', '7', '8', '10', '11'], district: 'Matara', majorAreas: GSS_METADATA['Matara'].majorAreas },
      { gss: 'Mathugama', feeders: ['2', '3', '6', '7'], district: 'Kalutara', majorAreas: GSS_METADATA['Mathugama'].majorAreas },
      { gss: 'Naula', feeders: ['2', '3', '7'], district: 'Matale', majorAreas: GSS_METADATA['Naula'].majorAreas },
      { gss: 'Nawalapitiya', feeders: ['1', '6', '7', '8'], district: 'Kandy', majorAreas: GSS_METADATA['Nawalapitiya'].majorAreas },
      { gss: 'New Galle', feeders: ['1', '3', '8', '11'], district: 'Galle', majorAreas: GSS_METADATA['New Galle'].majorAreas },
      { gss: 'Pallekele', feeders: ['1', '10'], district: 'Kandy', majorAreas: GSS_METADATA['Pallekele'].majorAreas },
      { gss: 'Panadura', feeders: ['1', '2', '8', '9'], district: 'Kalutara', majorAreas: GSS_METADATA['Panadura'].majorAreas },
      { gss: 'Polonnaruwa', feeders: ['1'], district: 'Polonnaruwa', majorAreas: GSS_METADATA['Polonnaruwa'].majorAreas },
      { gss: 'Ragala', feeders: ['8'], district: 'Nuwara Eliya', majorAreas: GSS_METADATA['Ragala'].majorAreas },
      { gss: 'Ratnapura', feeders: ['1', '3', '4', '6', '8'], district: 'Ratnapura', majorAreas: GSS_METADATA['Ratnapura'].majorAreas },
      { gss: 'Seethawaka', feeders: ['1', '5'], district: 'Colombo', majorAreas: GSS_METADATA['Seethawaka'].majorAreas },
      { gss: 'Thulhiriya', feeders: ['5', '6'], district: 'Kegalle', majorAreas: GSS_METADATA['Thulhiriya'].majorAreas },
      { gss: 'Ukuwela', feeders: ['1', '2', '5', '9'], district: 'Matale', majorAreas: GSS_METADATA['Ukuwela'].majorAreas },
      { gss: 'Valachchenai', feeders: ['2', '4'], district: 'Batticaloa', majorAreas: GSS_METADATA['Valachchenai'].majorAreas },
      { gss: 'Wewelwatta', feeders: ['1', '2', '5', '6', '7'], district: 'Ratnapura', majorAreas: GSS_METADATA['Wewelwatta'].majorAreas },
      { gss: 'Wimalasurendra', feeders: ['4', '6', '7'], district: 'Nuwara Eliya', majorAreas: GSS_METADATA['Wimalasurendra'].majorAreas }
    ]
  },
  {
    id: 2,
    name: 'Group 02',
    description: 'Colombo Metro North, Gampaha, Northern, North Central & Eastern Feeders',
    gssList: [
      { gss: 'Ampara', feeders: ['1', '2', '6', '7', '8', '9'], district: 'Ampara', majorAreas: GSS_METADATA['Ampara'].majorAreas },
      { gss: 'Aniyakanda', feeders: ['3', '4', '6', '7'], district: 'Gampaha', majorAreas: GSS_METADATA['Aniyakanda'].majorAreas },
      { gss: 'Anuradhapura', feeders: ['1', '2', '9'], district: 'Anuradhapura', majorAreas: GSS_METADATA['Anuradhapura'].majorAreas },
      { gss: 'Badulla', feeders: ['1', '3', '4', '6'], district: 'Badulla', majorAreas: GSS_METADATA['Badulla'].majorAreas },
      { gss: 'Biyagama', feeders: ['7', '12', '14'], district: 'Gampaha', majorAreas: GSS_METADATA['Biyagama'].majorAreas },
      { gss: 'Bolawatta', feeders: ['4', '5', '7'], district: 'Puttalam', majorAreas: GSS_METADATA['Bolawatta'].majorAreas },
      { gss: 'Chilaw', feeders: ['3', '12'], district: 'Puttalam', majorAreas: GSS_METADATA['Chilaw'].majorAreas },
      { gss: 'Chunnakam', feeders: ['12'], district: 'Jaffna', majorAreas: GSS_METADATA['Chunnakam'].majorAreas },
      { gss: 'Dehiwala', feeders: ['3'], district: 'Colombo', majorAreas: GSS_METADATA['Dehiwala'].majorAreas },
      { gss: 'Kappalthurai', feeders: ['3'], district: 'Trincomalee', majorAreas: GSS_METADATA['Kappalthurai'].majorAreas },
      { gss: 'Katunayaka', feeders: ['1'], district: 'Gampaha', majorAreas: GSS_METADATA['Katunayaka'].majorAreas },
      { gss: 'Kelaniya', feeders: ['2', '5'], district: 'Gampaha', majorAreas: GSS_METADATA['Kelaniya'].majorAreas },
      { gss: 'Kerawalapitiya', feeders: ['1', '2'], district: 'Gampaha', majorAreas: GSS_METADATA['Kerawalapitiya'].majorAreas },
      { gss: 'Kilinochchi', feeders: ['3', '6', '8'], district: 'Kilinochchi', majorAreas: GSS_METADATA['Kilinochchi'].majorAreas },
      { gss: 'Kolonnawa', feeders: ['17', '18'], district: 'Colombo', majorAreas: GSS_METADATA['Kolonnawa'].majorAreas },
      { gss: 'Kolonnawa old', feeders: ['8'], district: 'Colombo', majorAreas: GSS_METADATA['Kolonnawa old'].majorAreas },
      { gss: 'Kotugoda', feeders: ['6', '9', '10', '11', '12', '13'], district: 'Gampaha', majorAreas: GSS_METADATA['Kotugoda'].majorAreas },
      { gss: 'Mahiyanganaya', feeders: ['2', '8'], district: 'Badulla', majorAreas: GSS_METADATA['Mahiyanganaya'].majorAreas },
      { gss: 'Maho', feeders: ['1', '3'], district: 'Kurunegala', majorAreas: GSS_METADATA['Maho'].majorAreas },
      { gss: 'Mannar', feeders: ['1'], district: 'Mannar', majorAreas: GSS_METADATA['Mannar'].majorAreas },
      { gss: 'New Anuradhapura', feeders: ['4', '6'], district: 'Anuradhapura', majorAreas: GSS_METADATA['New Anuradhapura'].majorAreas },
      { gss: 'Nuwara_Eliya', feeders: ['1', '3'], district: 'Nuwara Eliya', majorAreas: GSS_METADATA['Nuwara_Eliya'].majorAreas },
      { gss: 'Pannala', feeders: ['4', '5'], district: 'Kurunegala', majorAreas: GSS_METADATA['Pannala'].majorAreas },
      { gss: 'Pannipitiya', feeders: ['1', '2', '9'], district: 'Colombo', majorAreas: GSS_METADATA['Pannipitiya'].majorAreas },
      { gss: 'Puttalam', feeders: ['4', '7'], district: 'Puttalam', majorAreas: GSS_METADATA['Puttalam'].majorAreas },
      { gss: 'Ratmalana', feeders: ['2', '7', '9'], district: 'Colombo', majorAreas: GSS_METADATA['Ratmalana'].majorAreas },
      { gss: 'Sapugaskanda', feeders: ['0', '3', '4', '9'], district: 'Gampaha', majorAreas: GSS_METADATA['Sapugaskanda'].majorAreas },
      { gss: 'Sri_Jpura', feeders: ['2', '3', '9'], district: 'Colombo', majorAreas: GSS_METADATA['Sri_Jpura'].majorAreas },
      { gss: 'SUB A', feeders: ['A-5'], district: 'Colombo', majorAreas: GSS_METADATA['SUB A'].majorAreas },
      { gss: 'SUB C', feeders: ['C-1', 'C-3', 'C-4'], district: 'Colombo', majorAreas: GSS_METADATA['SUB C'].majorAreas },
      { gss: 'SUB I', feeders: ['I-5', 'I-7'], district: 'Colombo', majorAreas: GSS_METADATA['SUB I'].majorAreas },
      { gss: 'Trincomalee', feeders: ['1', '2'], district: 'Trincomalee', majorAreas: GSS_METADATA['Trincomalee'].majorAreas },
      { gss: 'Vavunathivu', feeders: ['7'], district: 'Batticaloa', majorAreas: GSS_METADATA['Vavunathivu'].majorAreas },
      { gss: 'Vavuniya', feeders: ['1', '3', '6'], district: 'Vavuniya', majorAreas: GSS_METADATA['Vavuniya'].majorAreas },
      { gss: 'Veyangoda', feeders: ['6', '10'], district: 'Gampaha', majorAreas: GSS_METADATA['Veyangoda'].majorAreas }
    ]
  },
  {
    id: 3,
    name: 'Group 03',
    description: 'Colombo Suburbs, Jaffna Peninsula, East Coast & North Western Grid Feeders',
    gssList: [
      { gss: 'Ampara', feeders: ['3', '4', '5', '10'], district: 'Ampara', majorAreas: GSS_METADATA['Ampara'].majorAreas },
      { gss: 'Aniyakanda', feeders: ['1', '5'], district: 'Gampaha', majorAreas: GSS_METADATA['Aniyakanda'].majorAreas },
      { gss: 'Anuradhapura', feeders: ['6', '7', '8'], district: 'Anuradhapura', majorAreas: GSS_METADATA['Anuradhapura'].majorAreas },
      { gss: 'Badulla', feeders: ['5', '7', '8'], district: 'Badulla', majorAreas: GSS_METADATA['Badulla'].majorAreas },
      { gss: 'Biyagama', feeders: ['10', '11'], district: 'Gampaha', majorAreas: GSS_METADATA['Biyagama'].majorAreas },
      { gss: 'Bolawatta', feeders: ['2', '3', '8', '10'], district: 'Puttalam', majorAreas: GSS_METADATA['Bolawatta'].majorAreas },
      { gss: 'Chilaw', feeders: ['2', '5', '8', '9'], district: 'Puttalam', majorAreas: GSS_METADATA['Chilaw'].majorAreas },
      { gss: 'Chunnakam', feeders: ['6', '7', '8', '9', '10', '11'], district: 'Jaffna', majorAreas: GSS_METADATA['Chunnakam'].majorAreas },
      { gss: 'Dehiwala', feeders: ['6', '7', '8'], district: 'Colombo', majorAreas: GSS_METADATA['Dehiwala'].majorAreas },
      { gss: 'Kappalthurai', feeders: ['4'], district: 'Trincomalee', majorAreas: GSS_METADATA['Kappalthurai'].majorAreas },
      { gss: 'Kelaniya', feeders: ['1', '3', '4'], district: 'Gampaha', majorAreas: GSS_METADATA['Kelaniya'].majorAreas },
      { gss: 'Kerawalapitiya', feeders: ['8'], district: 'Gampaha', majorAreas: GSS_METADATA['Kerawalapitiya'].majorAreas },
      { gss: 'Kilinochchi', feeders: ['1', '2', '4'], district: 'Kilinochchi', majorAreas: GSS_METADATA['Kilinochchi'].majorAreas },
      { gss: 'Kolonnawa GIS', feeders: ['6'], district: 'Colombo', majorAreas: GSS_METADATA['Kolonnawa GIS'].majorAreas },
      { gss: 'Kotugoda', feeders: ['1', '3', '8'], district: 'Gampaha', majorAreas: GSS_METADATA['Kotugoda'].majorAreas },
      { gss: 'Mahiyanganaya', feeders: ['1', '3', '4', '6', '7'], district: 'Badulla', majorAreas: GSS_METADATA['Mahiyanganaya'].majorAreas },
      { gss: 'Maho', feeders: ['5', '6', '8'], district: 'Kurunegala', majorAreas: GSS_METADATA['Maho'].majorAreas },
      { gss: 'Mannar', feeders: ['2', '4'], district: 'Mannar', majorAreas: GSS_METADATA['Mannar'].majorAreas },
      { gss: 'Monaragala', feeders: ['1', '8'], district: 'Monaragala', majorAreas: GSS_METADATA['Monaragala'].majorAreas },
      { gss: 'New Anuradhapura', feeders: ['5', '7'], district: 'Anuradhapura', majorAreas: GSS_METADATA['New Anuradhapura'].majorAreas },
      { gss: 'Nuwara_Eliya', feeders: ['2', '8'], district: 'Nuwara Eliya', majorAreas: GSS_METADATA['Nuwara_Eliya'].majorAreas },
      { gss: 'Pannala', feeders: ['2'], district: 'Kurunegala', majorAreas: GSS_METADATA['Pannala'].majorAreas },
      { gss: 'Pannipitiya', feeders: ['8', '12'], district: 'Colombo', majorAreas: GSS_METADATA['Pannipitiya'].majorAreas },
      { gss: 'Ratmalana', feeders: ['3', '4', '5'], district: 'Colombo', majorAreas: GSS_METADATA['Ratmalana'].majorAreas },
      { gss: 'Sapugaskanda', feeders: ['7', '8', '11'], district: 'Gampaha', majorAreas: GSS_METADATA['Sapugaskanda'].majorAreas },
      { gss: 'Sri_Jpura', feeders: ['1', '4', '8'], district: 'Colombo', majorAreas: GSS_METADATA['Sri_Jpura'].majorAreas },
      { gss: 'SUB C', feeders: ['C-09', 'C-10', 'C-15'], district: 'Colombo', majorAreas: GSS_METADATA['SUB C'].majorAreas },
      { gss: 'SUB I', feeders: ['I-1', 'I-8', 'I-11', 'I-13', 'I-15', 'I-17'], district: 'Colombo', majorAreas: GSS_METADATA['SUB I'].majorAreas },
      { gss: 'Sub M', feeders: ['M-2', 'M-13'], district: 'Colombo', majorAreas: GSS_METADATA['Sub M'].majorAreas },
      { gss: 'Sub N', feeders: ['N-8', 'N-9', 'N-10', 'N-18'], district: 'Colombo', majorAreas: GSS_METADATA['Sub N'].majorAreas },
      { gss: 'Trincomalee', feeders: ['3', '5', '6'], district: 'Trincomalee', majorAreas: GSS_METADATA['Trincomalee'].majorAreas },
      { gss: 'Vavunathivu', feeders: ['1', '2', '5'], district: 'Batticaloa', majorAreas: GSS_METADATA['Vavunathivu'].majorAreas },
      { gss: 'Vavuniya', feeders: ['2', '4', '5'], district: 'Vavuniya', majorAreas: GSS_METADATA['Vavuniya'].majorAreas },
      { gss: 'Veyangoda', feeders: ['3', '4', '5', '7', '8'], district: 'Gampaha', majorAreas: GSS_METADATA['Veyangoda'].majorAreas }
    ]
  },
  {
    id: 4,
    name: 'Group 04',
    description: 'Southern Province, Kandy Hill Country, Kalutara & Sabaragamuwa Grid Feeders',
    gssList: [
      { gss: 'Ambalangoda', feeders: ['6', '7 (G1)', 'G2'], district: 'Galle', majorAreas: GSS_METADATA['Ambalangoda'].majorAreas },
      { gss: 'Athurugiriya', feeders: ['5'], district: 'Colombo', majorAreas: GSS_METADATA['Athurugiriya'].majorAreas },
      { gss: 'Balangoda', feeders: ['1'], district: 'Ratnapura', majorAreas: GSS_METADATA['Balangoda'].majorAreas },
      { gss: 'Beliatta', feeders: ['1', '4', '5', '6', '7', '8'], district: 'Hambantota', majorAreas: GSS_METADATA['Beliatta'].majorAreas },
      { gss: 'Deniyaya', feeders: ['3', '4', 'G1', 'G2'], district: 'Matara', majorAreas: GSS_METADATA['Deniyaya'].majorAreas },
      { gss: 'Embilipitiya', feeders: ['1', '4', '6'], district: 'Hambantota', majorAreas: GSS_METADATA['Embilipitiya'].majorAreas },
      { gss: 'Habarana', feeders: ['3', '5', '7'], district: 'Polonnaruwa', majorAreas: GSS_METADATA['Habarana'].majorAreas },
      { gss: 'Hambantota', feeders: ['4', '6', '8'], district: 'Hambantota', majorAreas: GSS_METADATA['Hambantota'].majorAreas },
      { gss: 'Horana', feeders: ['7'], district: 'Kalutara', majorAreas: GSS_METADATA['Horana'].majorAreas },
      { gss: 'Kalutara', feeders: ['4', '5', '8'], district: 'Kalutara', majorAreas: GSS_METADATA['Kalutara'].majorAreas },
      { gss: 'Kegalle', feeders: ['1', '6', '8'], district: 'Kegalle', majorAreas: GSS_METADATA['Kegalle'].majorAreas },
      { gss: 'Kesbewa', feeders: ['3'], district: 'Colombo', majorAreas: GSS_METADATA['Kesbewa'].majorAreas },
      { gss: 'Kiribathkumbura', feeders: ['1', '3', '5', '8', '12'], district: 'Kandy', majorAreas: GSS_METADATA['Kiribathkumbura'].majorAreas },
      { gss: 'Kosgama', feeders: ['1', '5', '8'], district: 'Colombo', majorAreas: GSS_METADATA['Kosgama'].majorAreas },
      { gss: 'Kurunegala', feeders: ['3', '4', '5', '11'], district: 'Kurunegala', majorAreas: GSS_METADATA['Kurunegala'].majorAreas },
      { gss: 'Matara', feeders: ['4', '6', '9', '12'], district: 'Matara', majorAreas: GSS_METADATA['Matara'].majorAreas },
      { gss: 'Mathugama', feeders: ['5', '8', '10'], district: 'Kalutara', majorAreas: GSS_METADATA['Mathugama'].majorAreas },
      { gss: 'Naula', feeders: ['6'], district: 'Matale', majorAreas: GSS_METADATA['Naula'].majorAreas },
      { gss: 'Nawalapitiya', feeders: ['2', '5'], district: 'Kandy', majorAreas: GSS_METADATA['Nawalapitiya'].majorAreas },
      { gss: 'New Galle', feeders: ['2', '5', '6', '7', '9'], district: 'Galle', majorAreas: GSS_METADATA['New Galle'].majorAreas },
      { gss: 'Pallekele', feeders: ['9', '11'], district: 'Kandy', majorAreas: GSS_METADATA['Pallekele'].majorAreas },
      { gss: 'Panadura', feeders: ['3', '6', '7'], district: 'Kalutara', majorAreas: GSS_METADATA['Panadura'].majorAreas },
      { gss: 'Polonnaruwa', feeders: ['4', '8'], district: 'Polonnaruwa', majorAreas: GSS_METADATA['Polonnaruwa'].majorAreas },
      { gss: 'Ragala', feeders: ['1', '2'], district: 'Nuwara Eliya', majorAreas: GSS_METADATA['Ragala'].majorAreas },
      { gss: 'Ratnapura', feeders: ['2', '5', '7'], district: 'Ratnapura', majorAreas: GSS_METADATA['Ratnapura'].majorAreas },
      { gss: 'Seethawaka', feeders: ['8'], district: 'Colombo', majorAreas: GSS_METADATA['Seethawaka'].majorAreas },
      { gss: 'Thulhiriya', feeders: ['2', '3', '4', '8', '9'], district: 'Kegalle', majorAreas: GSS_METADATA['Thulhiriya'].majorAreas },
      { gss: 'Ukuwela', feeders: ['3', '4', '6', '8', '11', '12'], district: 'Matale', majorAreas: GSS_METADATA['Ukuwela'].majorAreas },
      { gss: 'Valachchenai', feeders: ['1', '5'], district: 'Batticaloa', majorAreas: GSS_METADATA['Valachchenai'].majorAreas },
      { gss: 'Wimalasurendra', feeders: ['5'], district: 'Nuwara Eliya', majorAreas: GSS_METADATA['Wimalasurendra'].majorAreas }
    ]
  }
];

// Import all 25 districts with exact SVG paths and visual center markers
import { RAW_DISTRICTS } from './sri-lanka-districts';

const DISTRICT_NAMES: Record<string, { en: string; si: string; ta: string; province: string; center: { x: number; y: number } }> = {
  'd1': { en: 'Colombo', si: 'කොළඹ', ta: 'கொழும்பு', province: 'Western', center: { x: 70, y: 580 } },
  'd2': { en: 'Gampaha', si: 'ගම්පහ', ta: 'கம்பஹா', province: 'Western', center: { x: 80, y: 510 } },
  'd3': { en: 'Kalutara', si: 'කළුතර', ta: 'களுத்துறை', province: 'Western', center: { x: 85, y: 645 } },
  'd4': { en: 'Kandy', si: 'මහනුවර', ta: 'கண்டி', province: 'Central', center: { x: 195, y: 485 } },
  'd5': { en: 'Matale', si: 'මාතලේ', ta: 'மாத்தளை', province: 'Central', center: { x: 215, y: 400 } },
  'd6': { en: 'Nuwara Eliya', si: 'නුවරඑළිය', ta: 'நுவரெலியா', province: 'Central', center: { x: 205, y: 575 } },
  'd7': { en: 'Galle', si: 'ගාල්ල', ta: 'காலி', province: 'Southern', center: { x: 110, y: 720 } },
  'd8': { en: 'Matara', si: 'මාතර', ta: 'மாத்தறை', province: 'Southern', center: { x: 175, y: 735 } },
  'd9': { en: 'Hambantota', si: 'හම්බන්තොට', ta: 'அம்பாந்தோட்டை', province: 'Southern', center: { x: 275, y: 710 } },
  'd10': { en: 'Jaffna', si: 'යාපනය', ta: 'யாழ்ப்பாணம்', province: 'Northern', center: { x: 130, y: 70 } },
  'd11': { en: 'Kilinochchi', si: 'කිලිනොච්චිය', ta: 'கிளிநொச்சி', province: 'Northern', center: { x: 160, y: 135 } },
  'd12': { en: 'Mannar', si: 'මන්නාරම', ta: 'மன்னார்', province: 'Northern', center: { x: 105, y: 220 } },
  'd13': { en: 'Vavuniya', si: 'වවුනියාව', ta: 'வவுனியா', province: 'Northern', center: { x: 195, y: 225 } },
  'd14': { en: 'Mullaitivu', si: 'මුලතිව්', ta: 'முல்லைத்தீவு', province: 'Northern', center: { x: 235, y: 155 } },
  'd15': { en: 'Batticaloa', si: 'මඩකලපුව', ta: 'மட்டக்களப்பு', province: 'Eastern', center: { x: 360, y: 430 } },
  'd16': { en: 'Ampara', si: 'අම්පාර', ta: 'அம்பாறை', province: 'Eastern', center: { x: 350, y: 535 } },
  'd17': { en: 'Trincomalee', si: 'ත්‍රිකුණාමලය', ta: 'திருகோணமலை', province: 'Eastern', center: { x: 285, y: 255 } },
  'd18': { en: 'Kurunegala', si: 'කුරුණෑගල', ta: 'குருணாகல்', province: 'North Western', center: { x: 125, y: 430 } },
  'd19': { en: 'Puttalam', si: 'පුත්තලම', ta: 'புத்தளம்', province: 'North Western', center: { x: 65, y: 350 } },
  'd20': { en: 'Anuradhapura', si: 'අනුරාධපුරය', ta: 'அනුராதபுரம்', province: 'North Central', center: { x: 170, y: 290 } },
  'd21': { en: 'Polonnaruwa', si: 'පොළොන්නරුව', ta: 'பொலன்னறுவை', province: 'North Central', center: { x: 275, y: 355 } },
  'd22': { en: 'Badulla', si: 'බදුල්ල', ta: 'பதுளை', province: 'Uva', center: { x: 280, y: 535 } },
  'd23': { en: 'Monaragala', si: 'මොණරාගල', ta: 'மொணராகலை', province: 'Uva', center: { x: 310, y: 615 } },
  'd24': { en: 'Ratnapura', si: 'රත්නපුර', ta: 'இரத்தினபுரி', province: 'Sabaragamuwa', center: { x: 170, y: 640 } },
  'd25': { en: 'Kegalle', si: 'කෑගල්ල', ta: 'கேகாலை', province: 'Sabaragamuwa', center: { x: 135, y: 525 } }
};

// Compile fully typed districts
export const SRI_LANKA_DISTRICTS: DistrictInfo[] = RAW_DISTRICTS.map(p => {
  const meta = DISTRICT_NAMES[p.id] || { en: p.title, si: p.title, ta: p.title, province: 'Western', center: { x: 200, y: 400 } };
  
  // Find which groups and GSS exist in this district
  const gssSet = new Set<string>();
  const groupSet = new Set<number>();
  const townSet = new Set<string>();

  POWER_CUT_GROUPS.forEach(g => {
    g.gssList.forEach(entry => {
      if (entry.district.toLowerCase() === meta.en.toLowerCase() || 
         (meta.en === 'Kandy' && entry.district === 'Kandy') ||
         (meta.en === 'Kalutara' && entry.district === 'Kalutara')) {
        gssSet.add(entry.gss);
        groupSet.add(g.id);
        entry.majorAreas.forEach(area => townSet.add(area));
      }
    });
  });

  // Fallback for districts serviced by neighbouring grid tie-ins (e.g. Mullaitivu)
  if (groupSet.size === 0) {
    if (meta.en === 'Mullaitivu') {
      groupSet.add(2);
      groupSet.add(3);
      gssSet.add('Kilinochchi / Vavuniya Grid Feeders');
      townSet.add('Mullaitivu Town');
      townSet.add('Puthukkudiyiruppu');
      townSet.add('Mankulam');
    }
  }

  return {
    id: p.id,
    name: meta.en,
    sinhalaName: meta.si,
    tamilName: meta.ta,
    province: meta.province,
    color: PROVINCE_COLORS[meta.province]?.fill || '#38bdf8',
    pathD: p.pathD,
    groups: Array.from(groupSet).sort((a, b) => a - b),
    gssNames: Array.from(gssSet),
    majorTowns: Array.from(townSet),
    center: meta.center
  };
});

// Helper: Calculate active or next power cut based on current Sri Lanka Time
export interface RealtimeCutStatus {
  nowSriLanka: Date;
  dateStr: string;
  formattedTime: string;
  formattedDate: string;
  activeGroup: PowerCutGroup | null;
  activeSlot: { start: string; end: string; displayTime: string } | null;
  nextGroup: PowerCutGroup | null;
  nextSlot: { start: string; end: string; displayTime: string } | null;
  minutesUntilNext: number | null;
  minutesRemainingInActive: number | null;
  isScheduleDay: boolean;
  isExpired: boolean;
}

export function getRealtimeCutStatus(customDate?: Date): RealtimeCutStatus {
  const now = customDate || new Date();
  const isExpired = isPowercutScheduleExpired(now);

  // Robust, standard Asia/Colombo timezone resolution with explicit 00-23 cycle
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Colombo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23'
  }).formatToParts(now);

  const partMap: Record<string, string> = {};
  parts.forEach(p => {
    partMap[p.type] = p.value;
  });

  const year = partMap.year || '2026';
  const month = partMap.month || '10';
  const day = partMap.day || '21';
  const dateStr = `${year}-${month}-${day}`;

  const rawHour = parseInt(partMap.hour || '0', 10);
  const hour = rawHour === 24 ? 0 : rawHour;
  const minute = parseInt(partMap.minute || '0', 10);
  const currentMinutes = hour * 60 + minute;

  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  const displayMin = String(minute).padStart(2, '0');
  const formattedTime = `${displayHour}:${displayMin} ${ampm}`;

  // Formatted date string for Sri Lanka
  const dateParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Colombo',
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(now);

  const scheduleForToday = POWER_CUT_SCHEDULES.find(s => s.date === dateStr);

  if (!scheduleForToday) {
    return {
      nowSriLanka: now,
      dateStr,
      formattedTime,
      formattedDate: dateParts,
      activeGroup: null,
      activeSlot: null,
      nextGroup: null,
      nextSlot: null,
      minutesUntilNext: null,
      minutesRemainingInActive: null,
      isScheduleDay: false,
      isExpired
    };
  }

  let activeGroup: PowerCutGroup | null = null;
  let activeSlot: { start: string; end: string; displayTime: string } | null = null;
  let nextGroup: PowerCutGroup | null = null;
  let nextSlot: { start: string; end: string; displayTime: string } | null = null;
  let minutesUntilNext: number | null = null;
  let minutesRemainingInActive: number | null = null;

  for (const slot of scheduleForToday.slots) {
    const [startH, startM] = slot.start.split(':').map(Number);
    const [endH, endM] = slot.end.split(':').map(Number);
    const startMin = startH * 60 + startM;
    const endMin = endH * 60 + endM;

    if (currentMinutes >= startMin && currentMinutes < endMin) {
      activeGroup = POWER_CUT_GROUPS.find(g => g.id === slot.groupId) || null;
      activeSlot = slot;
      minutesRemainingInActive = endMin - currentMinutes;
      break;
    } else if (currentMinutes < startMin) {
      if (!nextGroup) {
        nextGroup = POWER_CUT_GROUPS.find(g => g.id === slot.groupId) || null;
        nextSlot = slot;
        minutesUntilNext = startMin - currentMinutes;
      }
    }
  }

  return {
    nowSriLanka: now,
    dateStr,
    formattedTime,
    formattedDate: dateParts,
    activeGroup,
    activeSlot,
    nextGroup,
    nextSlot,
    minutesUntilNext,
    minutesRemainingInActive,
    isScheduleDay: true,
    isExpired
  };
}
