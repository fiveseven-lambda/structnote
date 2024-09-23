import $ from 'jquery'
import { Text, Item } from './text.ts'

const currentParams = new URLSearchParams(location.search)

let myIndex: number | undefined
let parentSlug: string | undefined
let otherParams = new URLSearchParams

for(const [key, value] of currentParams) {
  if(key == 'parent' && parentSlug == undefined){
    parentSlug = value
  }else if(key == 'index' && myIndex == undefined){
    myIndex = Number(value)
  }else{
    otherParams.append(key, value)
  }
}

const transitionDuration = 200

if(parentSlug == undefined){
  parentSlug = ""
}
if(myIndex == undefined){
  myIndex = 0
}

function fitHeight(element: JQuery) {
  const height = element.children().outerHeight(true)
  if(height != undefined){
    element.height(height)
  }
}

function goToParent() {
  $('#grandparent').width('12vw')
  $('#parent').width('75vw')
  $('#siblings').width('12vw')
  $('#children').width('0vw')
  $('body').addClass('fade')
  setTimeout(() => location.search = otherParams.toString(), transitionDuration)
}

let goUp: () => void;
let goDown: () => void;
let goTop: () => void;
let goBottom: () => void;
let goToFirstChild: () => void;

const parent = Text[parentSlug]
let fitHeightMe: number;
if(parent){
  $('#parent').append(
    $('<div>')
    .addClass('item')
    .append(
      $('<div>')
      .addClass('content')
      .html(parent.text)
    )
    .on('click', goToParent)
  )
  const siblings = parent.children
  if(siblings){
    for(const [index, siblingSlug] of siblings.entries()){
      const sibling = Text[siblingSlug]
      if(sibling){
        const element = $('<div>')
          .addClass('item')
          .append(
            $('<div>')
            .addClass('content')
            .html(sibling.text)
          )
        if(index == myIndex){
          element.attr('id', 'me')
        }else{
          const searchParams = new URLSearchParams()
          if(parentSlug){
            searchParams.append('parent', parentSlug)
          }
          searchParams.append('index', index.toString())
          for(const [key, value] of otherParams){
            searchParams.append(key, value)
          }
          function goToSibling() {
            clearInterval(fitHeightMe)
            $('#me').height('36pt')
            fitHeight(element)
            $('body').addClass('fade')
            setTimeout(() => location.search = searchParams.toString(), transitionDuration)
          }
          if(index == 0){
            goTop = goToSibling
          }
          if(index == myIndex - 1){
            goUp = goToSibling
          }
          if(index == myIndex + 1){
            goDown = goToSibling
          }
          if(index == siblings.length - 1){
            goBottom = goToSibling
          }
          element
            .addClass('collapse')
            .on('click', goToSibling)
        }
        $('#siblings').append(element)
      }
    }
    const mySlug = siblings[myIndex]
    if(mySlug){
      const me = Text[mySlug]
      if(me){
        const children = me.children
        if(children){
          for(const [childIndex, childSlug] of children.entries()){
            const child = Text[childSlug]
            if(child){
              const searchParams = new URLSearchParams()
              searchParams.append('parent', mySlug)
              searchParams.append('index', childIndex.toString())
              for(const [key, value] of currentParams){
                searchParams.append(key, value)
              }
              const element = $('<div>')
                .addClass('item collapse')
                .append(
                  $('<div>')
                  .addClass('content')
                  .html(child.text)
                )
              function goToChild() {
                $('#parent').width('0vw')
                $('#siblings').width('12vw')
                $('#children').width('75vw')
                fitHeight(element)
                $('body').addClass('fade')
                setTimeout(() => location.search = searchParams.toString(), transitionDuration)
              }
              if(childIndex == 0){
                goToFirstChild = goToChild
              }
              $('#children').append(element.on('click', goToChild))
            }
          }
        }
      }
    }
  }
}

window.addEventListener('pageshow', event => {
  $('#grandparent').width('0vw')
  $('#parent').width('12vw')
  $('#siblings').width('75vw')
  $('#children').width('12vw')
  $('body').removeClass('fade')
  $('div.collapse').height('36pt')
  fitHeightMe = setInterval(() => fitHeight($('#me')), 100)
})

document.addEventListener("keydown", event => {
  switch(event.key){
    case 'ArrowLeft':
    case 'h':
    case 'a':
      goToParent()
      break
    case 'ArrowUp':
    case 'k':
    case 'w':
      goUp()
      break
    case 'ArrowDown':
    case 'j':
    case 's':
      goDown()
      break
    case 'ArrowRight':
    case 'l':
    case 'd':
      goToFirstChild()
      break
    case 'PageUp':
      goTop()
      break
    case 'PageDown':
      goBottom()
  }
})
