import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Unwind Mobile',
    short_name: 'Unwind',
    description: 'A calm, supportive mental health companion for students.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FDFBF9',
    theme_color: '#4F3422',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
