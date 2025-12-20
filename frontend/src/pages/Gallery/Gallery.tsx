import { Header } from '../../components/Header/Header'

export const Gallery = () => {
  return (
    <>
      <Header />
      <div>
        <h1>Gallery Page</h1>
        <p>This page will display an adaptive grid of photos using the Gallery component from UI library.</p>
        <p>Photos will be loaded from IndexedDB and filtered by the current user.</p>
      </div>
    </>
  )
}
