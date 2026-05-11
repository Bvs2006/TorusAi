// utils/firebase/admin.ts
import * as admin from 'firebase-admin'
import fs from 'fs'
import path from 'path'

function loadServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON

  if (raw) {
    try {
      return JSON.parse(raw)
    } catch {
      // Fall through to the local .env parser below. In development this value
      // is sometimes pasted with physical line breaks inside the JSON.
    }
  }

  try {
    const envPath = path.join(process.cwd(), '.env.local')
    const envText = fs.readFileSync(envPath, 'utf8')
    const marker = 'FIREBASE_SERVICE_ACCOUNT_JSON='
    const start = envText.indexOf(marker)
    if (start === -1) return null

    const afterMarker = envText.slice(start + marker.length)
    const nextSection = afterMarker.search(/\r?\n#\s*[─-]+\s*Groq/i)
    const jsonBlock = (nextSection === -1 ? afterMarker : afterMarker.slice(0, nextSection)).trim()
    const compactJson = jsonBlock.replace(/\r?\n/g, '')
    return JSON.parse(compactJson)
  } catch (error) {
    console.warn('Firebase Admin service account could not be parsed. Falling back to projectId-only init.', error)
    return null
  }
}

if (!admin.apps.length) {
  const serviceAccount = loadServiceAccount()

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  } else {
    // Dev fallback using project ID only (limited functionality)
    admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    })
  }
}

export const adminAuth = admin.auth()
export const adminDb = admin.firestore()
