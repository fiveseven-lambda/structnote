'use client'

import { useSearchParams } from 'next/navigation';
import { ReactNode, useState } from 'react'

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

  let parentElement: ReactNode | undefined = undefined;
  let siblingsElement: ReactNode | undefined = undefined;
  let childrenElement: ReactNode | undefined = undefined;

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

  if (parent) {
    if (parent.text) {
      parentElement = <div className='p-2'>
        <div
          className='p-2 bg-white'
          onClick={() => jump(
            ancestorsSlug.slice(1),
            indices.slice(1)
          )}
        >
          { parent.text }
        </div>
      </div>
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
                  return <div
                    key={childIndex}
                    className='p-2'
                  >
                    <div
                      className='p-2 bg-white'
                      onClick={() => jump(
                        [siblingSlug].concat(ancestorsSlug),
                        [childIndex].concat(indices)
                      )}
                    >
                      { child.text }
                    </div>
                  </div>
                }
              })
            }
            return <div
              key={index}
              className='p-2'
            >
              <div className='p-2 bg-sky-100'>
                { sibling.text }
              </div>
            </div>
          } else {
            return <div
              key={index}
              className='p-2'
            >
              <div
                className='p-2 bg-white'
                onClick={() => jump(
                  ancestorsSlug,
                  [index].concat(indices.slice(1))
                )}
              >
                { sibling.text }
              </div>
            </div>
          }
        }
      })
    }
  }

  return <div className='flex bg-zinc-200'>
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
