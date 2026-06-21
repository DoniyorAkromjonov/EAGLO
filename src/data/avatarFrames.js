import frameGold from '../assets/ramka/image_2026-05-14_11-04-46.png'
import frameGreen from '../assets/ramka/image_2026-05-14_11-01-58.png'
import frameBlue from '../assets/ramka/image_2026-05-14_10-53-32.png'

export const AVATAR_FRAME_PRICE = 50

export const AVATAR_FRAMES = [
  {
    id: 'frame-gold',
    name: 'Золотая рамка',
    image: frameGold,
  },
  {
    id: 'frame-green',
    name: 'Изумрудная рамка',
    image: frameGreen,
  },
  {
    id: 'frame-blue',
    name: 'Кристальная рамка',
    image: frameBlue,
  },
]

export function getAvatarFrame(frameId) {
  return AVATAR_FRAMES.find((frame) => frame.id === frameId) || null
}
