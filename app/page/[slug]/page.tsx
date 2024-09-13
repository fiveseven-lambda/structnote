'use client'

import { notFound, useSearchParams } from 'next/navigation'
import Text from '@/text/index'
import Link from 'next/link'

export default function Page({ params: { slug } }: { params: { slug: string }}) {
  const current_slug = decodeURI(slug);

  const searchParams = useSearchParams()
  let parent_slug = null;
  let otherParams = new URLSearchParams()
  for (const [key, value] of searchParams) {
    if (parent_slug == null && key == 'parent') {
      parent_slug = value
    } else {
      otherParams.append(key, value)
    }
  }

  if (!(current_slug in Text)) {
    notFound()
  }

  let parent;
  let prev;
  let next;
  if (parent_slug) {
    if (Text[parent_slug]) {
      parent = <div className='parent'>
        <Link href={`${ parent_slug }?${ otherParams.toString() }`}>
          { Text[parent_slug].text }
        </Link>
      </div>
      const siblings = Text[parent_slug].children ?? []
      const index = siblings.indexOf(current_slug)
      if(index != -1){
      }
      if (index > 0) {
        const prev_slug = siblings[index - 1];
        if (Text[prev_slug]) {
          prev = <Link href={`${ prev_slug }?${ searchParams.toString() }`}>
            { Text[prev_slug].text }
          </Link>
        } else {
          prev = <p> { prev_slug } </p>
        }
      } else {
        prev = <div></div>
      }
      if(index < siblings.length - 1){
        const next_slug = siblings[index + 1];
        if (Text[next_slug]) {
          next = <Link href={`${ next_slug }?${ searchParams.toString() }`}>
            { Text[next_slug].text }
          </Link>
        } else {
          next = <p> { next_slug } </p>
        }
      } else {
        next = <div></div>
      }
    } else {
      parent = <p> { parent_slug } </p>
    }
  } else {
    parent = <div className='null'></div>
  }

  const children = (Text[current_slug].children ?? []).map((child, i) => {
    if (Text[child]) {
      let newSearchParams
      if (searchParams.size == 0) {
        newSearchParams = `parent=${ current_slug }`
      } else {
        newSearchParams = `parent=${ current_slug }&${ searchParams.toString() }`
      }
      return <div className='child' key={i}>
        <Link href={ `${ child }?${ newSearchParams }` }>
          { Text[child] && Text[child].text }
        </Link>
      </div>
    } else {
      return <div className='fetus' key={i}>
        <p> { child } </p>
      </div>
    }
  });

  return <div className='flex'>
    { parent }
    <div className='siblings'>
      <div className='prev'> { prev } </div>
      <div className='current'> { Text[current_slug].text } </div>
      <div className='next'> { next } </div>
    </div>
    <div className='children'> { children } </div>
  </div>
}
