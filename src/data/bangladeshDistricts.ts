export interface DivisionData {
  division: string;
  districts: string[];
}

export const BANGLADESH_DIVISIONS: DivisionData[] = [
  {
    division: 'Dhaka',
    districts: [
      'Dhaka',
      'Gazipur',
      'Narayanganj',
      'Tangail',
      'Narsingdi',
      'Munshiganj',
      'Manikganj',
      'Kishoreganj',
      'Faridpur',
      'Gopalganj',
      'Madaripur',
      'Rajbari',
      'Shariatpur',
    ],
  },
  {
    division: 'Chittagong',
    districts: [
      'Chittagong',
      'Cox\'s Bazar',
      'Comilla',
      'Feni',
      'Brahmanbaria',
      'Noakhali',
      'Chandpur',
      'Lakshmipur',
      'Rangamati',
      'Khagrachhari',
      'Bandarban',
    ],
  },
  {
    division: 'Sylhet',
    districts: ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'],
  },
  {
    division: 'Rajshahi',
    districts: [
      'Rajshahi',
      'Bogra',
      'Pabna',
      'Sirajganj',
      'Naogaon',
      'Natore',
      'Joypurhat',
      'Chapainawabganj',
    ],
  },
  {
    division: 'Khulna',
    districts: [
      'Khulna',
      'Jessore',
      'Kushtia',
      'Jhenaidah',
      'Satkhira',
      'Bagerhat',
      'Magura',
      'Chuadanga',
      'Meherpur',
      'Narail',
    ],
  },
  {
    division: 'Barisal',
    districts: [
      'Barisal',
      'Patuakhali',
      'Bhola',
      'Pirojpur',
      'Barguna',
      'Jhalokati',
    ],
  },
  {
    division: 'Rangpur',
    districts: [
      'Rangpur',
      'Dinajpur',
      'Gaibandha',
      'Kurigram',
      'Lalmonirhat',
      'Nilphamari',
      'Panchagarh',
      'Thakurgaon',
    ],
  },
  {
    division: 'Mymensingh',
    districts: ['Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur'],
  },
];

export const ALL_DISTRICTS = BANGLADESH_DIVISIONS.flatMap((d) => d.districts).sort();

export function validateBdPhone(phone: string): boolean {
  // Cleans spaces, dashes, +88 prefix
  const cleaned = phone.replace(/\s+/g, '').replace(/-/g, '').replace(/^\+88/, '');
  // Bangladesh numbers: 013, 014, 015, 016, 017, 018, 019 followed by 8 digits = 11 digits
  return /^01[3-9]\d{8}$/.test(cleaned);
}

export function formatBdPhone(phone: string): string {
  const cleaned = phone.replace(/\s+/g, '').replace(/-/g, '').replace(/^\+88/, '');
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  }
  return phone;
}
