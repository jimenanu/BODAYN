import { useEffect, useMemo, useRef, useState } from 'react'
import './recuerdos.css'

import { initializeApp } from 'firebase/app'
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyBNLzfPQ-8vONgthJDRl-aPGJo2vf-R-tE',
  authDomain: 'bodayn-recuerdos.firebaseapp.com',
  projectId: 'bodayn-recuerdos',
  storageBucket: 'bodayn-recuerdos.firebasestorage.app',
  messagingSenderId: '184988484510',
  appId: '1:184988484510:web:05ef10be9f12b4a0328c8f',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

function Recuerdos() {
  const [user, setUser] = useState(null)
  const [photos, setPhotos] = useState([])
  const [guestName, setGuestName] = useState(() => localStorage.getItem('guestName') || '')
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState('')
  const fileRef = useRef(null)

  useEffect(() => {
    signInAnonymously(auth).catch(console.error)

    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return () => unsub()
  }, [])

  useEffect(() => {
    const q = query(collection(db, 'photos'), orderBy('uploadedAt', 'desc'))

    const unsub = onSnapshot(q, (snapshot) => {
      setPhotos(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
    })

    return () => unsub()
  }, [])

  const momentsText = useMemo(() => {
    return photos.length === 1 ? '1 moment shared' : `${photos.length} moments shared`
  }, [photos.length])

  const saveName = () => {
    localStorage.setItem('guestName', guestName.trim())
    setMessage('Name saved 🤍')
    setTimeout(() => setMessage(''), 1800)
  }

  const uploadPhoto = async (file) => {
    if (!user || !file) return

    if (!file.type.startsWith('image/')) {
      setMessage('Please choose an image.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage('Please upload a photo under 10 MB.')
      return
    }

    try {
      setIsUploading(true)
      setMessage('Uploading your memory...')

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
      const fileName = `${Date.now()}-${safeName}`
      const storagePath = `photos/${user.uid}/${fileName}`
      const photoRef = ref(storage, storagePath)

      await uploadBytes(photoRef, file, {
        contentType: file.type,
      })

      const url = await getDownloadURL(photoRef)

      await addDoc(collection(db, 'photos'), {
        uid: user.uid,
        guestName: guestName.trim() || 'Guest',
        imageUrl: url,
        storagePath,
        uploadedAt: serverTimestamp(),
      })

      setMessage('Thank you — your memory was added ✨')
      setTimeout(() => setMessage(''), 2500)
    } catch (error) {
      console.error(error)
      setMessage('Something went wrong. Please try again.')
    } finally {
      setIsUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const deletePhoto = async (photo) => {
    if (!user || photo.uid !== user.uid) return

    try {
      await deleteObject(ref(storage, photo.storagePath))
      await deleteDoc(doc(db, 'photos', photo.id))
      setMessage('Photo removed.')
      setTimeout(() => setMessage(''), 1800)
    } catch (error) {
      console.error(error)
      setMessage('Could not delete this photo.')
    }
  }

  return (
    <main className="memoriesPage">
      <section className="memoriesHero">
        <p className="memoriesDate">July 11, 2026</p>
        <h1>Rafael &amp; Jimena</h1>
        <p className="memoriesCopy">
          Help us relive our wedding through your eyes.
        </p>

        <div className="nameCard">
          <label>Your name <span>optional</span></label>
          <div className="nameRow">
            <input
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="e.g. Ana"
            />
            <button type="button" onClick={saveName}>Save</button>
          </div>
        </div>

        <input
          ref={fileRef}
          className="hiddenInput"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => uploadPhoto(e.target.files?.[0])}
        />

        <button
          type="button"
          className="uploadButton"
          disabled={isUploading || !user}
          onClick={() => fileRef.current?.click()}
        >
          {isUploading ? 'Uploading...' : '📸 Share a Memory'}
        </button>

        <p className="counter">♡ {momentsText}</p>

        {message && <p className="statusMessage">{message}</p>}
      </section>

      <section className="gallerySection">
        {photos.length === 0 ? (
          <div className="emptyGallery">
            <p>No memories yet.</p>
            <span>Be the first to share one 🤍</span>
          </div>
        ) : (
          <div className="masonryGrid">
            {photos.map((photo) => (
              <article className="photoCard" key={photo.id}>
                <img src={photo.imageUrl} alt={`Memory from ${photo.guestName || 'guest'}`} loading="lazy" />
                <div className="photoMeta">
                  <span>{photo.guestName || 'Guest'}</span>
                  {user?.uid === photo.uid && (
                    <button type="button" onClick={() => deletePhoto(photo)}>
                      Delete
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Recuerdos
