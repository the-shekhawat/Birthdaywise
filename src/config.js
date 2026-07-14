// ────────────────────────────────────────────────────────────────
// Edit everything in this one file to make the site about your
// person. Nothing else in /src needs to change for basic use.
// ────────────────────────────────────────────────────────────────

export const site = {
  personName: 'Bittu',
  age: 20,
  birthdayDate: '2026-07-20T00:00:00', // ISO date the countdown targets
  birthYear: '2006', // used as the passcode on the opening lock screen
  tagline: 'To my favorite person to annoy and be annoyed by — happy birthday, Bittu.',

  // Set to a real mp3 path in /public (e.g. "/song.mp3") to enable music.
  // Leave as null and the music button will just stay hidden.
  musicSrc: null,

  heroPhotoEmoji: '🎂', // swap the hero block for a real <img> if you have a photo
  heroPhotoUrl: '/images/hero-photo.jpg', // real photo shown in the hero portrait frame

  // Milk & Mocha style bear gifs shown in the "Us" section and finale.
  bears: [
    { src: '/images/2.gif', caption: 'us, basically' },
    { src: '/images/mocha-and-milk-bears-milk.gif', caption: 'every single day growing up' },
    { src: '/images/i-miss-you-bear-milk-and-mocha.gif', caption: 'when you\'re not home' },
  ],

  letter: `My dear Bittu,

I still don't know how you went from the little kid stealing my stuff to someone I genuinely, actually like being around. Growing up with you has been one of the best parts of my life, even on the days I'd never admit it out loud.

Today isn't really about the cake, though we're definitely having some. It's about pausing for one whole day to say thank you — for the fights that never lasted, the inside jokes nobody else gets, and the way you've always had my back without me having to ask.

I hope this year brings you everything you're hoping for, and a bunch of things you didn't even know to hope for yet.

Happy birthday, Bittu. So glad you're my sibling.

— Love, your sibling`,

  timeline: [
    { year: '2006', label: 'You Arrived', note: 'The whole house rearranged itself around one very loud, very small human.' },
    { year: '2012', label: 'Partners in Crime', note: 'Every shared secret, every "don\'t tell Mom," starts around here.' },
    { year: '2018', label: 'Growing Up Fast', note: 'Somewhere in here you stopped being "the little one" and started having actual opinions.' },
    { year: '2022', label: 'A Real Friendship', note: 'Sibling turned into someone I\'d actually choose as a friend.' },
    { year: '2026', label: 'Happy Birthday', note: 'Twenty years of you being exactly, unapologetically yourself.' },
  ],

  reasons: [
    'Your laugh that gives you away instantly',
    'You always know exactly how to annoy me',
    'You also always know how to cheer me up',
    'Your terrible, unforgettable jokes',
    'The way you defend our family without hesitation',
    'You dance badly and without any shame',
    'You notice when I\'m having an off day',
    'Your handwriting still looks like homework from 2015',
    'You keep the small promises, not just the big ones',
    'You make ordinary days at home feel like an occasion',
  ],

  quiz: {
    question: 'Who\'s the most annoying-but-favorite sibling ever?',
    options: ['The neighbor', 'The dog', 'You', 'Nobody'],
    correctIndex: 2,
    correctMessage: '❤️ Obviously You, Bittu ❤️',
  },

  gifts: [
    { emoji: '🎁', title: 'Open me first', message: 'A whole day where nobody\'s allowed to touch your stuff without asking. Even me.' },
    { emoji: '💌', title: 'A little note', message: 'You\'re hands down the best sibling I could\'ve been stuck with.' },
    { emoji: '🎶', title: 'Our song', message: 'Play it loud. You know the one we always scream-sing to in the car.' },
  ],

  scratchCard: {
    revealMessage: 'Your favorite food, ordered tonight, no arguments. 🍰',
  },

  secretPassword: {
    hint: 'Hint: our childhood pet\'s name',
    answer: 'coco',
    unlockedMessage: 'Surprise unlocked — the gift you\'ve been hinting at for weeks is yours. 🎉',
  },

  wishWallSeed: [
    { name: 'Mom', message: 'Happy birthday my Bittu, so proud of the person you\'ve become every single day.' },
    { name: 'Dad', message: 'Twenty years of you keeping this house loud and lively. Happy birthday!' },
    { name: 'Your sibling', message: 'You deserve every good thing coming your way this year. Love you, Bittu.' },
  ],

  finalMessage: 'Thank you for being my favorite person to grow up with.',
}
