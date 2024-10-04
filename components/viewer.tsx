'use client'

import { useSearchParams } from 'next/navigation';
import { ReactNode, useEffect, useRef, useState } from 'react'

export type Text = {
  [slug: string]: {
    text?: React.ReactNode
    children?: string[]
  }
};

export function Viewer({ text }: { text: Text }) {
  const searchParams = useSearchParams()
  const [ancestorsSlug, setAncestorsSlug] = useState<string[]>(() => searchParams.getAll('parent'));
  const [indices, setIndices] = useState<number[]>(() => searchParams.getAll('index').map(Number));

  const parentSlug = ancestorsSlug.length > 0 ? ancestorsSlug[0] : '';
  const currentIndex = indices.length > 0 ? indices[0] : 0;
  const parent = text[parentSlug]

  function jump(newAncestorsSlug: string[], newIndices: number[]) {
    setAncestorsSlug(newAncestorsSlug)
    setIndices(newIndices)
    const newSearchParams = new URLSearchParams();
    newAncestorsSlug.forEach((ancestorsSlug, i) => {
      newSearchParams.append('parent', ancestorsSlug);
      newSearchParams.append('index', newIndices[i].toString());
    });
    if (newIndices.length > newAncestorsSlug.length) {
      newSearchParams.append('index', newIndices[newAncestorsSlug.length].toString());
    }
    window.history.pushState(null, '', `?${newSearchParams.toString()}`)
  }

  let parentElement: ReactNode | undefined = undefined;
  let siblingsElement: ReactNode | undefined = undefined;
  let childrenElement: ReactNode | undefined = undefined;

  let moveLeft = () => {}
  let moveRight = () => {}
  let moveUp = () => {}
  let moveDown = () => {}
  let moveTop = () => {}
  let moveBottom = () => {}

  if (parent) {
    if (parent.text) {
      const move = () => jump(
        ancestorsSlug.slice(1),
        indices.slice(1)
      );
      parentElement = <div className='p-2'>
        <div
          className='p-2 bg-zinc-50'
          onClick={move}
        >
          { parent.text }
        </div>
      </div>
      moveLeft = move
    }
    const siblings = parent.children;
    if (siblings) {
      siblingsElement = siblings.map((siblingSlug, index) => {
        const sibling = text[siblingSlug]
        if (sibling) {
          if (index == currentIndex) {
            const children = sibling.children;
            if (children) {
              childrenElement = children.map((childSlug, childIndex) => {
                const child = text[childSlug]
                if (child) {
                  const move = () => jump(
                    [siblingSlug].concat(ancestorsSlug),
                    [childIndex].concat(indices)
                  )
                  if (childIndex == 0) {
                    moveRight = move
                  }
                  return <div
                    key={childIndex}
                    className='p-2'
                  >
                    <div
                      className='p-2 bg-zinc-50'
                      onClick={move}
                    >
                      { child.text }
                    </div>
                  </div>
                }
              })
            }
            return <div
              key={index}
              className='p-2 bg-sky-50'
            >
              <div className='p-2 bg-white'>
                { sibling.text }
              </div>
            </div>
          } else {
            const move = () => jump(
              ancestorsSlug,
              [index].concat(indices.slice(1))
            )
            if (index == 0) {
              moveTop = move
            }
            if (index == currentIndex - 1) {
              moveUp = move
            }
            if (index == currentIndex + 1) {
              moveDown = move
            }
            if (index == siblings.length - 1) {
              moveBottom = move
            }
            return <div
              key={index}
              className='p-2'
            >
              <div
                className='p-2 bg-zinc-50 h-10 overflow-hidden'
                onClick={move}
              >
                { sibling.text }
              </div>
            </div>
          }
        }
      })
    }
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      switch(event.key){
        case 'ArrowLeft':
        case 'h':
        case 'a':
          moveLeft()
          break
        case 'ArrowUp':
        case 'k':
        case 'w':
          moveUp()
          break
        case 'ArrowDown':
        case 'j':
        case 's':
          moveDown()
          break
        case 'ArrowRight':
        case 'l':
        case 'd':
          moveRight()
          break
        case 'PageUp':
          moveTop()
          break
        case 'PageDown':
          moveBottom()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  })

  return <div className='flex bg-zinc-300'>
    <div className='w-1/5'>
      { parentElement }
    </div>
    <div className='w-3/5'>
      { siblingsElement }
    </div>
    <div className='w-1/5'>
      { childrenElement }
    </div>
  </div>
}
