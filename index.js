import $ from 'jquery'
import Text from './text.md'

const indices = new URLSearchParams(location.search).get('i').split(',')
let slug = ''

for (let i = 0; i < 3; i++) {
  $('#main').append($('<div>'))
}
for (const index of indices) {
  slug = Text[slug].c[index]
  $('#main').append($('<div>'))
}

const generations = $('#main').children()
const num_generations = generations.length
generations.each((index, element) => {
  switch(num_generations - index) {
    case 1:
    case 3:
      $(element).width('15vw')
      break
    case 2:
      $(element).width('70vw')
      $(element).html(Text[slug].h)
  }
});
