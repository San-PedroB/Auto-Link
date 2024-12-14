import { inject, Injectable } from '@angular/core';
import { Firestore, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updatePassword,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  getDocs,
  getDoc,
  query,
  where,
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  firestore: Firestore = inject(Firestore);
  private auth = getAuth();

  constructor() {
    console.log('FirestoreService constructor');
  }

  // Método para obtener el correo del usuario autenticado
  getCorreoUsuarioActual(): string | null {
    return this.auth.currentUser?.email || null;
  }

  async getViajeActual(viajeId: string): Promise<any> {
    return this.getDocument('viajes', viajeId);
  }

  async getViajesPendientes(): Promise<any[]> {
    return this.getDocumentsByQuery('viajes', 'estado', 'pendiente');
  }

  // Método para enviar correo de restablecimiento de contraseña
  async restablecerContrasena(correo: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, correo);
      console.log('Correo de restablecimiento enviado con éxito.');
    } catch (error) {
      console.error('Error al enviar el correo de restablecimiento:', error);
      throw error;
    }
  }

  // Método para registrar usuario en Firebase Authentication
  async registrarUsuarioFirebase(
    correo: string,
    contrasena: string
  ): Promise<string> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        correo,
        contrasena
      );
      console.log(
        'Usuario registrado en Firebase Authentication:',
        userCredential.user.uid
      );
      return userCredential.user.uid;
    } catch (error) {
      console.error(
        'Error al registrar usuario en Firebase Authentication:',
        error
      );
      throw error;
    }
  }

  // Método para obtener el correo del usuario autenticado
  getUsuarioActualCorreo(): string | null {
    return this.auth.currentUser?.email || null;
  }

  // Método para validar la contraseña actual
  async validarContrasenaActual(
    correo: string,
    contrasena: string
  ): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, correo, contrasena);
      console.log('Contraseña actual validada con éxito.');
      console.log('Correo utilizado para validar contraseña:', correo);
    } catch (error) {
      console.error('Error al validar la contraseña actual:', error);
      throw error;
    }
  }

  // Método para actualizar la contraseña del usuario autenticado
  async actualizarContrasena(nuevaContrasena: string): Promise<void> {
    try {
      const usuario = this.auth.currentUser;
      if (!usuario) throw new Error('No hay un usuario autenticado.');
      await updatePassword(usuario, nuevaContrasena);
      console.log('Contraseña actualizada con éxito.');
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      throw error;
    }
  }

  // Métodos existentes (no modificados)
  async getDocument(nombreColeccion: string, id: string): Promise<any> {
    const referenciaDocumento = doc(this.firestore, `${nombreColeccion}/${id}`);
    const documento = await getDoc(referenciaDocumento);

    if (documento.exists()) {
      return { id: documento.id, ...documento.data() };
    } else {
      console.warn(
        `No se encontró ningún documento con ID: ${id} en la colección ${nombreColeccion}`
      );
      return null;
    }
  }

  async iniciarSesion(correo: string, contrasena: string): Promise<any> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        correo,
        contrasena
      );
      console.log('Inicio de sesión exitoso:', userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  async createDocument(collectionName: string, data: any): Promise<string> {
    const collectionRef = collection(this.firestore, collectionName);
    const docRef = await addDoc(collectionRef, data);
    console.log('Documento creado con ID:', docRef.id);
    return docRef.id;
  }

  async getDocumentsByQuery(
    collectionName: string,
    field: string,
    value: any
  ): Promise<any[]> {
    const collectionRef = collection(this.firestore, collectionName);
    const queryFilter = query(collectionRef, where(field, '==', value));
    const querySnapshot = await getDocs(queryFilter);

    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async actualizarEstadoViaje(
    viajeId: string,
    nuevoEstado: string
  ): Promise<void> {
    const viajeRef = doc(this.firestore, `viajes/${viajeId}`);
    await updateDoc(viajeRef, { estado: nuevoEstado });
    console.log(
      `Estado del viaje con ID ${viajeId} actualizado a ${nuevoEstado}`
    );
  }

  async eliminarViaje(viajeId: string): Promise<void> {
    console.log('Intentando eliminar el viaje con ID:', viajeId);

    if (!viajeId) {
      console.error('ID del viaje no es válido. No se puede eliminar.');
      return;
    }

    try {
      const referenciaDocumento = doc(this.firestore, `viajes/${viajeId}`);
      console.log('Referencia del documento:', referenciaDocumento);

      await deleteDoc(referenciaDocumento);
      console.log(
        `Viaje con ID ${viajeId} eliminado correctamente de Firestore.`
      );
    } catch (error) {
      console.error(`Error al eliminar el viaje con ID ${viajeId}:`, error);
      throw error;
    }
  }

  async verificarViajeActivo(correoConductor: string): Promise<boolean> {
    const viajes = await this.getDocumentsByQuery(
      'viajes',
      'conductorCorreo',
      correoConductor
    );

    return viajes.some(
      (viaje) => viaje.estado === 'pendiente' || viaje.estado === 'aceptado'
    );
  }
}
