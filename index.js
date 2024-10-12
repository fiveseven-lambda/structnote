import $ from 'jquery'
import Text from './text.md'

const indices = new URLSearchParams(location.search).get('i').split('.')
let slug = ''

for (const index of indices) {
  slug = Text[slug].c[index]
  $('#main').append($('<div>').html('<h2>' + slug + '</h2>' + Text[slug].h))
}
