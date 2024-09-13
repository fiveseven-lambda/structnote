import './style.css'

export async function generateMetadata({ params: { slug } }: { params: { slug: string } }) {
  return {
    title: `${ decodeURI(slug) } | ノート`
  }
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
