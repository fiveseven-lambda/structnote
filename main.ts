import $ from 'jquery'
import text from './text.ts'

const params = new URLSearchParams(location.search)

let currentSlug: string | null = null
let paramsButCurrent = new URLSearchParams
let parentSlug: string | null = null
let paramsButCurrentOrParent = new URLSearchParams

for(const [key, value] of params) {
  if(key == 'page' && currentSlug == null){
    currentSlug = value
    continue
  }
  paramsButCurrent.append(key, value)
  if(key == 'parent' && parentSlug == null){
    parentSlug = value
    continue
  }
  paramsButCurrentOrParent.append(key, value)
}

function fitHeight(element) {
  const height = element.children().height()
  if(height != undefined){
    element.height(height)
  }
}

const transitionDuration = 250

if(currentSlug){
  const current = text[currentSlug]
  if(current){
    $('#current').append($('<div>').addClass('content').html(current.text))
    if(current.children != undefined) {
      for(const childSlug of current.children) {
        const child = text[childSlug]
        if(child){
          $('#children').append(
            $('<div>')
              .addClass('content child')
              .append($('<div>').addClass('content').html(child.text))
              .on('mouseenter', event => {
                fitHeight($(event.currentTarget))
              })
              .on('click', event => {
                const searchParams = new URLSearchParams()
                searchParams.append('page', childSlug)
                searchParams.append('parent', currentSlug)
                for(const [key, value] of paramsButCurrent){
                  searchParams.append(key, value)
                }
                $('#parent').css('width', '0%')
                $('#siblings')
                  .css('padding', '')
                  .css('width', '15%')
                $('#children')
                  .css('padding', '10pt')
                  .css('width', '70%')
                $('#children').off('mouseleave')
                setTimeout(() => location.search = searchParams.toString(), transitionDuration)
              })
          ).on('mouseleave', event => {
            $(event.currentTarget).children().each((i, child) => {
              $(child).height('')
            })
          })
        }
      }
    }
  }
}

if(parentSlug){
  const parent = text[parentSlug]
  if(parent){
    $('#parent')
    .append($('<div>').addClass('content').html(parent.text))
    .on('click', event => {
      const searchParams = new URLSearchParams()
      searchParams.append('page', parentSlug)
      for(const [key, value] of paramsButCurrentOrParent){
        searchParams.append(key, value)
      }
      $('#grandparent').css('width', '15%')
      $('#parent').css('width', '70%')
      $('#siblings').css('width', '15%')
      $('#children').css('width', '0%')
      setTimeout(() => location.search = searchParams.toString(), transitionDuration)
    })
  }
  if(currentSlug){
    const siblings = parent.children ?? []
    const index = siblings.indexOf(currentSlug)
    if(index > 0){
      const prevSlug = siblings[index - 1];
      const prev = text[prevSlug]
      if(prev){
        $('#prev')
        .append($('<div>').addClass('content').html(prev.text))
        .on('click', event => {
          const searchParams = new URLSearchParams()
          searchParams.append('page', prevSlug)
          for(const [key, value] of paramsButCurrent){
            searchParams.append(key, value)
          }
          fitHeight($('#prev'))
          $('#current').height('36pt')
          $('#next').height('0')
          setTimeout(() => location.search = searchParams.toString(), transitionDuration)
        })
      }
    }
    if(index < siblings.length - 1){
      const nextSlug = siblings[index + 1];
      const next = text[nextSlug]
      if(next){
        $('#next')
        .append($('<div>').addClass('content').html(next.text))
        .on('click', event => {
          const searchParams = new URLSearchParams()
          searchParams.append('page', nextSlug)
          for(const [key, value] of paramsButCurrent){
            searchParams.append(key, value)
          }
          fitHeight($(event.currentTarget))
          $('#prev').height('0')
          $('#current').height('36pt')
          setTimeout(() => location.search = searchParams.toString(), transitionDuration)
        })
      }
    }
  }
}


$('#grandparent').css('width', '0%')
$('#parent').css('width', '15%')
$('#prev').height('36pt')
$('#next').height('36pt')
$('#siblings')
  .css('padding', '10pt')
  .css('width', '70%')
fitHeight($('#current'))
$('#children').css('width', '15%')
