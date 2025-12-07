import { Header } from '../../components/Header/Header'

export const Upload = () => {
  return (
    <>
      <Header />
      <div>
        <h1>Upload Page</h1>
        <p>This page will display a form for uploading images.</p>
        <p>Uploaded images will be stored in IndexedDB with file metadata.</p>
      </div>
    </>
  )
}
