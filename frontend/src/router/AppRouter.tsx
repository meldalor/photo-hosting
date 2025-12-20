import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { ProtectedRoute } from './ProtectedRoute'
import { AlbumDetail } from '../pages/AlbumDetail/AlbumDetail'
import { Albums } from '../pages/Albums/Albums'
import { Favorites } from '../pages/Favorites/Favorites'
import { Gallery } from '../pages/Gallery/Gallery'
import { Home } from '../pages/Home/Home'
import { Login } from '../pages/Login/Login'
import { PhotoDetail } from '../pages/PhotoDetail/PhotoDetail'
import { Register } from '../pages/Register/Register'
import { Upload } from '../pages/Upload/Upload'

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/photo/:id" element={<PhotoDetail />} />
        <Route path="/albums/:id" element={<AlbumDetail />} />

        <Route
          path="/gallery"
          element={
            <ProtectedRoute>
              <Gallery />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/albums"
          element={
            <ProtectedRoute>
              <Albums />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
