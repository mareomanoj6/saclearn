export const LINKS = {
  instagramKsuCet: 'https://www.instagram.com/ksu.cet/',
  instagramSacCet: 'https://www.instagram.com/studentassistcell_cet/',
  sacWebsite: 'https://sac.ksucet.in/',
  youtube: 'https://www.youtube.com/@STUDENTASSISTCELLCET',
  email: 'ksucetsac2024@gmail.com',
  whatsapp: 'https://wa.me/919207920722',
}

export interface Manager {
  name: string
  phone: string
  waUrl: string
}

export const MANAGERS: Manager[] = [
  { name: 'Rajath', phone: '+91 9207920722', waUrl: 'https://wa.me/919207920722' },
  { name: 'Mareo', phone: '+91 73066 41617', waUrl: 'https://wa.me/917306641617' },
  { name: 'Rohit', phone: '+91 62350 23093', waUrl: 'https://wa.me/916235023093' },
]
